export const SPARK_BADGE_MARKUP = String.raw`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #000; }
      canvas { display: block; width: 100%; height: 100%; background: #000; cursor: pointer; }
    </style>
  </head>
  <body>
    <canvas id="nexterial-card"></canvas>
    <script>
      const canvas = document.getElementById("nexterial-card");
      const ctx = canvas.getContext("2d");
      const backRain = [], frontRain = [], splash = [], cardDust = [], textDust = [];
      const rand = (a, b) => a + Math.random() * (b - a);
      let width = 0, height = 0, dpr = 1, cardSize = { w: 0, h: 0 };

      function resetDrop(drop, initial, foreground) {
        drop.x = rand(-width * .12, width * 1.12);
        drop.y = initial ? rand(-height, height) : rand(-height * .25, -18);
        drop.length = foreground ? rand(16, 42) : rand(12, 34);
        drop.speed = foreground ? rand(2.7, 5.3) : rand(2.2, 4.4);
        drop.alpha = foreground ? rand(.34, .88) : rand(.055, .21);
        drop.weight = foreground && Math.random() > .82 ? 1.2 : .55;
      }

      function addLineDust(x1, y1, x2, y2, count) {
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          cardDust.push({
            x: x1 + (x2 - x1) * t + rand(-2, 2),
            y: y1 + (y2 - y1) * t + rand(-2, 2),
            size: rand(.45, 2.2),
            angle: rand(-.8, .8),
            alpha: rand(.2, .95),
            phase: rand(0, Math.PI * 2),
          });
        }
      }

      function makeTextDust() {
        textDust.length = 0;
        const scale = 2;
        const offscreen = document.createElement("canvas");
        offscreen.width = Math.ceil(cardSize.w * scale);
        offscreen.height = Math.ceil(cardSize.h * scale);
        const ink = offscreen.getContext("2d");
        ink.scale(scale, scale);
        ink.fillStyle = "#fff";
        ink.textAlign = "center";
        ink.textBaseline = "middle";
        ink.font = "700 " + (cardSize.w * .23) + "px Arial, sans-serif";
        ink.fillText("넥토리얼", cardSize.w / 2, cardSize.h * .44);
        ink.fillText("지원", cardSize.w / 2, cardSize.h * .59);
        const data = ink.getImageData(0, 0, offscreen.width, offscreen.height).data;
        const step = 2 * scale;
        for (let y = 0; y < offscreen.height; y += step) {
          for (let x = 0; x < offscreen.width; x += step) {
            if (data[(y * offscreen.width + x) * 4 + 3] > 100 && Math.random() > .1) {
              textDust.push({
                x: x / scale - cardSize.w / 2 + rand(-.8, .8),
                y: y / scale - cardSize.h / 2 + rand(-.8, .8),
                size: rand(.65, 1.7),
                alpha: rand(.62, 1),
                phase: rand(0, Math.PI * 2),
              });
            }
          }
        }
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cardSize.w = Math.min(width * .55, height * .65);
        cardSize.h = Math.min(height * .85, cardSize.w * 1.48);
        cardDust.length = 0;
        const l = -cardSize.w / 2, r = cardSize.w / 2, t = -cardSize.h / 2, b = cardSize.h / 2;
        addLineDust(l, t, r, t, 420);
        addLineDust(r, t, r, b, 580);
        addLineDust(r, b, l, b, 420);
        addLineDust(l, b, l, t, 580);
        makeTextDust();
        backRain.length = 0;
        frontRain.length = 0;
        for (let i = 0; i < Math.max(130, width * .17); i++) {
          const drop = {};
          resetDrop(drop, true, false);
          backRain.push(drop);
        }
        for (let i = 0; i < Math.max(115, width * .145); i++) {
          const drop = {};
          resetDrop(drop, true, true);
          frontRain.push(drop);
        }
      }

      function cardTransform(now) {
        return {
          x: width * .5 + Math.sin(now * .00031) * width * .021,
          y: height * .5 + Math.sin(now * .00043 + 1.2) * height * .018,
          rotation: Math.sin(now * .00024) * .052 + Math.cos(now * .00017) * .018,
        };
      }

      function worldToLocal(x, y, transform) {
        const dx = x - transform.x, dy = y - transform.y;
        const c = Math.cos(transform.rotation), s = Math.sin(transform.rotation);
        return { x: dx * c + dy * s, y: -dx * s + dy * c };
      }

      function localToWorld(x, y, transform) {
        const c = Math.cos(transform.rotation), s = Math.sin(transform.rotation);
        return { x: transform.x + x * c - y * s, y: transform.y + x * s + y * c };
      }

      function addSplash(x, y, normalX, normalY) {
        const count = Math.floor(rand(5, 10));
        for (let i = 0; i < count; i++) {
          const force = rand(1.7, 4.8);
          splash.push({
            x, y,
            vx: normalX * force + rand(-1.8, 1.8),
            vy: normalY * force + rand(-1.6, .6),
            life: rand(13, 28),
            maxLife: 28,
            size: rand(.45, 1.45),
          });
        }
      }

      function collide(drop, nextX, nextY, transform) {
        const a = worldToLocal(drop.x, drop.y, transform);
        const b = worldToLocal(nextX, nextY, transform);
        const dx = b.x - a.x, dy = b.y - a.y;
        const l = -cardSize.w / 2, r = cardSize.w / 2, t = -cardSize.h / 2, bot = cardSize.h / 2;
        const edges = [
          { value: l, min: t, max: bot, axis: "x", nx: -1, ny: 0 },
          { value: r, min: t, max: bot, axis: "x", nx: 1, ny: 0 },
          { value: t, min: l, max: r, axis: "y", nx: 0, ny: -1 },
          { value: bot, min: l, max: r, axis: "y", nx: 0, ny: 1 },
        ];
        for (const edge of edges) {
          const movement = edge.axis === "x" ? dx : dy;
          const start = edge.axis === "x" ? a.x : a.y;
          if (!movement) continue;
          const ratio = (edge.value - start) / movement;
          const other = edge.axis === "x" ? a.y + dy * ratio : a.x + dx * ratio;
          if (ratio >= 0 && ratio <= 1 && other >= edge.min && other <= edge.max) {
            const point = edge.axis === "x" ? { x: edge.value, y: other } : { x: other, y: edge.value };
            const world = localToWorld(point.x, point.y, transform);
            const normal = localToWorld(point.x + edge.nx, point.y + edge.ny, transform);
            addSplash(world.x, world.y, normal.x - world.x, normal.y - world.y);
            resetDrop(drop, false, true);
            return true;
          }
        }
        return false;
      }

      function drawRain(drops, foreground, transform) {
        ctx.lineCap = "round";
        for (const drop of drops) {
          const nextX = drop.x - drop.speed * .35;
          const nextY = drop.y + drop.speed;
          ctx.globalAlpha = drop.alpha;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = drop.weight;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - drop.length * .35, drop.y + drop.length);
          ctx.stroke();
          if (!foreground || !collide(drop, nextX, nextY, transform)) {
            drop.x = nextX;
            drop.y = nextY;
            if (drop.y > height + 48 || drop.x < -72) resetDrop(drop, false, foreground);
          }
        }
      }

      function drawCardParticles(particles, transform, now, isText) {
        ctx.lineCap = "round";
        for (const particle of particles) {
          const wobble = Math.sin(now * .0023 + particle.phase) * .8;
          const world = localToWorld(particle.x + wobble, particle.y, transform);
          ctx.globalAlpha = particle.alpha * (.67 + Math.sin(now * .003 + particle.phase) * .25);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = isText ? particle.size * 1.45 : particle.size;
          ctx.beginPath();
          ctx.moveTo(world.x, world.y);
          ctx.lineTo(world.x + (isText ? rand(-1.2, 1.2) : Math.cos(particle.angle) * particle.size * 3), world.y + (isText ? rand(-1.2, 1.2) : Math.sin(particle.angle) * particle.size * 3));
          ctx.stroke();
        }
      }

      function drawSplashes() {
        for (let i = splash.length - 1; i >= 0; i--) {
          const p = splash[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += .065;
          p.life -= 1;
          if (p.life <= 0) { splash.splice(i, 1); continue; }
          ctx.globalAlpha = (p.life / p.maxLife) * .95;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8);
          ctx.stroke();
        }
      }

      function frame(now) {
        const transform = cardTransform(now);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
        drawRain(backRain, false, transform);
        drawCardParticles(cardDust, transform, now, false);
        drawCardParticles(textDust, transform, now, true);
        drawRain(frontRain, true, transform);
        drawSplashes();
        requestAnimationFrame(frame);
      }

      window.addEventListener("resize", resize);
      resize();
      requestAnimationFrame(frame);
    </script>
  </body>
</html>`;
