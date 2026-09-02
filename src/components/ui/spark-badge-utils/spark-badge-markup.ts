export const SPARK_BADGE_MARKUP = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #000; }
      canvas { display: block; width: 100%; height: 100%; background: #000; }
    </style>
  </head>
  <body>
    <canvas id="rain-card"></canvas>
    <script>
      const canvas = document.getElementById("rain-card");
      const ctx = canvas.getContext("2d");
      let width = 0, height = 0, dpr = 1, drops = [];
      const rand = (min, max) => min + Math.random() * (max - min);

      function resetDrop(drop, initial) {
        drop.x = rand(-width * .2, width * 1.15);
        drop.y = initial ? rand(-height, height) : rand(-height * .35, -12);
        drop.length = rand(10, 42);
        drop.speed = rand(5.5, 13);
        drop.alpha = rand(.14, .74);
        drop.lineWidth = Math.random() > .84 ? 1.15 : .55;
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drops = Array.from({ length: Math.max(88, Math.round(width * .32)) }, () => {
          const drop = {};
          resetDrop(drop, true);
          return drop;
        });
      }

      function grainLine(x1, y1, x2, y2, density = 1) {
        const dx = x2 - x1, dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const count = Math.max(18, Math.round(length * density * .55));
        ctx.lineCap = "round";
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          const jitter = rand(-2.4, 2.4);
          const px = x1 + dx * t + jitter;
          const py = y1 + dy * t + jitter;
          const angle = Math.atan2(dy, dx) + rand(-.6, .6);
          const fragment = rand(1.4, 6.5);
          ctx.globalAlpha = rand(.24, .92);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = rand(.38, 1.2);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(angle) * fragment, py + Math.sin(angle) * fragment);
          ctx.stroke();
        }
      }

      function edge(x1, y1, x2, y2, density = 1) {
        for (let pass = 0; pass < 4; pass++) {
          grainLine(
            x1 + rand(-1.6, 1.6), y1 + rand(-1.6, 1.6),
            x2 + rand(-1.6, 1.6), y2 + rand(-1.6, 1.6),
            density
          );
        }
      }

      function label(text, x, y, size, weight = 500, align = "left") {
        ctx.save();
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.font = weight + " " + size + "px ui-monospace, SFMono-Regular, Menlo, monospace";
        for (let pass = 0; pass < 3; pass++) {
          ctx.globalAlpha = .18;
          ctx.fillStyle = "#fff";
          ctx.fillText(text, x + rand(-1, 1), y + rand(-1, 1));
        }
        ctx.globalAlpha = .78;
        ctx.fillText(text, x, y);
        ctx.restore();
      }

      function drawBadge(now) {
        const unit = Math.min(width / 560, height / 680);
        const cardW = 340 * unit;
        const cardH = 480 * unit;
        const cx = width * .5;
        const cy = height * .52;
        const left = -cardW / 2, top = -cardH / 2;
        const right = cardW / 2, bottom = cardH / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-.045);
        edge(left, top, right, top, 1.35);
        edge(right, top, right, bottom, 1.35);
        edge(right, bottom, left, bottom, 1.35);
        edge(left, bottom, left, top, 1.35);

        const pad = 30 * unit;
        edge(left + pad, top + 72 * unit, right - pad, top + 72 * unit, .85);
        edge(left + pad, bottom - 83 * unit, right - pad, bottom - 83 * unit, .85);
        edge(0, top + 92 * unit, 0, bottom - 102 * unit, .65);

        edge(left + pad, top + 28 * unit, left + 95 * unit, top + 28 * unit, .8);
        label("YB//", left + pad, top + 34 * unit, 12 * unit, 700);
        label("PORTFOLIO ACCESS", right - pad, top + 34 * unit, 9 * unit, 600, "right");

        label("YOUNG", left + pad, top + 120 * unit, 30 * unit, 800);
        label("BIN", left + pad, top + 158 * unit, 30 * unit, 800);
        label("GAME CLIENT", left + pad, top + 199 * unit, 10 * unit, 700);
        label("PROGRAMMER", left + pad, top + 216 * unit, 10 * unit, 700);

        edge(left + pad, top + 249 * unit, right - pad, top + 249 * unit, .7);
        label("SELECTED PROJECTS", left + pad, top + 277 * unit, 9 * unit, 600);
        label("03", right - pad, top + 277 * unit, 12 * unit, 700, "right");
        label("KARTRIDER  /  INVERSUS  /  RE:ADAPT", left + pad, top + 304 * unit, 8 * unit, 500);

        edge(left + pad, bottom - 52 * unit, left + 112 * unit, bottom - 52 * unit, .8);
        edge(right - 112 * unit, bottom - 52 * unit, right - pad, bottom - 52 * unit, .8);
        label("OPEN FILE", left + pad, bottom - 30 * unit, 9 * unit, 700);
        label("NEXON / 2026", right - pad, bottom - 30 * unit, 9 * unit, 700, "right");
        ctx.restore();
      }

      function frame(now) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);

        for (const drop of drops) {
          ctx.globalAlpha = drop.alpha;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = drop.lineWidth;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - drop.length * .42, drop.y + drop.length);
          ctx.stroke();
          drop.x -= drop.speed * .33;
          drop.y += drop.speed;
          if (drop.y > height + 42 || drop.x < -72) resetDrop(drop, false);
        }

        drawBadge(now);
        requestAnimationFrame(frame);
      }

      window.addEventListener("resize", resize);
      resize();
      requestAnimationFrame(frame);
    </script>
  </body>
</html>`;
