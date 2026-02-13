document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);

shuffleQ1Choices();
function shuffleQ1Choices(){
    let q1Choices = ["font-color", "color", "text-color", "fontColor", "textColor", "colour"];
    q1Choices = _.shuffle(q1Choices);
    console.log(q1Choices);
    for(let i of q1Choices){
    let radioElement = document.createElement("input");
    radioElement.type = "radio";
    radioElement.name = "q1";
    radioElement.value = i;
    let labelElement = document.createElement("label");
    labelElement.textContent = i;
    labelElement.prepend(radioElement);
    document.querySelector("#q1ChoicesDiv").append(labelElement);
    console.log(labelElement);
    }
}

function gradeQuiz() {
  let score = 0;
  const total = 5;

  // Q1 (radio)
  const q1Checked = document.querySelector("input[name=q1]:checked");
  const userAnswer1 = q1Checked ? q1Checked.value : "";
  if (userAnswer1 === "color") {
  score++;
  document.getElementById("q1Container").classList.add("correct");
} else {
  document.getElementById("q1Container").classList.add("incorrect");
}

  // Q2 (text) — correct: em
  const userAnswer2 = (document.querySelector("#q2").value || "").trim().toLowerCase();
  if (userAnswer2 === "em") {
  score++;
  document.getElementById("q2Container").classList.add("correct");
} else {
  document.getElementById("q2Container").classList.add("incorrect");
}

  // Q3 (dropdown/select) — correct: line-height
  const userAnswer3 = document.querySelector("#q3").value;
  if (userAnswer3 === "line-height") {
  score++;
  document.getElementById("q3Container").classList.add("correct");
} else {
  document.getElementById("q3Container").classList.add("incorrect");
}

  // Q4 (number) — correct: 1
  const q4Raw = document.querySelector("#q4").value;
  const userAnswer4 = q4Raw === "" ? NaN : Number(q4Raw);
  if (!Number.isNaN(userAnswer4) && Math.abs(userAnswer4 - 1) < 1e-9) {
  score++;
  document.getElementById("q4Container").classList.add("correct");
} else {
  document.getElementById("q4Container").classList.add("incorrect");
}

  // Q5 (checkbox) — must select all correct and no incorrect
  const correctQ5 = new Set(["block", "inline", "flex", "grid", "none"]);
  const chosenQ5 = Array.from(document.querySelectorAll("input[name=q5]:checked")).map(el => el.value);
  const chosenSet = new Set(chosenQ5);

  let q5AllCorrect = true;

  // no wrong answers
  for (const v of chosenSet) {
    if (!correctQ5.has(v)) {
      q5AllCorrect = false;
      break;
    }
  }
  // all correct answers chosen
  if (q5AllCorrect) {
    for (const v of correctQ5) {
      if (!chosenSet.has(v)) {
        q5AllCorrect = false;
        break;
      }
    }
  }
  if (q5AllCorrect) {
  score++;
  document.getElementById("q5Container").classList.add("correct");
} else {
  document.getElementById("q5Container").classList.add("incorrect");
}

  // Results
  const results = document.querySelector("#results");
  results.textContent = `You scored ${score*20} / ${total*20} points.`;

  // If users leave questions blank, site WILL take note!
  const missing = [];
  if (!q1Checked) missing.push("Q1");
  if (!userAnswer2) missing.push("Q2");
  if (!userAnswer3) missing.push("Q3");
  if (q4Raw === "") missing.push("Q4");

  if (missing.length) results.textContent += ` (You left: ${missing.join(", ")} blank.)`;
}
