let zipElement = document.querySelector("#zipCodeInput");
let passwordElement = document.querySelector("#passwordInput");
let usernameElement = document.querySelector("#usernameInput");
let stateElement = document.querySelector("#stateSelection");

zipElement.addEventListener("change", displayCity);
passwordElement.addEventListener("click", suggestPassword);
passwordElement.addEventListener("input", validatePasswordLength);
usernameElement.addEventListener("change", checkUsername);
stateElement.addEventListener("change", displayCounties);

displayStates(); // Load states on page load

async function displayStates(){
  let url = "https://csumb.space/api/allStatesAPI.php";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error accessing API endpoint");
    const data = await response.json();

    for(let i of data){
      let optionEl = document.createElement("option");
      optionEl.textContent = i.state;
      optionEl.value = i.usps;
      stateElement.append(optionEl);
    }
  } catch (err) {
    alert(err.message);
  }
}

async function displayCity(){
  let zipCode = zipElement.value;
  let url = "https://csumb.space/api/cityInfoAPI.php?zip=" + zipCode;

  try {
    let response = await fetch(url);
    let data = await response.json();

    document.querySelector("#cityDisplay").textContent = data.city || "";
    document.querySelector("#latitudeDisplay").textContent = data.latitude || "";
    document.querySelector("#longitudeDisplay").textContent = data.longitude || "";
  } catch (err) {
    console.log("Error fetching city info");
  }
}

function suggestPassword(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for(let i = 0; i < 8; i++){
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  passwordElement.value = password;
}

function checkUsername(){
  const unavailable = ["eeny", "meeny", "miny", "mo", "moe", "jon", "john", "juan", "miguel", "michael", "maria", "mario", "luigi", "Eeny", "Meeny", "Miny", "Mo", "Moe", "Jon", "John", "Juan", "Miguel", "Michael", "Maria", "Mario", "Luigi"];
  let username = usernameElement.value.toLowerCase();
  let message = document.querySelector("#usernameMsg");

  if(unavailable.includes(username)){
    message.textContent = "Username is NOT available";
    message.style.color = "red";
  } else {
    message.textContent = "Username is available";
    message.style.color = "green";
  }
}

async function displayCounties(){
  let state = stateElement.value;
  let url = "https://csumb.space/api/countyListAPI.php?state=" + state;

  try {
    let response = await fetch(url);
    let data = await response.json();

    let countySelect = document.querySelector("#countySelection");
    countySelect.innerHTML = "";

    for(let county of data){
      let option = document.createElement("option");
      option.textContent = county.county;
      countySelect.append(option);
    }
  } catch (err) {
    console.log("Error fetching counties");
  }
}

function validatePasswordLength(){
  let errorDiv = document.querySelector("#errorMsg");
  if(passwordElement.value.length < 6){
    errorDiv.textContent = "Error! Password must be at least 6 characters long. Type a stronger password!";
  } else {
    errorDiv.textContent = "";
  }
}
