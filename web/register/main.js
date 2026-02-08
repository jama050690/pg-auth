import "../src/shared.js";

// Toggle password visibility
const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggleBtn?.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleBtn.querySelector("i").classList.toggle("fa-eye");
  toggleBtn.querySelector("i").classList.toggle("fa-eye-slash");
});

// Real-time password validation
function updateRule(id, passed) {
  const el = document.getElementById(id);
  if (!el) return;
  const icon = el.querySelector("i");
  const text = el.querySelector("span");
  if (passed) {
    icon.classList.remove("fa-circle", "text-gray-600");
    icon.classList.add("fa-check", "text-green-400");
    text.classList.remove("text-gray-500");
    text.classList.add("text-green-400");
  } else {
    icon.classList.remove("fa-check", "text-green-400");
    icon.classList.add("fa-circle", "text-gray-600");
    text.classList.remove("text-green-400");
    text.classList.add("text-gray-500");
  }
}

function validatePassword(pw) {
  const hasLength = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[_=&^%$#@!]/.test(pw);

  updateRule("ruleLength", hasLength);
  updateRule("ruleUpper", hasUpper);
  updateRule("ruleNumber", hasNumber);
  updateRule("ruleSpecial", hasSpecial);

  return hasLength && hasUpper && hasNumber && hasSpecial;
}

passwordInput?.addEventListener("input", () => {
  validatePassword(passwordInput.value);
});

// Form submit
const form = document.getElementById("registerForm");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!validatePassword(password)) {
    alert("Parol talablarga mos kelmadi! Kamida 8 ta belgi, 1 katta harf, 1 raqam va 1 maxsus belgi (_=&^%$#@!) bo'lishi kerak.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Parollar mos kelmadi!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard/";
    } else {
      alert(data.error || "Ro'yxatdan o'tishda xatolik");
    }
  } catch (err) {
    console.error("Register error:", err);
  }
});
