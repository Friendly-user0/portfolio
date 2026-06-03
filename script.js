// Wrap everything to guarantee the DOM is fully loaded before JS fires
document.addEventListener("DOMContentLoaded", () => {

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

  const clickables = document.querySelectorAll("a, summary, .stat-card, .repo-card");
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

  let i = 0;
  function cycleDefaultTerminal() {
    if (!isHovering && termText) {
      termText.innerText = `user@cyber-nish:~$ ${defaultLines[i % defaultLines.length]}`;
      i++;
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
  // DYNAMIC ALIVE ORB BACKGROUND 
  // ==========================================
  const orbContainer = document.getElementById("orb-container");
  
  // SAFETY CHECK: If container isn't found, abort orb logic to prevent crash
  if (!orbContainer) {
    console.error("Orb container not found in DOM!");
    return;
  }

  const colors = [
    "rgba(124, 58, 237, 0.6)",   // purple
    "rgba(37, 99, 235, 0.6)",    // blue
    "rgba(6, 182, 212, 0.5)",    // cyan
    "rgba(168, 85, 247, 0.5)"    // violet
  ];

  const orbs = [];

  function createOrb(index) {
    const orb = document.createElement("div");
    orb.className = "orb";

    const size = Math.random() * 300 + 200;
    orb.style.width = size + "px";
    orb.style.height = size + "px";

    orb.style.background = colors[index % colors.length];

    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    orb.style.left = startX + "%";
    orb.style.top = startY + "%";

    orb.dataset.x = startX;
    orb.dataset.y = startY;
    
    // Smooth custom velocity
    orb.dataset.vx = (Math.random() - 0.5) * 0.15; 
    orb.dataset.vy = (Math.random() - 0.5) * 0.15;

    orbContainer.appendChild(orb);
    orbs.push(orb);
  }

  // create 6 orbs
  for (let j = 0; j < 6; j++) {
    createOrb(j);
  }

  // animation loop
  function animateOrbs() {
    orbs.forEach((orb) => {
      let x = parseFloat(orb.dataset.x);
      let y = parseFloat(orb.dataset.y);

      let vx = parseFloat(orb.dataset.vx);
      let vy = parseFloat(orb.dataset.vy);

      x += vx;
      y += vy;

      // soft bounce 
      if (x < -10 || x > 110) orb.dataset.vx = vx * -1;
      if (y < -10 || y > 110) orb.dataset.vy = vy * -1;

      orb.dataset.x = x;
      orb.dataset.y = y;

      orb.style.left = x + "%";
      orb.style.top = y + "%";
    });

    requestAnimationFrame(animateOrbs);
  }

  // Start the background float
  animateOrbs();

});
