let zipElement = document.querySelector("#zipCodeInput");
zipElement.addEventListener("change", displayCity);
async function displayStates(){
  let url = "https://csumb.space/api/allStatesAPI.php";
   try {
       const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error accessing API endpoint")
        }
       const data = await response.json();
       console.log(data);
     for(let i of data){
     let optionEl = document.createElement("option");
     optionEl.textContent = i.state;
     optionEl.value = i.usps;
     document.querySelector("#stateSelection").append(optionEl);
     }
       } catch (err) {
             if (err instanceof TypeError) {
                alert("Error accessing API endpoint (network failure)");
              } else {
                alert(err.message);
              }
      }
}
async function displayCity(){
  let zipCode = zipElement.value;
  let url = "https://csumb.space/api/cityInfoAPI.php?zip=" + zipCode;
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
  document.querySelector("#cityDisplay").textContent = data.city;
}
