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

// --- CUSTOM CURSOR LOGIC ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Slight delay for the outline trailing effect
  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// Expand cursor on clickable items
const clickables = document.querySelectorAll("a, summary, .stat-card");
clickables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.style.width = "50px";
    cursorOutline.style.height = "50px";
    cursorOutline.style.borderColor = "#00b4d8"; // blue accent
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.style.width = "30px";
    cursorOutline.style.height = "30px";
    cursorOutline.style.borderColor = "#9d4edd"; // purple accent
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
  if (!isHovering) {
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
    // Typewriter effect for hover
    const targetText = `user@cyber-nish:~$ ${e.target.getAttribute("data-term")}`;
    termText.innerText = targetText;
  });

  el.addEventListener("mouseleave", () => {
    isHovering = false;
    termText.innerText = `user@cyber-nish:~$ returning to background tasks...`;
  });
});

// ==============================
// LIVE PARTICLE SYSTEM BACKGROUND
// ==============================

const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

const particles = [];

const MOUSE = {
  x: w / 2,
  y: h / 2
};

window.addEventListener("mousemove", (e) => {
  MOUSE.x = e.clientX;
  MOUSE.y = e.clientY;
});

// create particles
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 1
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // mouse influence field
    let dx = MOUSE.x - p.x;
    let dy = MOUSE.y - p.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      p.x -= dx * 0.01;
      p.y -= dy * 0.01;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    // draw particle
    ctx.fillStyle = "rgba(122, 162, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // draw connections
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

  requestAnimationFrame(draw);
}

draw();
