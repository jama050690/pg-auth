const darkEl = document.getElementById("dark");
const modeIcon = document.getElementById("modeIcon");
// Dark mode menu
const MODE = "mode";
let isDark = false;

darkEl.addEventListener("click", (e) => {
  e.preventDefault();
  isDark = !isDark;
  localStorage.setItem(MODE, isDark);
  changeMode();
});

document.addEventListener("DOMContentLoaded", () => {
  const currentMode = localStorage.getItem(MODE);
  if (currentMode !== null) {
    isDark = currentMode === "true";
  }
  changeMode();
});

const changeMode = () => {
  if (isDark) {
    document.body.classList.add("dark_mode");
    document.body.classList.remove("light_mode");
    modeIcon.src = "./public/Sun_mode.svg";
  } else {
    document.body.classList.add("light_mode");
    document.body.classList.remove("dark_mode");
    modeIcon.src = "./public/Dark_mode.svg";
  }
};

// login section
document.querySelector(".login").addEventListener("click", () => {
  window.location.href = "./auth/login.html";
});
