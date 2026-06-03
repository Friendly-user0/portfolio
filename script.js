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
    if (termText) {
      termText.innerText = `user@cyber-nish:~$ ${defaultLines[i % defaultLines.length]}`;
      i++;
    }
  }
}

// Start default cycle
defaultTermInterval = setInterval(cycleDefaultTerminal, 3000);

// Override terminal text when hovering over sections with data-term
const termTriggers = document.querySelectorAll("[data-term]");

termTriggers.forEach((el) => {
  el.addEventListener("mouseenter", (e) => {
    isHovering = true;
    const targetText = `user@cyber-nish:~$ ${e.target.getAttribute("data-term")}`;
    termText.innerText = targetText;
  });

  el.addEventListener("mouseleave", () => {
    isHovering = false;
    termText.innerText = `user@cyber-nish:~$ returning to background tasks...`;
  });
});

// Re-run lucide injection on DOM content load to guarantee safe render
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
