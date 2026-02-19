document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);

shuffleQ1Choices();

function shuffleQ1Choices(){
    let q1Choices = ["font-color", "color", "text-color", "fontColor", "textColor", "colour"];
    q1Choices = _.shuffle(q1Choices);

    for(let choice of q1Choices){
        let radioElement = document.createElement("input");
        radioElement.type = "radio";
        radioElement.name = "q1";
        radioElement.value = choice;
        radioElement.id = "q1_" + choice;

        let labelElement = document.createElement("label");
        labelElement.setAttribute("for", radioElement.id);
        labelElement.textContent = choice;

        document.querySelector("#q1ChoicesDiv").append(radioElement);
        document.querySelector("#q1ChoicesDiv").append(labelElement);
        document.querySelector("#q1ChoicesDiv").append(document.createElement("br"));
    }
}

function gradeQuiz() {

  // Remove previous styles
  document.querySelectorAll(".q").forEach(q => {
    q.classList.remove("correct", "incorrect");
  });

  let score = 0;
  const total = 100;

  // Q1
  const q1Checked = document.querySelector("input[name=q1]:checked");
  const userAnswer1 = q1Checked ? q1Checked.value : "";

  if (userAnswer1 === "color") {
    score += 20;
    document.getElementById("q1Container").classList.add("correct");
    document.getElementById("q1Img").src = "img/check.png";
  } else {
    document.getElementById("q1Container").classList.add("incorrect");
    document.getElementById("q1Img").src = "img/x.png";
  }

  // Q2
  const userAnswer2 = (document.querySelector("#q2").value || "").trim().toLowerCase();
  if (userAnswer2 === "em") {
    score += 20;
    document.getElementById("q2Container").classList.add("correct");
    document.getElementById("q2Img").src = "img/check.png";
  } else {
    document.getElementById("q2Container").classList.add("incorrect");
    document.getElementById("q2Img").src = "img/x.png";
  }

  // Q3
  const userAnswer3 = document.querySelector("#q3").value;
  if (userAnswer3 === "line-height") {
    score += 20;
    document.getElementById("q3Container").classList.add("correct");
    document.getElementById("q3Img").src = "img/check.png";
  } else {
    document.getElementById("q3Container").classList.add("incorrect");
    document.getElementById("q3Img").src = "img/x.png";
  }

  // Q4
  const q4Raw = document.querySelector("#q4").value;
  const userAnswer4 = q4Raw === "" ? NaN : Number(q4Raw);

  if (!Number.isNaN(userAnswer4) && userAnswer4 === 1) {
    score += 20;
    document.getElementById("q4Container").classList.add("correct");
    document.getElementById("q4Img").src = "img/check.png";
  } else {
    document.getElementById("q4Container").classList.add("incorrect");
    document.getElementById("q4Img").src = "img/x.png";
  }

  // Q5
  const correctQ5 = new Set(["block", "inline", "flex", "grid", "none"]);
  const chosenQ5 = Array.from(document.querySelectorAll("input[name=q5]:checked")).map(el => el.value);
  const chosenSet = new Set(chosenQ5);

  let q5AllCorrect = true;

  for (const v of chosenSet) {
    if (!correctQ5.has(v)) q5AllCorrect = false;
  }

  for (const v of correctQ5) {
    if (!chosenSet.has(v)) q5AllCorrect = false;
  }

  if (q5AllCorrect) {
    score += 20;
    document.getElementById("q5Container").classList.add("correct");
    document.getElementById("q5Img").src = "img/check.png";
  } else {
    document.getElementById("q5Container").classList.add("incorrect");
    document.getElementById("q5Img").src = "img/x.png";
  }

  // Display Score
  const results = document.querySelector("#results");
  results.innerHTML = `You scored ${score} / ${total} points.`;

  // Congratulatory message
  if (score > 80) {
    results.innerHTML += "<br>🎉 Congratulations! You scored above 80%!";
  }

  // Local Storage (Quiz Attempts)
  let timesTaken = localStorage.getItem("quizTaken");

  if (timesTaken === null) {
    timesTaken = 0;
  }

  timesTaken = parseInt(timesTaken);
  timesTaken++;

  localStorage.setItem("quizTaken", timesTaken);

  results.innerHTML += `<br>Quiz taken ${timesTaken} times.`;
}
