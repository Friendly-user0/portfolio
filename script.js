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

// NEW: Store target coordinates for the background orbs 
let orbTargetX = 0;
let orbTargetY = 0;
let orbCurrentX = 0;
let orbCurrentY = 0;

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  // Calculate relative target for background orbs
  orbTargetX = (e.clientX / window.innerWidth - 0.5) * 30;
  orbTargetY = (e.clientY / window.innerHeight - 0.5) * 30;
});

// Master Physics Loop (RequestAnimationFrame)
const speedOutline = 0.15;
const speedDot = 0.8;
const orbs = document.querySelectorAll(".orb");

function renderLoop() {
  // 1. Cursor Lerp logic
  dotPos.x += (mouse.x - dotPos.x) * speedDot;
  dotPos.y += (mouse.y - dotPos.y) * speedDot;
  
  outlinePos.x += (mouse.x - outlinePos.x) * speedOutline;
  outlinePos.y += (mouse.y - outlinePos.y) * speedOutline;

  cursorDot.style.transform = `translate3d(calc(${dotPos.x}px - 50%), calc(${dotPos.y}px - 50%), 0)`;
  cursorOutline.style.transform = `translate3d(calc(${outlinePos.x}px - 50%), calc(${outlinePos.y}px - 50%), 0)`;

  // 2. Background Orbs Parallax Lerp Logic (Safe integration with CSS keyframes)
  orbCurrentX += (orbTargetX - orbCurrentX) * 0.08;
  orbCurrentY += (orbTargetY - orbCurrentY) * 0.08;

  orbs.forEach((orb, i) => {
    // Set custom properties instead of overriding the transform property entirely
    orb.style.setProperty('--mx', `${orbCurrentX * (i + 1) * 0.5}px`);
    orb.style.setProperty('--my', `${orbCurrentY * (i + 1) * 0.5}px`);
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
