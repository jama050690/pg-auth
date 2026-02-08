const nameEl = document.getElementById("name");
const logoutBtn = document.getElementById("logoutBtn");
const editEl = document.getElementById("edit");
const darkEl = document.getElementById("dark");
const modeIcon = document.getElementById("modeIcon");
var currentUser; // user object
var currentUserEmail; // user email
const LOGGED_USER = "logged_in_user";
const USERS = "users";
var users = [];

const profile_photoEl = document.getElementById("previewImage");

// Dark mode menu
const MODE = "mode";
let isDark = false;

// FUNCTION lar
const changeMode = () => {
  if (isDark) {
    document.body.classList.add("dark_mode");
    document.body.classList.remove("light_mode");
    modeIcon.src = "../public/Sun_mode.svg";
  } else {
    document.body.classList.add("light_mode");
    document.body.classList.remove("dark_mode");
    modeIcon.src = "../public/Dark_mode.svg";
  }
};

// EVENT lar
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

  currentUserEmail = localStorage.getItem(LOGGED_USER);

  if (!currentUserEmail) {
    alert("User not found! Please, login again!");
    window.location.href = "../auth/login.html";
    return;
  }

  users = JSON.parse(localStorage.getItem(USERS)) || [];

  currentUser = users.find((user) => user.email == currentUserEmail);

  // Profile Photo
  // console.log(currentUser);

  if (currentUser.profileUrl) {
    profile_photoEl.src = currentUser.profileUrl;
  }

  // Name
  nameEl.textContent = currentUser.name || "Unknown";
});

// logout button
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(LOGGED_USER);
  window.location.reload();
});

// local pagega saqlaash va chaqirish

//   img put
document
  .getElementById("uploadImg")
  .addEventListener("change", async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      e.preventDefault();
      profile_photoEl.src = e.target.result;
    };

    reader.readAsDataURL(file);
    // Upload to Node.js backend
    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // REAL FILE PATH FROM BACKEND
    currentUser.profileUrl = data.url;

    users = users.filter((user) => user.email != LOGGED_USER);
    users.push(currentUser);

    // Save user info
    localStorage.setItem(USERS, JSON.stringify(users));
    console.log("Image saved at:", data.url);
  });

// Modalni ochish
editEl.addEventListener("click", (e) => {
  e.preventDefault();
  const editBox = document.createElement("div");
  editBox.className =
    "fixed inset-0 bg-black/60 flex justify-center items-center z-[999]";

  // Modal card content
  editBox.innerHTML = `
  <div class="modal relative bg-white w-[350px] p-5 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">About Me</h3>

    <input id="ediText" type="text" value="${currentUser?.about_text || ""}"
        class="w-full my-2 px-3 py-2 border rounded" required />

    <div class="border-t border-gray-300 pt-3">
      <p><b>Age:</b></p>
      <input id="editAge" type="text" value="${currentUser?.age || ""}"
        class="w-full my-2 px-3 py-2 border rounded" required />

      <p><b>Location:</b></p>
      <input id="editLocation" type="text" value="${
        currentUser?.location || ""
      }"
        class="w-full my-2 px-3 py-2 border rounded" required />
        <p class="flex my-4 mx-4">
              <i class="fa-brands fa-telegram w-[80px]"></i>
              <i class="fa-brands fa-linkedin w-[80px]"></i>
              <i class="fa-brands fa-square-github w-[80px]"></i>
        </p>
      <div class="flex justify-center my-6">
        <button id="save"
          class="rounded-full cursor-pointer bg-blue-600 text-white px-10 py-3 hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  </div>
`;

  document.body.appendChild(editBox);

  // Close button
  const editClose = document.createElement("span");
  editClose.className =
    "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white text-xl cursor-pointer hover:bg-red-700 transition";
  editClose.innerHTML = "&times;";

  // Append close button to modal
  editBox.querySelector("div").appendChild(editClose);

  // Close event
  editClose.addEventListener("click", () => {
    editBox.classList.add("hidden");
  });

  // save modal button
  const saveBtn = editBox.querySelector("#save");

  const editText = document.getElementById("ediText");
  const editAge = document.getElementById("editAge");
  const editLocation = document.getElementById("editLocation");
  saveBtn.addEventListener("click", () => {
    if (
      !editText.value.trim() ||
      !editAge.value.trim() ||
      !editLocation.value.trim()
    ) {
      alert("Iltoms qatorni to'ldiring");
      return;
    }

    const newText = document.getElementById("ediText").value.trim();
    const newAge = document.getElementById("editAge").value.trim();
    const newLocation = document.getElementById("editLocation").value.trim();

    // Yangilash
    currentUser.aboutMe = newText;
    currentUser.age = newAge;
    currentUser.location = newLocation;

    alert("Ma'lumotlar saqlandi!");
    editBox.classList.add("hidden");

    // Sahifadagi UI ni ham yangilash
    profileAbout.textContent = newText || "No information provided.";
    profileAge.textContent = newAge || "Not set";
    profileLocation.textContent = newLocation || "Not set";
  });
});
