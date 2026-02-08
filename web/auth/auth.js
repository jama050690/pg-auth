const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
let users = [];
const USERS = "users";
// functions
/**user registration function */
function registerUser() {
  users = JSON.parse(localStorage.getItem(USERS)) || [];
  const emailText = emailInput.value.trim();
  const passwordText = passwordInput.value.trim();
  let nameInput = document.getElementById("name");
  let nameText = nameInput.value.trim();
  if (nameText === "" || emailText === "" || passwordText === "") {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  let user = users.find((user) => user.email == emailText);
  if (user) {
    alert("Siz oldin ro'yhatdan o'tgansiz! Iltimos login qiling.");
    window.location.href = "./login.html";
    return;
  }

  user = {
    id: users.length + 1,
    name: nameText,
    email: emailText,
    password: passwordText,
  };
  users.push(user);
  localStorage.setItem(USERS, JSON.stringify(users)); // all users
  let count = Number(localStorage.getItem("count"));
  count += 1;
  localStorage.setItem("count", count);
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  console.log(users);
  alert(
    `Muvaffaqtiyatli ro'yhatdan o'tganinggiz bilan tabriklayman, ${user.name}!`
  );
  window.location.href = "./login.html";
}

/**
 * user login function
 */
function loginUser() {
  // login
  const userEmail = emailInput.value.trim();
  const password = passwordInput.value.trim();
  users = JSON.parse(localStorage.getItem(USERS)) || [];

  const user = users.find((user) => user.email == userEmail);
  console.log(user);

  if (user && user.password === password) {
    alert(`Login muvaffaqiyatli amalga oshirildi,${user.name}!`);
    localStorage.setItem("logged_in_user", user.email);
    window.location.href = "../user_page/index.html";
  } else {
    let errMessage;
    if (!user) {
      errMessage = "Foydalanuvchi topilmadi!";
    } else {
      errMessage =
        "Parolingiz xato kiritildi. Parolingizi tekshirib qayta urinib ko'ring";
    }

    console.log(errMessage);
    alert(errMessage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.href;
  if (currentUrl.includes("login")) {
    const btn = document.getElementById("login_btn");
    if (btn) btn.addEventListener("click", loginUser);
  } else {
    const btn = document.getElementById("register_btn");
    if (btn) btn.addEventListener("click", registerUser);
  }
});
