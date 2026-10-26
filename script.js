const root = document.documentElement;

// Theme toggle: follows the system until the visitor chooses.
const themeBtn = document.getElementById("themeBtn");
const isDark = () => (root.getAttribute("data-theme") ||
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
function syncTheme() {
  themeBtn.setAttribute("aria-pressed", String(isDark()));
  themeBtn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
}
themeBtn.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  syncTheme();
});
syncTheme();

// Tiles and citations open their detail dialog.
document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-dialog]");
  if (opener) {
    e.preventDefault();
    const d = document.getElementById(opener.dataset.dialog);
    if (d && typeof d.showModal === "function") d.showModal();
    return;
  }
  if (e.target.closest("[data-close]")) { e.target.closest("dialog").close(); return; }
  // Click on the backdrop closes the dialog.
  if (e.target.tagName === "DIALOG") e.target.close();
});

// Highlight the current section in the pill nav.
const links = [...document.querySelectorAll(".pill nav a")];
const targets = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
targets.forEach((t) => spy.observe(t));

document.getElementById("year").textContent = new Date().getFullYear();
