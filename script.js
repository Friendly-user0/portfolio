// --- SCROLL REVEAL ANIMATION ---
const items = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("active");
    }
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

// Using RequestAnimationFrame and Lerp for absolute buttery smoothness
const speedOutline = 0.15;
const speedDot = 0.8;

function renderCursor() {
  // Lerp logic
  dotPos.x += (mouse.x - dotPos.x) * speedDot;
  dotPos.y += (mouse.y - dotPos.y) * speedDot;
  
  outlinePos.x += (mouse.x - outlinePos.x) * speedOutline;
  outlinePos.y += (mouse.y - outlinePos.y) * speedOutline;

  // Apply transforms via hardware acceleration
  cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
  cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;

  requestAnimationFrame(renderCursor);
}
requestAnimationFrame(renderCursor);

// Hover states for the cursor
const clickables = document.querySelectorAll("a, summary, .stat-card, .repo-card");
clickables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.classList.add("cursor-hover");
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.classList.remove("cursor-hover");
  });
});

// --- TERMINAL MICRO-INTERACTIONS ---
const termText = document.getElementById("term-text");
let defaultTermInterval;
let isHovering = false;

const defaultLines = [
  "monitoring network traffic...",
  "analyzing malware for ethical hacking...",
  "bypassing rate limits...",
  "compiling threat reports...",
  "waiting for input..."
];

let i = 0;
function cycleDefaultTerminal() {
  if (!isHovering && termText) {
    termText.innerText = `user@cyber-nish:~$ ${defaultLines[i % defaultLines.length]}`;
    i++;
  }
}

// Start default cycle
defaultTermInterval = setInterval(cycleDefaultTerminal, 3000);

// Override terminal text when hovering over sections with data-term
const termTriggers = document.querySelectorAll("[data-term]");

termTriggers.forEach((el) => {
  el.addEventListener("mouseenter", (e) => {
    isHovering = true;
    termText.innerText = `user@cyber-nish:~$ ${e.target.getAttribute("data-term")}`;
  });

  el.addEventListener("mouseleave", () => {
    isHovering = false;
    termText.innerText = `user@cyber-nish:~$ returning to background tasks...`;
  });
});

// ==============================
// NEURAL FLOW FIELD BACKGROUND
// ==============================

const canvas = document.getElementById("matrix-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const flow = [];

  const MOUSE = { x: w / 2, y: h / 2 };

  window.addEventListener("mousemove", (e) => {
    MOUSE.x = e.clientX;
    MOUSE.y = e.clientY;
  });

  // create flow field grid
  const cols = 40;
  const rows = 25;

  function noise(x, y) {
    return Math.sin(x * 0.01) + Math.cos(y * 0.01);
  }

  for (let i = 0; i < cols * rows; i++) {
    flow.push({
      angle: Math.random() * Math.PI * 2
    });
  }

  // particles
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      life: Math.random() * 100
    });
  }

  function draw() {
    // soft fade instead of full clear → creates “memory trail”
    ctx.fillStyle = "rgba(5, 6, 10, 0.15)";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      // FLOW FIELD INDEX
      let gx = Math.floor((p.x / w) * cols);
      let gy = Math.floor((p.y / h) * rows);
      let index = gx + gy * cols;

      let angle = flow[index]?.angle || 0;

      // subtle mouse distortion
      let dx = MOUSE.x - p.x;
      let dy = MOUSE.y - p.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      let force = dist < 180 ? (1 - dist / 180) : 0;

      // movement
      p.vx += Math.cos(angle) * 0.2 + (-dx * 0.0005 * force);
      p.vy += Math.sin(angle) * 0.2 + (-dy * 0.0005 * force);

      p.vx *= 0.92;
      p.vy *= 0.92;

      p.x += p.vx;
      p.y += p.vy;

      // wrap edges
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // draw particle glow
      ctx.fillStyle = "rgba(122, 162, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // occasional connection lines (lighter + rarer = cleaner look)
      if (i % 6 === 0) {
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx2 = p.x - p2.x;
          let dy2 = p.y - p2.y;
          let d = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (d < 90) {
            ctx.strokeStyle = `rgba(157, 78, 221, ${1 - d / 90})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
