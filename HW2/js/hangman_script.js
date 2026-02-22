// --- Word bank (will be updated over time) ---
    const WORD_BANK = [
      { category: "Animals", word: "aardvark" },
      { category: "Animals", word: "cat" },
      { category: "Animals", word: "dog" },
      { category: "Animals", word: "elephant" },
      { category: "Animals", word: "giraffe" },
      { category: "Animals", word: "kangaroo" },
      { category: "Animals", word: "lion" },
      { category: "Animals", word: "monkey" },
      { category: "Animals", word: "platypus" },
      { category: "Animals", word: "zebra" },
      { category: "Food", word: "avocado" },
      { category: "Food", word: "broccoli" },
      { category: "Food", word: "carrot" },
      { category: "Food", word: "eggs" },
      { category: "Food", word: "fries" },
      { category: "Food", word: "lollipop" },
      { category: "Food", word: "pancake" },
      { category: "Food", word: "pizza" },
      { category: "Food", word: "spaghetti" },
      { category: "Food", word: "watermelon" },
      { category: "Places", word: "beach" },
      { category: "Places", word: "canyon" },
      { category: "Places", word: "desert" },
      { category: "Places", word: "forest" },
      { category: "Places", word: "hill" },
      { category: "Places", word: "lake" },
      { category: "Places", word: "mountain" },
      { category: "Places", word: "oasis" },
      { category: "Places", word: "river" },
      { category: "Places", word: "waterfall" },
      { category: "Space", word: "astronaut" },
      { category: "Space", word: "asteroid" },
      { category: "Space", word: "comet" },
      { category: "Space", word: "moon" },
      { category: "Space", word: "planet" },
      { category: "Space", word: "rocket" },
      { category: "Space", word: "satellite" },
      { category: "Space", word: "star" },
      { category: "Space", word: "telescope" },
      { category: "Space", word: "universe" },
      { category: "Tech", word: "algorithm" },
      { category: "Tech", word: "computer" },
      { category: "Tech", word: "cybersecurity" },
      { category: "Tech", word: "database" },
      { category: "Tech", word: "html" },
      { category: "Tech", word: "javascript" },
      { category: "Tech", word: "program" },
      { category: "Tech", word: "router" },
      { category: "Tech", word: "server" },
      { category: "Tech", word: "television" }
    ];

    const MAX_WRONG = 6; // standard hangman body parts count

    // --- State ---
    let answer = "";
    let category = "";
    let guessed = new Set();
    let wrong = new Set();
    let gameOver = false;
    let hintUsedThisTurn = false;

    // --- DOM ---
    const wordText = document.getElementById("wordText");
    const keyboard = document.getElementById("keyboard");
    const livesText = document.getElementById("livesText");
    const livesInline = document.getElementById("livesInline");
    const wrongText = document.getElementById("wrongText");
    const statusBox = document.getElementById("statusBox");
    const catText = document.getElementById("catText");
    const hintText = document.getElementById("hintText");

    const newGameBtn = document.getElementById("newGameBtn");
    const hintBtn = document.getElementById("hintBtn");
    const revealBtn = document.getElementById("revealBtn");

    const canvas = document.getElementById("hangman");
    const ctx = canvas.getContext("2d");

    // --- Helpers ---
    function choice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function normalizeLetter(l) {
      return (l || "").toLowerCase();
    }

    function remainingLives() {
      return MAX_WRONG - wrong.size;
    }

    function getMaskedWord() {
      // show underscores for not-yet-guessed letters; keep spaces/hyphens if present
      return answer.split("").map(ch => {
        if (ch === " " || ch === "-") return ch;
        return guessed.has(ch) ? ch.toUpperCase() : "_";
      }).join(" ");
    }

    function setStatus(message, kind = "") {
      statusBox.className = "status" + (kind ? " " + kind : "");
      statusBox.innerHTML = message || "";
    }

    function isWin() {
      for (const ch of answer) {
        if (ch === " " || ch === "-") continue;
        if (!guessed.has(ch)) return false;
      }
      return true;
    }

    function endGame(won) {
      gameOver = true;
      hintBtn.disabled = true;
      revealBtn.disabled = true;

      if (won) {
        setStatus(`✅ You won! The word was <strong>${answer.toUpperCase()}</strong>.`, "win");
      } else {
        setStatus(`💀 You lost. The word was <strong>${answer.toUpperCase()}</strong>.`, "lose");
      }
      render();
    }

    // --- Drawing ---
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function strokeLine(x1, y1, x2, y2, width = 10) {
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function drawGallows() {
      ctx.strokeStyle = "rgba(231,238,252,0.9)";
      // base
      strokeLine(80, 470, 300, 470, 12);
      // pole
      strokeLine(140, 470, 140, 80, 12);
      // top beam
      strokeLine(140, 90, 360, 90, 12);
      // rope
      strokeLine(360, 90, 360, 140, 8);
    }

    function drawHead() {
      ctx.strokeStyle = "rgba(231,238,252,0.9)";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(360, 175, 35, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawBody() { strokeLine(360, 210, 360, 330, 10); }
    function drawLeftArm() { strokeLine(360, 245, 300, 290, 10); }
    function drawRightArm() { strokeLine(360, 245, 420, 290, 10); }
    function drawLeftLeg() { strokeLine(360, 330, 310, 410, 10); }
    function drawRightLeg() { strokeLine(360, 330, 410, 410, 10); }

    function drawHangmanByWrongCount(n) {
      // 0..6
      if (n >= 1) drawHead();
      if (n >= 2) drawBody();
      if (n >= 3) drawLeftArm();
      if (n >= 4) drawRightArm();
      if (n >= 5) drawLeftLeg();
      if (n >= 6) drawRightLeg();
    }

    function renderCanvas() {
      clearCanvas();
      drawGallows();
      drawHangmanByWrongCount(wrong.size);
    }

    // --- Keyboard ---
    const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

    function buildKeyboard() {
      keyboard.innerHTML = "";
      for (const l of LETTERS) {
        const btn = document.createElement("button");
        btn.className = "key";
        btn.type = "button";
        btn.textContent = l;
        btn.setAttribute("aria-label", `Guess letter ${l.toUpperCase()}`);
        btn.addEventListener("click", () => makeGuess(l));
        keyboard.appendChild(btn);
      }
    }

    function updateKeyboard() {
      const keys = keyboard.querySelectorAll(".key");
      keys.forEach(key => {
        const l = key.textContent;
        const used = guessed.has(l) || wrong.has(l);
        key.disabled = used || gameOver;
        key.classList.toggle("used", used || gameOver);
        key.classList.toggle("good", guessed.has(l));
        key.classList.toggle("bad", wrong.has(l));
      });
    }

    // --- Core gameplay ---
    function makeGuess(raw) {
      if (gameOver) return;

      const l = normalizeLetter(raw);
      if (!/^[a-z]$/.test(l)) return;

      if (guessed.has(l) || wrong.has(l)) {
        setStatus(`You already tried <strong>${l.toUpperCase()}</strong>.`);
        return;
      }

      if (answer.includes(l)) {
        guessed.add(l);
        setStatus(`✅ Nice! <strong>${l.toUpperCase()}</strong> is in the word.`);
      } else {
        wrong.add(l);
        setStatus(`❌ Nope. <strong>${l.toUpperCase()}</strong> is not in the word.`);
      }

      hintUsedThisTurn = false;
      render();

      if (isWin()) return endGame(true);
      if (remainingLives() <= 0) return endGame(false);
    }

    function revealOneLetter() {
      if (gameOver) return;
      if (hintUsedThisTurn) {
        setStatus(`Hint already used—make a guess first.`);
        return;
      }

      const hidden = [];
      for (const ch of answer) {
        if (ch === " " || ch === "-") continue;
        if (!guessed.has(ch)) hidden.push(ch);
      }

      if (hidden.length === 0) {
        setStatus(`No hidden letters left!`);
        return;
      }

      // Reveal a random hidden letter (no penalty)
      const pick = hidden[Math.floor(Math.random() * hidden.length)];
      guessed.add(pick);
      hintUsedThisTurn = true;

      hintText.textContent = `Revealed: ${pick.toUpperCase()}`;
      setStatus(`💡 Revealed <strong>${pick.toUpperCase()}</strong>.`);

      render();

      if (isWin()) return endGame(true);
    }

    function revealWordAndLose() {
      if (gameOver) return;
      wrong = new Set("xxxxxx".split("")); // force 6 wrong
      render();
      endGame(false);
    }

    function render() {
      wordText.textContent = getMaskedWord();
      const lives = remainingLives();
      livesText.textContent = String(lives);
      livesInline.textContent = String(lives);

      const wrongArr = Array.from(wrong).sort();
      wrongText.textContent = wrongArr.length ? wrongArr.map(c => c.toUpperCase()).join(" ") : "—";

      catText.textContent = category;

      renderCanvas();
      updateKeyboard();

      // Disable hint if nothing to reveal
      const anyHidden = answer.split("").some(ch => ch !== " " && ch !== "-" && !guessed.has(ch));
      hintBtn.disabled = gameOver || !anyHidden;
    }

    function newGame() {
      const pick = choice(WORD_BANK);
      answer = pick.word.toLowerCase();
      category = pick.category;

      guessed = new Set();
      wrong = new Set();
      gameOver = false;
      hintUsedThisTurn = false;

      hintText.textContent = `Press “Hint” to reveal one letter.`;
      setStatus(`Guess the word!`);

      buildKeyboard();
      render();
    }

    // --- Events ---
    newGameBtn.addEventListener("click", newGame);
    hintBtn.addEventListener("click", revealOneLetter);
    revealBtn.addEventListener("click", revealWordAndLose);

    window.addEventListener("keydown", (e) => {
      // Ignore if user is using a modifier combo
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === "enter" && gameOver) newGame();
      else makeGuess(key);
    });

    // Start
    newGame();
