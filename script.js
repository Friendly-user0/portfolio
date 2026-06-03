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

      if (dist < minDist) {
        minDist  = dist;
        closest  = { cx, cy, dist };
      }
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
      const pull   = 1 - magnet.dist / MAGNET_RADIUS;
      targetX     += (magnet.cx - mouse.x) * pull * MAGNET_STRENGTH;
      targetY     += (magnet.cy - mouse.y) * pull * MAGNET_STRENGTH;
    }

    outlinePos.x += (targetX - outlinePos.x) * SPEED_OUTLINE;
    outlinePos.y += (targetY - outlinePos.y) * SPEED_OUTLINE;

    if (cursorDot) {
      cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
    }

    if (cursorOutline) {
      cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  magnetTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursorOutline) cursorOutline.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      if (cursorOutline) cursorOutline.classList.remove("cursor-hover");
    });
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
  // TERMINAL MICRO-INTERACTIONS
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

  function cycleDefault() {
    if (!isHovering && termText) {
      termText.innerText = defaultLines[lineIdx % defaultLines.length];
      lineIdx++;
    }
  }

  setInterval(cycleDefault, 3200);

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
      const rect  = pfpMagnetic.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const dist  = Math.hypot(dx, dy);

      if (dist < 3) {
        const rotY =  dx * 8;
        const rotX = -dy * 8;
        pfpImg.style.transform = `perspective(500px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
      } else {
        pfpImg.style.transform = "";
      }
    });
  }


  // ==========================================
  // AUTOMATED WEEKLY MOTIVATIONAL DIRECTIVE
  // ==========================================
  const directives = [
    { text: "Discipline is choosing between what you want now and what you want most. Choose execution.", author: "System Protocol" },
    { text: "The only truly secure system is one that is powered off, cast in a block of concrete, and sealed in a lead-lined room.", author: "Gene Spafford" },
    { text: "Great projects are constructed by a series of small, persistent functions executed perfectly day after day.", author: "Production Log" },
    { text: "Knowing your vulnerability is not enough; you must apply the patch. Willing is not enough; you must deploy.", author: "Strategic Command" },
    { text: "In the absolute center of structured difficulty and chaotic source code lies optimal opportunity.", author: "Albert Einstein" },
    { text: "Amateurs bypass technical systems. Professionals bypass biological elements. Master both layers.", author: "Social Engineering Framework" },
    { text: "The secret of root access across complex environments is simply knowing where to begin scanning.", author: "Reconnaissance Module" }
  ];

  function loadWeeklyDirective() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const weekOfYear = Math.floor(dayOfYear / 7);

    const directiveIdx = weekOfYear % directives.length;
    const selected = directives[directiveIdx];

    const quoteTextEl = document.getElementById("weekly-quote");
    const quoteAuthorEl = document.getElementById("quote-author");

    if (quoteTextEl && quoteAuthorEl) {
      quoteTextEl.innerText = `"${selected.text}"`;
      quoteAuthorEl.innerText = `— ${selected.author}`;
    }
  }
  loadWeeklyDirective();


  // ==========================================
  // CANVAS BACKGROUND — RELIABLE BLENDING FIX
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

  const COLORS = [
    "139, 92, 246",  // Purple Accent
    "6, 182, 212",   // Cyan Accent
    "59, 130, 246",  // Blue Accent
    "168, 85, 247"   // Violet Accent
  ];

  const globalDrift = { x: 0, y: 0, vx: 0, vy: 0 };

  function flowAngle(x, y, t) {
    const s = Math.sin(x * 0.0025 + t * 0.00045) + Math.cos(y * 0.0020 - t * 0.00038);
    const c = Math.cos(x * 0.0018 - t * 0.00042) + Math.sin(y * 0.0030 + t * 0.00030);
    return Math.atan2(s, c);
  }

  function createParticle() {
    const radius = Math.random() * 110 + 70; // Big, simplified soft ambient blobs
    const intensity = 0.22 + Math.random() * 0.12;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.3 + 0.08;

    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: radius,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      intensity: intensity,
      parallaxDepth: radius / 150,
      flowWeight: 0.012 + Math.random() * 0.02,
      damping: 0.98,
      glowBoost: 0,
    };
  }

  const PARTICLE_COUNT = 32; // Cleaner, non-cluttered pool for fluid visual flow
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function drawOrb(p, drawX, drawY, intensityOverride) {
    const eff = intensityOverride !== undefined ? intensityOverride : p.intensity;
    const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.r);
    
    grad.addColorStop(0,    `rgba(${p.color}, ${Math.min(1, eff)})`);
    grad.addColorStop(0.4,  `rgba(${p.color}, ${Math.min(1, eff * 0.45)})`);
    grad.addColorStop(1,    `rgba(${p.color}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, w, h);
    
    // Default composite operation ensures alpha transparencies render consistently across standard browser layers
    ctx.globalCompositeOperation = "source-over";

    const t = performance.now();

    globalDrift.vx += (Math.random() - 0.5) * 0.012;
    globalDrift.vy += (Math.random() - 0.5) * 0.012;
    globalDrift.vx *= 0.97;
    globalDrift.vy *= 0.97;
    globalDrift.x  += globalDrift.vx;
    globalDrift.y  += globalDrift.vy;

    globalDrift.x = Math.max(-30, Math.min(30, globalDrift.x));
    globalDrift.y = Math.max(-30, Math.min(30, globalDrift.y));

    const mouseOffsetX = (mouse.x - w / 2) * 0.04;
    const mouseOffsetY = (mouse.y - h / 2) * 0.04;

    for (const p of particles) {
      const angle = flowAngle(p.x, p.y, t);
      p.vx += Math.cos(angle) * p.flowWeight;
      p.vy += Math.sin(angle) * p.flowWeight;

      p.vx *= p.damping;
      p.vy *= p.damping;

      p.x += p.vx;
      p.y += p.vy;

      const pad = p.r * 2;
      if (p.x < -pad)  p.x = w + pad;
      if (p.x > w + pad) p.x = -pad;
      if (p.y < -pad)  p.y = h + pad;
      if (p.y > h + pad) p.y = -pad;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = 280;
      const prox = Math.max(0, 1 - dist / maxD);
      p.glowBoost += (prox * 0.5 - p.glowBoost) * 0.08;

      const drawX = p.x - (mouseOffsetX * p.parallaxDepth) + globalDrift.x * 0.4;
      const drawY = p.y - (mouseOffsetY * p.parallaxDepth) + globalDrift.y * 0.4;
      const finalIntensity = p.intensity + p.glowBoost * p.intensity * 1.5;

      drawOrb(p, drawX, drawY, finalIntensity);
    }

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();
});
