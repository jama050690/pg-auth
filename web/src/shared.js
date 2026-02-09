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
    "backHome": "Bosh sahifaga qaytish",
    "login": "Login",
    "login.subtitle": "Hisobingizga kiring",
    "login.password": "Parol",
    "login.remember": "Eslab qolish",
    "login.forgot": "Parolni unutdingizmi?",
    "login.submit": "Kirish",
    "login.or": "yoki",
    "login.noAccount": "Hisobingiz yo'qmi?",
    "login.registerLink": "Ro'yxatdan o'ting",
    "register.subtitle": "Yangi hisob yarating",
    "register.google": "Google bilan ro'yxatdan o'tish",
    "register.github": "GitHub bilan ro'yxatdan o'tish",
    "register.or": "yoki",
    "register.name": "Ism",
    "register.password": "Parol",
    "register.confirm": "Parolni tasdiqlang",
    "register.submit": "Ro'yxatdan o'tish",
    "register.hasAccount": "Hisobingiz bormi?",
    "register.loginLink": "Kirish",
    "nav.dashboard": "Boshqaruv paneli",
    "nav.home": "Bosh sahifa",
    "dash.loading": "Yuklanmoqda...",
    "dash.welcome": "Xush kelibsiz,",
    "dash.subtitle": "Bu sizning shaxsiy boshqaruv panelingiz",
    "dash.online": "Online",
    "dash.profile": "Profil",
    "dash.provider": "Kirish usuli",
    "dash.joined": "Ro'yxatdan o'tgan",
    "dash.actions": "Tezkor amallar",
    "dash.viewProjects": "Loyihalarni ko'rish",
    "dash.viewProjectsDesc": "Barcha loyihalar va namunalar",
    "dash.viewSamples": "Namunalar",
    "dash.viewSamplesDesc": "12 ta amaliy loyiha namunalari",
    "dash.aboutMe": "Men haqimda",
    "dash.aboutMeDesc": "Shaxsiy ma'lumotlar sahifasi",
    "dash.contact": "Aloqa",
    "dash.contactDesc": "Bog'lanish ma'lumotlari",
    "dash.telegramDesc": "Telegram orqali yozing",
    "dash.githubDesc": "Kodlarni ko'ring",
    "dash.logout": "Chiqish",
    "register.rule8": "Kamida 8 ta belgi",
    "register.ruleUpper": "Kamida 1 ta katta harf (A-Z)",
    "register.ruleNumber": "Kamida 1 ta raqam (0-9)",
    "register.ruleSpecial": "Kamida 1 ta maxsus belgi (_=&^%$#@!)",
    // About me page
    "about.title": "Men haqimda",
    "about.desc": "Men full-stack web developer bo'lib, zamonaviy texnologiyalar yordamida web ilovalar yarataman. Node.js, Express, PostgreSQL va Docker bilan ishlashni yaxshi ko'raman. Har doim yangi narsalarni o'rganishga va o'z bilimlarimni oshirishga intilamanman.",
    "about.skills": "Ko'nikmalar",
    "about.contact": "Aloqa",
    "about.phone": "Telefon",
    // Projects page
    "projects.titleMy": "Mening",
    "projects.titleProjects": "loyihalarim",
    "projects.desc": "Men ishlab chiqqan va ustida ishlayotgan loyihalar to'plami",
    "projects.pgAuthDesc": "PostgreSQL asosida autentifikatsiya tizimi. Docker bilan deploy, Express API.",
    "projects.portfolioDesc": "Shaxsiy portfolio sayti. Tailwind CSS, Vite va zamonaviy dizayn bilan.",
    "projects.visitSite": "Saytga o'tish",
    "projects.samplesTitle": "Loyihalardan namunalar",
    "projects.samplesDesc": "12 ta JavaScript loyiha: Palindrome Checker, Cash Register, Qur'an App va boshqalar.",
    "projects.viewAll": "Barchasini ko'rish",
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
    "backHome": "Вернуться на главную",
    "login": "Войти",
    "login.subtitle": "Войдите в аккаунт",
    "login.password": "Пароль",
    "login.remember": "Запомнить",
    "login.forgot": "Забыли пароль?",
    "login.submit": "Войти",
    "login.or": "или",
    "login.noAccount": "Нет аккаунта?",
    "login.registerLink": "Зарегистрироваться",
    "register.subtitle": "Создайте новый аккаунт",
    "register.google": "Войти через Google",
    "register.github": "Войти через GitHub",
    "register.or": "или",
    "register.name": "Имя",
    "register.password": "Пароль",
    "register.confirm": "Подтвердите пароль",
    "register.submit": "Зарегистрироваться",
    "register.hasAccount": "Уже есть аккаунт?",
    "register.loginLink": "Войти",
    "nav.dashboard": "Панель управления",
    "nav.home": "Главная",
    "dash.loading": "Загрузка...",
    "dash.welcome": "Добро пожаловать,",
    "dash.subtitle": "Это ваша личная панель управления",
    "dash.online": "Онлайн",
    "dash.profile": "Профиль",
    "dash.provider": "Способ входа",
    "dash.joined": "Дата регистрации",
    "dash.actions": "Быстрые действия",
    "dash.viewProjects": "Посмотреть проекты",
    "dash.viewProjectsDesc": "Все проекты и примеры",
    "dash.viewSamples": "Примеры",
    "dash.viewSamplesDesc": "12 практических примеров",
    "dash.aboutMe": "Обо мне",
    "dash.aboutMeDesc": "Страница личной информации",
    "dash.contact": "Контакты",
    "dash.contactDesc": "Контактная информация",
    "dash.telegramDesc": "Написать в Telegram",
    "dash.githubDesc": "Посмотреть код",
    "dash.logout": "Выйти",
    "register.rule8": "Минимум 8 символов",
    "register.ruleUpper": "Минимум 1 заглавная буква (A-Z)",
    "register.ruleNumber": "Минимум 1 цифра (0-9)",
    "register.ruleSpecial": "Минимум 1 спецсимвол (_=&^%$#@!)",
    // About me page
    "about.title": "Обо мне",
    "about.desc": "Я full-stack веб-разработчик, создаю веб-приложения с помощью современных технологий. Хорошо работаю с Node.js, Express, PostgreSQL и Docker. Всегда стремлюсь учиться новому и совершенствовать свои навыки.",
    "about.skills": "Навыки",
    "about.contact": "Контакты",
    "about.phone": "Телефон",
    // Projects page
    "projects.titleMy": "Мои",
    "projects.titleProjects": "проекты",
    "projects.desc": "Коллекция проектов, которые я разработал и над которыми работаю",
    "projects.pgAuthDesc": "Система аутентификации на основе PostgreSQL. Деплой через Docker, Express API.",
    "projects.portfolioDesc": "Личный сайт-портфолио. Tailwind CSS, Vite и современный дизайн.",
    "projects.visitSite": "Перейти на сайт",
    "projects.samplesTitle": "Примеры проектов",
    "projects.samplesDesc": "12 JavaScript проектов: Palindrome Checker, Cash Register, Qur'an App и другие.",
    "projects.viewAll": "Посмотреть все",
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
    "backHome": "Back to homepage",
    "login": "Login",
    "login.subtitle": "Sign in to your account",
    "login.password": "Password",
    "login.remember": "Remember me",
    "login.forgot": "Forgot password?",
    "login.submit": "Sign in",
    "login.or": "or",
    "login.noAccount": "Don't have an account?",
    "login.registerLink": "Sign up",
    "register.subtitle": "Create a new account",
    "register.google": "Sign up with Google",
    "register.github": "Sign up with GitHub",
    "register.or": "or",
    "register.name": "Name",
    "register.password": "Password",
    "register.confirm": "Confirm password",
    "register.submit": "Sign up",
    "register.hasAccount": "Already have an account?",
    "register.loginLink": "Sign in",
    "nav.dashboard": "Dashboard",
    "nav.home": "Home",
    "dash.loading": "Loading...",
    "dash.welcome": "Welcome,",
    "dash.subtitle": "This is your personal dashboard",
    "dash.online": "Online",
    "dash.profile": "Profile",
    "dash.provider": "Auth method",
    "dash.joined": "Joined",
    "dash.actions": "Quick actions",
    "dash.viewProjects": "View projects",
    "dash.viewProjectsDesc": "All projects and samples",
    "dash.viewSamples": "Samples",
    "dash.viewSamplesDesc": "12 practical project samples",
    "dash.aboutMe": "About me",
    "dash.aboutMeDesc": "Personal info page",
    "dash.contact": "Contact",
    "dash.contactDesc": "Contact information",
    "dash.telegramDesc": "Message on Telegram",
    "dash.githubDesc": "View source code",
    "dash.logout": "Logout",
    "register.rule8": "At least 8 characters",
    "register.ruleUpper": "At least 1 uppercase letter (A-Z)",
    "register.ruleNumber": "At least 1 number (0-9)",
    "register.ruleSpecial": "At least 1 special character (_=&^%$#@!)",
    // About me page
    "about.title": "About me",
    "about.desc": "I'm a full-stack web developer, building web applications using modern technologies. I work well with Node.js, Express, PostgreSQL and Docker. I always strive to learn new things and improve my skills.",
    "about.skills": "Skills",
    "about.contact": "Contact",
    "about.phone": "Phone",
    // Projects page
    "projects.titleMy": "My",
    "projects.titleProjects": "projects",
    "projects.desc": "A collection of projects I've built and am working on",
    "projects.pgAuthDesc": "Authentication system based on PostgreSQL. Docker deployment, Express API.",
    "projects.portfolioDesc": "Personal portfolio website. Tailwind CSS, Vite and modern design.",
    "projects.visitSite": "Visit site",
    "projects.samplesTitle": "Project samples",
    "projects.samplesDesc": "12 JavaScript projects: Palindrome Checker, Cash Register, Qur'an App and more.",
    "projects.viewAll": "View all",
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
