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


// --- HIGH TECH ELASTIC SPRING CURSOR LOGIC ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = window.innerWidth / 2;
let outlineY = window.innerHeight / 2;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Instant inner dot tracking
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

// Physics loop for smooth elastic lag interpolation (lerp)
function updateCursorPhysics() {
  // Elastic ease tracking calculation
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;

  cursorOutline.style.left = `${outlineX}px`;
  cursorOutline.style.top = `${outlineY}px`;

  requestAnimationFrame(updateCursorPhysics);
}
requestAnimationFrame(updateCursorPhysics);

// Ultra dynamic interactions on hovering elements
const clickables = document.querySelectorAll("a, summary, .stat-card, details");
clickables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.classList.add("cursor-hover-active");
    cursorDot.style.background = "#38bdf8"; 
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.classList.remove("cursor-hover-active");
    cursorDot.style.background = "#00b4d8";
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

let lineIndex = 0;
function cycleDefaultTerminal() {
  if (!isHovering && termText) {
    termText.innerText = `user@cyber-nish:~$ ${defaultLines[lineIndex % defaultLines.length]}`;
    lineIndex++;
  }
}

defaultTermInterval = setInterval(cycleDefaultTerminal, 3000);

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
// LIVE SKY-BLUE PARTICLE SYSTEM BACKGROUND
// ==============================
const canvas = document.getElementById("matrix-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const MOUSE = { x: w / 2, y: h / 2 };

  window.addEventListener("mousemove", (e) => {
    MOUSE.x = e.clientX;
    MOUSE.y = e.clientY;
  });

  for (let i = 0; i < 75; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      let dx = MOUSE.x - p.x;
      let dy = MOUSE.y - p.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        p.x -= dx * 0.008;
        p.y -= dy * 0.008;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // SKY BLUE Particle Fill
      ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx2 = p.x - p2.x;
        let dy2 = p.y - p2.y;
        let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < 110) {
          // Dynamic interconnected cyber network lines
          ctx.strokeStyle = "rgba(0, 180, 216, 0.07)";
          ctx.lineWidth = 0.8;
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
}

// Global safety initializer for icons
if (window.lucide) {
  window.lucide.createIcons();
}
