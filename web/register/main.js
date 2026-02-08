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

// Form submit
const form = document.getElementById("registerForm");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

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
      window.location.href = "/";
    } else {
      alert(data.error || "Ro'yxatdan o'tishda xatolik");
    }
  } catch (err) {
    console.error("Register error:", err);
  }
});
