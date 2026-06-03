// Safely wait for the DOM to fully build before injecting anything
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
  // DYNAMIC ALIVE ORB BACKGROUND 
  // ==========================================
  const orbContainer = document.getElementById("orb-container");
  
  if (!orbContainer) {
    console.error("Orb container not found! HTML structure might be broken.");
    return; // Fast fail if DOM is missing
  }

  const colors = [
    "rgba(124, 58, 237, 0.7)",   // vivid purple
    "rgba(37, 99, 235, 0.7)",    // bright blue
    "rgba(6, 182, 212, 0.6)",    // vivid cyan
    "rgba(168, 85, 247, 0.6)"    // violet
  ];

  const orbs = [];
  const ORB_COUNT = 7; // Number of floating blobs

  function createOrb(index) {
    const orb = document.createElement("div");
    orb.className = "orb";

    // Random size between 250px and 550px for deep contrast
    const size = Math.random() * 300 + 250;
    orb.style.width = size + "px";
    orb.style.height = size + "px";

    // Cycle through colors
    orb.style.background = colors[index % colors.length];

    // Random starting position (in percentages)
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    orb.style.left = startX + "%";
    orb.style.top = startY + "%";

    // Save state to dataset to prevent CSS string-parsing glitches
    orb.dataset.x = startX;
    orb.dataset.y = startY;
    
    // Assign soft floating velocity
    orb.dataset.vx = (Math.random() - 0.5) * 0.18; 
    orb.dataset.vy = (Math.random() - 0.5) * 0.18;

    orbContainer.appendChild(orb);
    orbs.push(orb);
  }

  // Generate the blobs
  for (let j = 0; j < ORB_COUNT; j++) {
    createOrb(j);
  }

  // Frame-by-frame physics loop
  function animateOrbs() {
    orbs.forEach((orb) => {
      let x = parseFloat(orb.dataset.x);
      let y = parseFloat(orb.dataset.y);

      let vx = parseFloat(orb.dataset.vx);
      let vy = parseFloat(orb.dataset.vy);

      // Move by velocity
      x += vx;
      y += vy;

      // Soft bounce off the invisible bounds (-20% to 120% so they can drift slightly off-screen)
      if (x < -20 || x > 120) orb.dataset.vx = vx * -1;
      if (y < -20 || y > 120) orb.dataset.vy = vy * -1;

      // Update stored coordinates
      orb.dataset.x = x;
      orb.dataset.y = y;

      // Apply to DOM
      orb.style.left = x + "%";
      orb.style.top = y + "%";
    });

    requestAnimationFrame(animateOrbs);
  }

  // Ignite the background engine
  animateOrbs();

});
