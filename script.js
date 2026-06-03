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

// --- HIGH-END LIQUID CURSOR & ALIVE BACKGROUND LOGIC ---
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");
const orbs = document.querySelectorAll(".orb");

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Target and current variables for mouse parallax coordinates
let orbTargetX = 0;
let orbTargetY = 0;
let orbCurrentX = 0;
let orbCurrentY = 0;

// High-performance time tracker for float calculations
let animTime = 0;

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  // Calculate relative target for background orbs (mouse influence scale)
  orbTargetX = (e.clientX / window.innerWidth - 0.5) * 45;
  orbTargetY = (e.clientY / window.innerHeight - 0.5) * 45;
});

// Master Physics Loop (Runs seamlessly at max monitor refresh rate)
const speedOutline = 0.15;
const speedDot = 0.8;

function renderLoop() {
  // 1. Cursor Lerp (Linear Interpolation) logic
  dotPos.x += (mouse.x - dotPos.x) * speedDot;
  dotPos.y += (mouse.y - dotPos.y) * speedDot;
  
  outlinePos.x += (mouse.x - outlinePos.x) * speedOutline;
  outlinePos.y += (mouse.y - outlinePos.y) * speedOutline;

  cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
  cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;

  // 2. Continuous Organic Orb Float + Mouse Parallax calculations
  animTime += 0.004; // Controls the general speed of the floating waves
  
  orbCurrentX += (orbTargetX - orbCurrentX) * 0.05; // Smooth mouse transition
  orbCurrentY += (orbTargetY - orbCurrentY) * 0.05;

  orbs.forEach((orb, i) => {
    // Unique offset math formulas per orb so they don't move in synchronization
    const waveX = Math.sin(animTime + i * 2.5) * 50;
    const waveY = Math.cos(animTime * 0.8 + i * 3.1) * 40;
    const pulseScale = 1 + Math.sin(animTime * 0.5 + i) * 0.04;

    // Calculate depth multiplier based on orb index
    const multiplier = (i + 1) * 0.6;
    const finalX = (orbCurrentX * multiplier) + waveX;
    const finalY = (orbCurrentY * multiplier) + waveY;

    // Directly update via hardware-accelerated translate3d
    orb.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scale(${pulseScale})`;
  });

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

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
