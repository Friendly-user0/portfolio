// scroll reveal
const items = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("active");
  });
});

items.forEach(el => observer.observe(el));


// terminal feed
const lines = [
  "indexing GitHub repositories...",
  "mapping AI research modules...",
  "loading vulnerability database...",
  "syncing HTB profile...",
  "system ready."
];

let i = 0;
setInterval(() => {
  document.getElementById("terminal").innerText = lines[i % lines.length];
  i++;
}, 2000);


// accordion interaction
document.querySelectorAll(".acc-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const body = btn.nextElementSibling;
    const open = body.style.maxHeight;

    document.querySelectorAll(".acc-body").forEach(b => b.style.maxHeight = null);

    if (!open) {
      body.style.maxHeight = body.scrollHeight + "px";
    }
  });
});


// cursor glow
const cursor = document.createElement("div");
cursor.className = "cursor";
document.body.appendChild(cursor);

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});


// simple animated background (particle network)
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.fillStyle = "#7aa2ff";
    ctx.fillRect(p.x, p.y, 2, 2);
  });

  requestAnimationFrame(animate);
}

animate();


// dynamic projects loader (GitHub links only, no API spam)
const projects = [
  {
    name: "Python Security Toolkit",
    url: "https://github.com/Friendly-user0/Python",
    desc: "Recon scripts, automation, security utilities"
  },
  {
    name: "Advanced Tools",
    url: "https://github.com/Friendly-user0/Tools",
    desc: "Exploitation utilities & frameworks"
  },
  {
    name: "AI Hacking Research",
    url: "https://github.com/Friendly-user0/Web-Hacking/blob/main/AI_Hacking.md",
    desc: "LLM attack vectors & research notes"
  }
];

const container = document.getElementById("projects");

projects.forEach(p => {
  const div = document.createElement("a");
  div.className = "card link";
  div.href = p.url;
  div.innerHTML = `<b>${p.name}</b><br><small>${p.desc}</small>`;
  container.appendChild(div);
});
