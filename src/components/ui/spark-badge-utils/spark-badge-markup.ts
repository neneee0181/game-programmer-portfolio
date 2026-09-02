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
      const rain = [];
      const splash = [];
      const cardDust = [];
      const rand = (a, b) => a + Math.random() * (b - a);
      let width = 0, height = 0, dpr = 1, card;

      function resetDrop(drop, initial = false) {
        drop.x = rand(-width * .1, width * 1.1);
        drop.y = initial ? rand(-height, height) : rand(-height * .22, -14);
        drop.length = rand(14, 34);
        drop.speed = rand(1.35, 3.15);
        drop.alpha = rand(.16, .72);
        drop.weight = Math.random() > .86 ? 1.25 : .55;
      }

      function makeCardDust() {
        cardDust.length = 0;
        const addEdge = (x1, y1, x2, y2, amount) => {
          for (let i = 0; i < amount; i++) {
            const t = Math.random();
            cardDust.push({
              x: x1 + (x2 - x1) * t + rand(-2, 2),
              y: y1 + (y2 - y1) * t + rand(-2, 2),
              size: rand(.5, 2.4),
              angle: rand(-.55, .55),
              alpha: rand(.25, .96),
              phase: rand(0, Math.PI * 2),
            });
          }
        };
        addEdge(card.left, card.top, card.right, card.top, 250);
        addEdge(card.right, card.top, card.right, card.bottom, 350);
        addEdge(card.right, card.bottom, card.left, card.bottom, 250);
        addEdge(card.left, card.bottom, card.left, card.top, 350);
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cardWidth = Math.min(width * .39, height * .43);
        const cardHeight = Math.min(height * .72, cardWidth * 1.42);
        card = {
          left: (width - cardWidth) * .5,
          right: (width + cardWidth) * .5,
          top: (height - cardHeight) * .5,
          bottom: (height + cardHeight) * .5,
        };
        rain.length = 0;
        for (let i = 0; i < Math.max(120, Math.round(width * .19)); i++) {
          const drop = {};
          resetDrop(drop, true);
          rain.push(drop);
        }
        makeCardDust();
      }

      function addSplash(x, y, normalX, normalY) {
        const count = Math.floor(rand(4, 8));
        for (let i = 0; i < count; i++) {
          const outward = rand(1.4, 3.7);
          splash.push({
            x, y,
            vx: normalX * outward + rand(-1.7, 1.7),
            vy: normalY * outward + rand(-1.4, .5),
            life: rand(12, 25),
            maxLife: 25,
            size: rand(.45, 1.3),
          });
        }
      }

      function hitCard(drop, nextX, nextY) {
        const dx = nextX - drop.x;
        const dy = nextY - drop.y;
        const hits = [
          { x: card.left, y1: card.top, y2: card.bottom, nx: -1, ny: 0 },
          { x: card.right, y1: card.top, y2: card.bottom, nx: 1, ny: 0 },
          { y: card.top, x1: card.left, x2: card.right, nx: 0, ny: -1 },
          { y: card.bottom, x1: card.left, x2: card.right, nx: 0, ny: 1 },
        ];
        for (const edge of hits) {
          if (edge.x !== undefined && dx !== 0) {
            const t = (edge.x - drop.x) / dx;
            const y = drop.y + dy * t;
            if (t >= 0 && t <= 1 && y >= edge.y1 && y <= edge.y2) {
              addSplash(edge.x, y, edge.nx, edge.ny);
              resetDrop(drop);
              return true;
            }
          }
          if (edge.y !== undefined && dy !== 0) {
            const t = (edge.y - drop.y) / dy;
            const x = drop.x + dx * t;
            if (t >= 0 && t <= 1 && x >= edge.x1 && x <= edge.x2) {
              addSplash(x, edge.y, edge.nx, edge.ny);
              resetDrop(drop);
              return true;
            }
          }
        }
        return false;
      }

      function drawRain() {
        ctx.lineCap = "round";
        for (const drop of rain) {
          const nextX = drop.x - drop.speed * .33;
          const nextY = drop.y + drop.speed;
          ctx.globalAlpha = drop.alpha;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = drop.weight;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - drop.length * .33, drop.y + drop.length);
          ctx.stroke();
          if (!hitCard(drop, nextX, nextY)) {
            drop.x = nextX;
            drop.y = nextY;
            if (drop.y > height + 40 || drop.x < -60) resetDrop(drop);
          }
        }
      }

      function drawDust(now) {
        ctx.lineCap = "round";
        for (const grain of cardDust) {
          const flicker = .65 + Math.sin(now * .002 + grain.phase) * .25;
          ctx.globalAlpha = grain.alpha * flicker;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = grain.size;
          ctx.beginPath();
          ctx.moveTo(grain.x, grain.y);
          ctx.lineTo(grain.x + Math.cos(grain.angle) * grain.size * 3, grain.y + Math.sin(grain.angle) * grain.size * 3);
          ctx.stroke();
        }
      }

      function drawSplashes() {
        for (let i = splash.length - 1; i >= 0; i--) {
          const particle = splash[i];
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += .055;
          particle.life -= 1;
          if (particle.life <= 0) {
            splash.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = (particle.life / particle.maxLife) * .9;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = particle.size;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 1.7, particle.y - particle.vy * 1.7);
          ctx.stroke();
        }
      }

      function drawMark() {
        const size = Math.max(9, Math.min(width, height) * .0105);
        ctx.save();
        ctx.globalAlpha = .58;
        ctx.fillStyle = "#fff";
        ctx.font = "600 " + size + "px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.2em";
        ctx.fillText("NEXTERIAL APPLICATION", width * .5, card.bottom - size * 2.4);
        ctx.restore();
      }

      function frame(now) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
        drawRain();
        drawDust(now);
        drawSplashes();
        drawMark();
        requestAnimationFrame(frame);
      }

      window.addEventListener("resize", resize);
      resize();
      requestAnimationFrame(frame);
    </script>
  </body>
</html>`;
