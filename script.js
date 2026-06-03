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
  // MOUSE STATE (shared across systems)
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

  // Inertia speeds: dot snaps fast, outline lags behind
  const SPEED_DOT     = 0.85;
  const SPEED_OUTLINE = 0.13;

  // Magnetic pull radius & strength
  const MAGNET_RADIUS   = 90;
  const MAGNET_STRENGTH = 0.32;

  // Find all magnetic targets
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
    // --- DOT: fast snap ---
    dotPos.x += (mouse.x - dotPos.x) * SPEED_DOT;
    dotPos.y += (mouse.y - dotPos.y) * SPEED_DOT;

    // --- OUTLINE: lagging inertia + optional magnetic pull ---
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
      cursorDot.style.transform =
        `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
    }

    if (cursorOutline) {
      cursorOutline.style.transform =
        `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover state for outline
  magnetTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursorOutline) cursorOutline.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      if (cursorOutline) cursorOutline.classList.remove("cursor-hover");
    });
  });

  // Click ripple burst
  document.addEventListener("click", (e) => {
    if (!cursorRipple) return;
    cursorRipple.style.left = `${e.clientX}px`;
    cursorRipple.style.top  = `${e.clientY}px`;
    cursorRipple.classList.remove("burst");
    // Force reflow so animation re-triggers
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
  // ADAPTIVE GLOW — Canvas orbs near mouse glow brighter
  // ==========================================
  // (handled inside canvas loop via proximity calc)


  // ==========================================
  // CANVAS BACKGROUND — Full upgrade
  // Flow field + Hybrid particles + Global drift
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

  // ---- COLOR PALETTE ----
  const COLORS = [
    "124, 58, 237",   // vivid purple
    "6,  182, 212",   // cyan
    "37,  99, 235",   // deep blue
    "168,  85, 247",  // bright violet
    "99,  102, 241",  // indigo
    "20,  184, 166",  // teal accent
  ];

  // ---- GLOBAL DRIFT ----
  // Slow shared drift applied to all particles for cohesion
  const globalDrift = { x: 0, y: 0, vx: 0, vy: 0 };

  // ---- FLOW FIELD FUNCTION ----
  // Returns an angle based on spatial position + time
  // Creates smooth organic "current" in 2D space
  function flowAngle(x, y, t) {
    const s = Math.sin(x * 0.0025 + t * 0.00045) +
              Math.cos(y * 0.0020 - t * 0.00038);
    const c = Math.cos(x * 0.0018 - t * 0.00042) +
              Math.sin(y * 0.0030 + t * 0.00030);
    return Math.atan2(s, c);
  }

  // ---- PARTICLE FACTORY ----
  function createParticle(xOverride, yOverride) {
    const typeRoll = Math.random();
    let radius, intensity, speed;

    if (typeRoll < 0.55) {
      // Crisp smaller orbs — give structure and clarity
      radius    = Math.random() * 75 + 25;
      intensity = 0.30 + Math.random() * 0.15;
      speed     = Math.random() * 0.55 + 0.15;
    } else if (typeRoll < 0.85) {
      // Mid-size drifters — depth and volume
      radius    = Math.random() * 130 + 80;
      intensity = 0.16 + Math.random() * 0.10;
      speed     = Math.random() * 0.35 + 0.08;
    } else {
      // Large atmospheric clouds — background ambience
      radius    = Math.random() * 200 + 140;
      intensity = 0.07 + Math.random() * 0.07;
      speed     = Math.random() * 0.20 + 0.04;
    }

    const angle = Math.random() * Math.PI * 2;

    return {
      x:             xOverride !== undefined ? xOverride : Math.random() * w,
      y:             yOverride !== undefined ? yOverride : Math.random() * h,
      r:             radius,
      vx:            Math.cos(angle) * speed,
      vy:            Math.sin(angle) * speed,
      color:         COLORS[Math.floor(Math.random() * COLORS.length)],
      intensity:     intensity,
      // Parallax depth: larger = more movement offset per mouse unit
      parallaxDepth: radius / 160,
      // Flow field influence: how strongly this particle follows the field
      flowWeight:    0.015 + Math.random() * 0.025,
      // Damping: prevents runaway velocity
      damping:       0.978 + Math.random() * 0.014,
      // Adaptive glow: proximity to mouse boosts this orb
      glowBoost:     0,
    };
  }

  // ---- GENERATE PARTICLE POOL ----
  const PARTICLE_COUNT = 55;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  // ---- DRAW GRADIENT ORB ----
  function drawOrb(p, drawX, drawY, intensityOverride) {
    const eff = intensityOverride !== undefined ? intensityOverride : p.intensity;
    const grad = ctx.createRadialGradient(
      drawX, drawY, 0,
      drawX, drawY, p.r
    );
    grad.addColorStop(0,    `rgba(${p.color}, ${Math.min(1, eff)})`);
    grad.addColorStop(0.35, `rgba(${p.color}, ${Math.min(1, eff * 0.55)})`);
    grad.addColorStop(1,    `rgba(${p.color}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- MAIN ANIMATION LOOP ----
  function animateCanvas() {
    ctx.clearRect(0, 0, w, h);

    // Screen blending: overlapping colors become bright light (cinematic)
    ctx.globalCompositeOperation = "screen";

    const t = performance.now();

    // ---- UPDATE GLOBAL DRIFT ----
    // Random walk — creates slow cohesive pulse through the whole field
    globalDrift.vx += (Math.random() - 0.5) * 0.018;
    globalDrift.vy += (Math.random() - 0.5) * 0.018;
    globalDrift.vx *= 0.97;
    globalDrift.vy *= 0.97;
    globalDrift.x  += globalDrift.vx;
    globalDrift.y  += globalDrift.vy;

    // Soft clamp so drift doesn't drift to infinity
    globalDrift.x = Math.max(-35, Math.min(35, globalDrift.x));
    globalDrift.y = Math.max(-35, Math.min(35, globalDrift.y));

    // ---- MOUSE PARALLAX ----
    const mouseOffsetX = (mouse.x - w / 2) * 0.045;
    const mouseOffsetY = (mouse.y - h / 2) * 0.045;

    for (const p of particles) {

      // ---- FLOW FIELD FORCE ----
      const angle   = flowAngle(p.x, p.y, t);
      p.vx         += Math.cos(angle) * p.flowWeight;
      p.vy         += Math.sin(angle) * p.flowWeight;

      // ---- DAMPING (prevents chaos) ----
      p.vx *= p.damping;
      p.vy *= p.damping;

      // ---- POSITION UPDATE ----
      p.x += p.vx;
      p.y += p.vy;

      // ---- SEAMLESS WRAPPING ----
      const pad = p.r * 2;
      if (p.x < -pad)  p.x = w + pad;
      if (p.x > w + pad) p.x = -pad;
      if (p.y < -pad)  p.y = h + pad;
      if (p.y > h + pad) p.y = -pad;

      // ---- ADAPTIVE GLOW — proximity to mouse ----
      const dx    = mouse.x - p.x;
      const dy    = mouse.y - p.y;
      const dist  = Math.sqrt(dx * dx + dy * dy);
      const maxD  = 300;
      const prox  = Math.max(0, 1 - dist / maxD);
      // Smoothly lerp glow boost toward target
      p.glowBoost += (prox * 0.6 - p.glowBoost) * 0.08;

      // ---- DRAW POSITION (with parallax + global drift) ----
      const drawX = p.x - (mouseOffsetX * p.parallaxDepth) + globalDrift.x * 0.4;
      const drawY = p.y - (mouseOffsetY * p.parallaxDepth) + globalDrift.y * 0.4;

      // ---- FINAL INTENSITY (base + glow boost) ----
      const finalIntensity = p.intensity + p.glowBoost * p.intensity * 1.4;

      drawOrb(p, drawX, drawY, finalIntensity);
    }

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

});
