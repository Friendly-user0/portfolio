document.addEventListener("DOMContentLoaded", () => {

  // --- SCROLL REVEAL ANIMATION ---
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  items.forEach((el) => observer.observe(el));


  // --- HIGH-END LIQUID CURSOR LOGIC ---
  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const speedOutline = 0.15;
  const speedDot = 0.8;

  function renderCursor() {
    if (cursorDot && cursorOutline) {
      dotPos.x += (mouse.x - dotPos.x) * speedDot;
      dotPos.y += (mouse.y - dotPos.y) * speedDot;
      
      outlinePos.x += (mouse.x - outlinePos.x) * speedOutline;
      outlinePos.y += (mouse.y - outlinePos.y) * speedOutline;

      cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
      cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const clickables = document.querySelectorAll("a, summary, .stat-card, .repo-card, .glass-btn");
  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if(cursorOutline) cursorOutline.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      if(cursorOutline) cursorOutline.classList.remove("cursor-hover");
    });
  });


  // --- TERMINAL MICRO-INTERACTIONS ---
  const termText = document.getElementById("term-text");
  let isHovering = false;

  const defaultLines = [
    "monitoring network traffic...",
    "analyzing malware for ethical hacking...",
    "bypassing rate limits...",
    "compiling threat reports...",
    "waiting for input..."
  ];

  let lineIdx = 0;
  function cycleDefaultTerminal() {
    if (!isHovering && termText) {
      termText.innerText = `user@cyber-nish:~$ ${defaultLines[lineIdx % defaultLines.length]}`;
      lineIdx++;
    }
  }
  setInterval(cycleDefaultTerminal, 3000);

  const termTriggers = document.querySelectorAll("[data-term]");
  termTriggers.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      isHovering = true;
      if(termText) termText.innerText = `user@cyber-nish:~$ ${e.target.getAttribute("data-term")}`;
    });
    el.addEventListener("mouseleave", () => {
      isHovering = false;
      if(termText) termText.innerText = `user@cyber-nish:~$ returning to background tasks...`;
    });
  });


  // ==========================================
  // ULTIMATE GPU CANVAS BACKGROUND
  // ==========================================
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const particles = [];
  
  // Premium RGB colors for seamless blending
  const colors = [
    "124, 58, 237", // Vivid Purple
    "6, 182, 212",  // Cyan
    "37, 99, 235",  // Deep Blue
    "168, 85, 247"  // Bright Violet
  ];

  // Generate 45 mixed-size particles (some huge ambient, some smaller drifters)
  for (let i = 0; i < 45; i++) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    let radius = Math.random() * 200 + 80;
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: radius,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: color,
      // Larger particles move more heavily on parallax
      parallaxDepth: radius / 150 
    });
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, w, h);
    
    // Magical 'screen' blending: overlapping colors become pure, bright light
    ctx.globalCompositeOperation = 'screen';

    // Calculate mouse parallax offset relative to center of screen
    let mouseOffsetX = (mouse.x - w / 2) * 0.05;
    let mouseOffsetY = (mouse.y - h / 2) * 0.05;

    for (let p of particles) {
      // Natural drifting physics
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around screen seamlessly (with padding so they don't pop in/out abruptly)
      if (p.x < -p.r * 2) p.x = w + p.r * 2;
      if (p.x > w + p.r * 2) p.x = -p.r * 2;
      if (p.y < -p.r * 2) p.y = h + p.r * 2;
      if (p.y > h + p.r * 2) p.y = -p.r * 2;

      // Apply subtle mouse depth tracking
      let drawX = p.x - (mouseOffsetX * p.parallaxDepth);
      let drawY = p.y - (mouseOffsetY * p.parallaxDepth);

      // Draw the glowing orb
      const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.r);
      grad.addColorStop(0, `rgba(${p.color}, 0.6)`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animateCanvas);
  }

  // Ignite the canvas
  animateCanvas();

});
