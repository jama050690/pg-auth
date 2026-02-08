import "./styles.css";

// ===== TRANSLATIONS =====
const translations = {
  uz: {
    "nav.about": "Men haqimda",
    "nav.contact": "Aloqa",
    "nav.projects": "Loyihalarim",
    "hero.badge": "Ishga tayyor",
    "hero.greeting": "Salom, men",
    "hero.desc": "Full-stack web developer. Zamonaviy va chiroyli web ilovalar yarataman.",
    "hero.contact": "Bog'lanish",
    "hero.projects": "Loyihalarim",
    "footer.contact": "Bog'lanish",
    "footer.rights": "Barcha huquqlar himoyalangan.",
    "back": "Orqaga",
    "login": "Login",
  },
  ru: {
    "nav.about": "Обо мне",
    "nav.contact": "Контакты",
    "nav.projects": "Мои проекты",
    "hero.badge": "Открыт для работы",
    "hero.greeting": "Привет, я",
    "hero.desc": "Full-stack веб-разработчик. Создаю современные и красивые веб-приложения.",
    "hero.contact": "Связаться",
    "hero.projects": "Мои проекты",
    "footer.contact": "Контакты",
    "footer.rights": "Все права защищены.",
    "back": "Назад",
    "login": "Войти",
  },
  en: {
    "nav.about": "About me",
    "nav.contact": "Contact",
    "nav.projects": "My projects",
    "hero.badge": "Available for work",
    "hero.greeting": "Hello, I'm",
    "hero.desc": "Full-stack web developer. I build modern and beautiful web applications.",
    "hero.contact": "Contact me",
    "hero.projects": "My projects",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "back": "Back",
    "login": "Login",
  },
};

const langLabels = { uz: "UZ", ru: "RU", en: "EN" };

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  const label = document.getElementById("langLabel");
  if (label) label.textContent = langLabels[lang];
}

// ===== LANGUAGE DROPDOWN =====
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

langBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  langMenu?.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  langMenu?.classList.add("hidden");
});

document.querySelectorAll(".lang-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    localStorage.setItem("lang", lang);
    applyTranslations(lang);
    langMenu?.classList.add("hidden");
  });
});

// Apply saved language
const savedLang = localStorage.getItem("lang") || "uz";
applyTranslations(savedLang);

// ===== DARK/LIGHT MODE =====
const darkBtn = document.getElementById("dark");
const modeIcon = document.getElementById("modeIcon");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  modeIcon?.classList.replace("fa-moon", "fa-sun");
}

darkBtn?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");

  if (isLight) {
    modeIcon?.classList.replace("fa-moon", "fa-sun");
  } else {
    modeIcon?.classList.replace("fa-sun", "fa-moon");
  }
});
