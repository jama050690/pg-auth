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
const form = document.getElementById("loginForm");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard/";
    } else {
      alert(data.error || "Login xatolik");
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});
