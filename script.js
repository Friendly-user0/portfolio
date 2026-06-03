document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // SCROLL REVEAL
  // ==========================================
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));


  // ==========================================
  // MOUSE STATE
  // ==========================================
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Touch support for mobile
  window.addEventListener("touchmove", (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });


  // ==========================================
  // CURSOR — Inertia Lag + Magnetic + Ripple
  // ==========================================
  const cursorDot     = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");
  const cursorRipple  = document.getElementById("cursor-ripple");

  let dotPos     = { x: mouse.x, y: mouse.y };
  let outlinePos = { x: mouse.x, y: mouse.y };

  const SPEED_DOT     = 0.85;
  const SPEED_OUTLINE = 0.13;
  const MAGNET_RADIUS   = 90;
  const MAGNET_STRENGTH = 0.32;

  const magnetTargets = document.querySelectorAll(
    "a, summary, .stat-card, .repo-card, .glass-btn, .social-link, .pfp"
  );

  function getClosestMagnet() {
    let closest = null;
    let minDist = MAGNET_RADIUS;
    magnetTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
      if (dist < minDist) { minDist = dist; closest = { cx, cy, dist }; }
    });
    return closest;
  }

  function renderCursor() {
    dotPos.x += (mouse.x - dotPos.x) * SPEED_DOT;
    dotPos.y += (mouse.y - dotPos.y) * SPEED_DOT;

    const magnet = getClosestMagnet();
    let targetX = mouse.x;
    let targetY = mouse.y;
    if (magnet) {
      const pull = 1 - magnet.dist / MAGNET_RADIUS;
      targetX += (magnet.cx - mouse.x) * pull * MAGNET_STRENGTH;
      targetY += (magnet.cy - mouse.y) * pull * MAGNET_STRENGTH;
    }
    outlinePos.x += (targetX - outlinePos.x) * SPEED_OUTLINE;
    outlinePos.y += (targetY - outlinePos.y) * SPEED_OUTLINE;

    if (cursorDot)
      cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
    if (cursorOutline)
      cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  magnetTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => { if (cursorOutline) cursorOutline.classList.add("cursor-hover"); });
    el.addEventListener("mouseleave", () => { if (cursorOutline) cursorOutline.classList.remove("cursor-hover"); });
  });

  document.addEventListener("click", (e) => {
    if (!cursorRipple) return;
    cursorRipple.style.left = `${e.clientX}px`;
    cursorRipple.style.top  = `${e.clientY}px`;
    cursorRipple.classList.remove("burst");
    void cursorRipple.offsetWidth;
    cursorRipple.classList.add("burst");
  });


  // ==========================================
  // TERMINAL
  // ==========================================
  const termText = document.getElementById("term-text");
  let isHovering = false;
  const defaultLines = [
    "monitoring network traffic...",
    "scanning for open ports...",
    "analyzing malware signatures...",
    "bypassing rate limits...",
    "compiling threat reports...",
    "enumerating subdomains...",
    "waiting for input..."
  ];
  let lineIdx = 0;
  setInterval(() => {
    if (!isHovering && termText) {
      termText.innerText = defaultLines[lineIdx % defaultLines.length];
      lineIdx++;
    }
  }, 3200);

  document.querySelectorAll("[data-term]").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      isHovering = true;
      if (termText) termText.innerText = e.target.getAttribute("data-term");
    });
    el.addEventListener("mouseleave", () => {
      isHovering = false;
      if (termText) termText.innerText = "returning to background tasks...";
    });
  });


  // ==========================================
  // PROFILE PHOTO — Magnetic tilt
  // ==========================================
  const pfpMagnetic = document.getElementById("pfp-magnetic");
  const pfpImg      = pfpMagnetic?.querySelector(".pfp");
  if (pfpMagnetic && pfpImg) {
    document.addEventListener("mousemove", (e) => {
      const rect = pfpMagnetic.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      if (Math.hypot(dx, dy) < 3) {
        pfpImg.style.transform = `perspective(500px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale(1.04)`;
      } else {
        pfpImg.style.transform = "";
      }
    });
  }


  // ==========================================
  // CANVAS BACKGROUND
  // THE FIX: source-over blend mode + high intensities
  // so particles are fully visible on all devices
  // ==========================================
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Rich palette — vivid enough to show through source-over
  const COLORS = [
    { r: 124, g: 58,  b: 237 },  // vivid purple
    { r: 6,   g: 182, b: 212 },  // cyan
    { r: 37,  g: 99,  b: 235 },  // deep blue
    { r: 168, g: 85,  b: 247 },  // bright violet
    { r: 99,  g: 102, b: 241 },  // indigo
    { r: 20,  g: 184, b: 166 },  // teal
  ];

  const globalDrift = { x: 0, y: 0, vx: 0, vy: 0 };

  // Flow field — smooth organic currents
  function flowAngle(x, y, t) {
    const s = Math.sin(x * 0.0025 + t * 0.00045) + Math.cos(y * 0.0020 - t * 0.00038);
    const c = Math.cos(x * 0.0018 - t * 0.00042) + Math.sin(y * 0.0030 + t * 0.00030);
    return Math.atan2(s, c);
  }

  function createParticle() {
    const roll = Math.random();
    let radius, alpha, speed;

    if (roll < 0.45) {
      // Small crisp orbs — clearly visible, high alpha
      radius = Math.random() * 80  + 40;
      alpha  = 0.55 + Math.random() * 0.30;   // 0.55–0.85
      speed  = Math.random() * 0.6  + 0.2;
    } else if (roll < 0.80) {
      // Medium atmospheric orbs
      radius = Math.random() * 140 + 90;
      alpha  = 0.30 + Math.random() * 0.20;   // 0.30–0.50
      speed  = Math.random() * 0.4  + 0.1;
    } else {
      // Large soft clouds
      radius = Math.random() * 220 + 160;
      alpha  = 0.12 + Math.random() * 0.12;   // 0.12–0.24
      speed  = Math.random() * 0.2  + 0.05;
    }

    const c     = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * Math.PI * 2;

    return {
      x:             Math.random() * w,
      y:             Math.random() * h,
      r:             radius,
      vx:            Math.cos(angle) * speed,
      vy:            Math.sin(angle) * speed,
      c:             c,
      alpha:         alpha,
      parallaxDepth: radius / 180,
      flowWeight:    0.012 + Math.random() * 0.022,
      damping:       0.976 + Math.random() * 0.016,
      glowBoost:     0,
    };
  }

  const PARTICLE_COUNT = 60;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  // Draw a single orb using source-over (works on ALL devices/browsers)
  function drawOrb(p, drawX, drawY, alpha) {
    const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.r);
    const { r, g, b } = p.c;

    grad.addColorStop(0,    `rgba(${r},${g},${b},${Math.min(1, alpha)})`);
    grad.addColorStop(0.40, `rgba(${r},${g},${b},${Math.min(1, alpha * 0.5)})`);
    grad.addColorStop(0.75, `rgba(${r},${g},${b},${Math.min(1, alpha * 0.15)})`);
    grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";  // GUARANTEED visible on all devices
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animateCanvas() {
    // Clear to transparent — background color comes from CSS .bg-base
    ctx.clearRect(0, 0, w, h);

    const t = performance.now();

    // Update global drift
    globalDrift.vx += (Math.random() - 0.5) * 0.018;
    globalDrift.vy += (Math.random() - 0.5) * 0.018;
    globalDrift.vx *= 0.97;
    globalDrift.vy *= 0.97;
    globalDrift.x  = Math.max(-40, Math.min(40, globalDrift.x + globalDrift.vx));
    globalDrift.y  = Math.max(-40, Math.min(40, globalDrift.y + globalDrift.vy));

    const mouseOffsetX = (mouse.x - w / 2) * 0.04;
    const mouseOffsetY = (mouse.y - h / 2) * 0.04;

    for (const p of particles) {
      // Flow field force
      const angle = flowAngle(p.x, p.y, t);
      p.vx += Math.cos(angle) * p.flowWeight;
      p.vy += Math.sin(angle) * p.flowWeight;

      // Damping
      p.vx *= p.damping;
      p.vy *= p.damping;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      const pad = p.r * 2;
      if (p.x < -pad)    p.x = w + pad;
      if (p.x > w + pad) p.x = -pad;
      if (p.y < -pad)    p.y = h + pad;
      if (p.y > h + pad) p.y = -pad;

      // Adaptive glow — mouse proximity boosts alpha
      const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
      const prox = Math.max(0, 1 - dist / 320);
      p.glowBoost += (prox * 0.5 - p.glowBoost) * 0.07;

      const drawX = p.x - mouseOffsetX * p.parallaxDepth + globalDrift.x * 0.35;
      const drawY = p.y - mouseOffsetY * p.parallaxDepth + globalDrift.y * 0.35;

      const finalAlpha = p.alpha + p.glowBoost;

      drawOrb(p, drawX, drawY, finalAlpha);
    }

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

});
