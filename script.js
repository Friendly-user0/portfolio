// --- SCROLL REVEAL VIEWPORT AGENTS ---
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

// Lerping constants for smooth interpolation
const speedOutline = 0.15;
const speedDot = 0.8;

function renderCursor() {
  dotPos.x += (mouse.x - dotPos.x) * speedDot;
  dotPos.y += (mouse.y - dotPos.y) * speedDot;
  
  outlinePos.x += (mouse.x - outlinePos.x) * speedOutline;
  outlinePos.y += (mouse.y - outlinePos.y) * speedOutline;

  if(cursorDot && cursorOutline) {
    cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
    cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;
  }

  requestAnimationFrame(renderCursor);
}
requestAnimationFrame(renderCursor);

// Hover animations for standard elements
const clickables = document.querySelectorAll("a, summary, .stat-card, .repo-card, .interactive-dropdown");
clickables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.classList.add("cursor-hover");
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.classList.remove("cursor-hover");
  });
});

// --- PROFILE PICTURE MAGNETIC DRIFT ---
const magneticPfp = document.getElementById("magnetic-pfp");
if (magneticPfp) {
  magneticPfp.addEventListener("mousemove", (e) => {
    const rect = magneticPfp.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    magneticPfp.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
  });

  magneticPfp.addEventListener("mouseleave", () => {
    magneticPfp.style.transform = `translate3d(0px, 0px, 0px)`;
  });
}

// --- AUTOMATED WEEKLY MOTIVATIONAL ENGINE ---
const motivationalQuotes = [
  "\"The matrix is built on predictable patterns. True security lies in becoming the anomaly that cannot be indexed.\"",
  "\"Quiet professionalism in the darkness guarantees that the collective ecosystem functions seamlessly in daylight.\"",
  "\"To analyze a threat is to build a fortress. Never minimize the compound interest of tiny defensive optimizations.\"",
  "\"Great structures are broken down code by code, block by block. Maintain your persistence, and bypass the limitations.\"",
  "\"Every single exploit discovered is simply a mathematical reminder that human structures are inherently imperfect. Stay sharp.\""
];

function initializeWeeklyQuote() {
  const quoteElement = document.getElementById("dynamic-quote");
  if (quoteElement) {
    // Calculates a stable index based on current year and calendar week number
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const totalDays = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const currentWeekNumber = Math.ceil((totalDays + startOfYear.getDay() + 1) / 7);
    
    const operationalIndex = currentWeekNumber % motivationalQuotes.length;
    quoteElement.innerText = motivationalQuotes[operationalIndex];
  }
}
document.addEventListener("DOMContentLoaded", initializeWeeklyQuote);

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

// --- LIVE FLUID PARTICLE BACKGROUND ENGINE ---
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

      ctx.fillStyle = "rgba(122, 162, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

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
}
