// ==========================================
// THE ORIGINAL WORKING CANVAS SYSTEM
// ==========================================
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  w = (canvas.width = window.innerWidth);
  h = (canvas.height = window.innerHeight);
});

const particles = [];
const mouse = { x: w / 2, y: h / 2 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Initialize original 80 particles
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 1,
  });
}

function drawBackground() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Original mouse field interaction logic
    let dx = mouse.x - p.x;
    let dy = mouse.y - p.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      p.x -= dx * 0.01;
      p.y -= dy * 0.01;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    // Draw particle
    ctx.fillStyle = "rgba(122, 162, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw lines between proximate nodes
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let dx2 = p.x - p2.x;
      let dy2 = p.y - p2.y;
      let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      if (dist2 < 120) {
        ctx.strokeStyle = "rgba(157, 78, 221, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawBackground);
}
// Run background immediately
drawBackground();


// ==========================================
// INTERACTIVE UI & INTERFACE MANAGEMENT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

  // Scroll Reveal Observer
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));

  // Custom Inertia Cursor Modules
  const cursorDot     = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");
  const cursorRipple  = document.getElementById("cursor-ripple");

  let dotPos     = { x: mouse.x, y: mouse.y };
  let outlinePos = { x: mouse.x, y: mouse.y };

  function renderCursor() {
    dotPos.x += (mouse.x - dotPos.x) * 0.85;
    dotPos.y += (mouse.y - dotPos.y) * 0.85;
    outlinePos.x += (mouse.x - outlinePos.x) * 0.15;
    outlinePos.y += (mouse.y - outlinePos.y) * 0.15;

    if (cursorDot) cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
    if (cursorOutline) cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  document.querySelectorAll("a, summary, .stat-card, .repo-card, .glass-btn, .social-link, .pfp").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorOutline?.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursorOutline?.classList.remove("cursor-hover"));
  });

  document.addEventListener("click", (e) => {
    if (!cursorRipple) return;
    cursorRipple.style.left = `${e.clientX}px`;
    cursorRipple.style.top  = `${e.clientY}px`;
    cursorRipple.classList.remove("burst");
    void cursorRipple.offsetWidth;
    cursorRipple.classList.add("burst");
  });

  // Floating Terminal Handler
  const termText = document.getElementById("terminal");
  let isHovering = false;
  const defaultLines = [
    "monitoring network traffic...",
    "scanning for open ports...",
    "analyzing malware signatures...",
    "bypassing rate limits...",
    "compiling threat reports..."
  ];

  let lineIdx = 0;
  setInterval(() => {
    if (!isHovering && termText) {
      termText.innerText = `user@cyber-nish:~$ ${defaultLines[lineIdx % defaultLines.length]}`;
      lineIdx++;
    }
  }, 3200);

  document.querySelectorAll("[data-term]").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      isHovering = true;
      if (termText) termText.innerText = `user@cyber-nish:~$ ${e.target.getAttribute("data-term")}`;
    });
    el.addEventListener("mouseleave", () => {
      isHovering = false;
      if (termText) termText.innerText = "user@cyber-nish:~$ returning to background tasks...";
    });
  });

  // Profile Image Magnetic Matrix
  const pfpWrap = document.getElementById("pfp-magnetic");
  const pfpImg  = pfpWrap?.querySelector(".pfp");

  if (pfpWrap && pfpImg) {
    document.addEventListener("mousemove", (e) => {
      const rect = pfpWrap.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      
      if (Math.hypot(dx, dy) < 3) {
        pfpImg.style.transform = `perspective(500px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale(1.04)`;
      } else {
        pfpImg.style.transform = "";
      }
    });
  }

  // Weekly Directive Generator Engine
  const quotes = [
    "Security is a process, not a product. Build defenses that adapt to the adversary.",
    "Amateurs hack systems, professionals hack people. Defend the human element.",
    "The only truly secure system is one that is powered off, cast in a block of concrete, and sealed in a lead-lined room.",
    "Complexity is the worst enemy of security. Keep your logic sound, keep your code clean.",
    "If you think technology can solve your security problems, then you don't understand the problems.",
    "Defense in depth is the only way. Layer your logic, anticipate the breach.",
    "A vulnerability is just a feature waiting for a creative mind. Find it before they do."
  ];

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek);
  
  const quoteEl = document.getElementById("weekly-quote");
  if (quoteEl) {
    quoteEl.innerText = quotes[weekNumber % quotes.length];
  }
});
