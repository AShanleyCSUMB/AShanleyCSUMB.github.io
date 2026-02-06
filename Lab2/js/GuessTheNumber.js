function guess(){
    let userGuess = document.querySelector("#userGuess").value;
checkGuess(userGuess);
}
document.querySelector("#guessButton").addEventListener("click", guess);
let randomNumber = Math.floor(Math.random()*99)+1;
console.log(randomNumber);
let guessCount = 0;
function checkGuess(userGuess){
    guessCount +=1;
        if(userGuess == randomNumber){
            document.querySelector("#result").textContent = "Congratulations! You found the number we thought of!";
            document.querySelector("#result").style.color="green";
            return;
        }
        else if(userGuess < randomNumber){
            document.querySelector("#result").textContent = "That guess is too low. Try again.";
            document.querySelector("#result").style.color="orange";
        }
        else if(userGuess > randomNumber){
            document.querySelector("#result").textContent = "That guess is too high. Try again.";
            document.querySelector("#result").style.color="orange";
        }
        document.querySelector("#guessNumList").textContent += userGuess + " ";
        if(guessCount == 7){
            document.querySelector("#result").textContent = "Game over! The number we thought of was " + randomNumber;
            document.querySelector("#result").style.color="red";
        }
    return;
}
