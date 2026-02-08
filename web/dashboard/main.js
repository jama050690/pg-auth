import "../src/shared.js";

// Check auth and load user data
async function loadDashboard() {
  const loading = document.getElementById("loading");
  const content = document.getElementById("dashContent");

  try {
    const res = await fetch("http://localhost:3000/me", {
      credentials: "include",
    });

    if (!res.ok) {
      // Not authenticated — redirect to login
      window.location.href = "/login/";
      return;
    }

    const data = await res.json();
    const user = data.user;

    // Fill user data
    document.getElementById("userName").textContent = user.name;
    document.getElementById("statName").textContent = user.name;
    document.getElementById("statEmail").textContent = user.email;
    document.getElementById("statProvider").textContent = user.provider || "local";

    // Format date
    const date = new Date(user.created_at);
    document.getElementById("statDate").textContent = date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Show content
    loading.classList.add("hidden");
    content.classList.remove("hidden");
  } catch (err) {
    console.error("Dashboard error:", err);
    window.location.href = "/login/";
  }
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  try {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
  window.location.href = "/login/";
});

loadDashboard();
