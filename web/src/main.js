import "./shared.js";

// API fetch
try {
  const json = await (await fetch("http://localhost:3000")).json();
  console.log(json);
} catch (err) {
  console.log("API not available");
}
