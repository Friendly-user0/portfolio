// scroll reveal
const items = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("active");
  });
});

items.forEach(el => observer.observe(el));


// terminal micro-feel
const lines = [
  "loading research profile...",
  "indexing vulnerability reports...",
  "connecting GitHub...",
  "mapping AI research modules...",
  "profile ready."
];

let i = 0;
setInterval(() => {
  document.getElementById("terminal").innerText = lines[i % lines.length];
  i++;
}, 2000);
