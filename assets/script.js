const viewScore = document.querySelector("#view-score");
const timer = document.querySelector("#timer");
const quizBox = document.querySelector("#quiz-box");
const title = document.querySelector("#title");
const hint = document.querySelector("#question");
const startGameButton = document.getElementById("start-game");
const choiceBox = document.querySelector("#choice-box");
const form = document.querySelector("form");
const Initials = document.getElementById("name");
const feedback = document.querySelector("#feedback");
const playAgain = document.getElementById("play-again");
const localScores = document.getElementById("local-scores");

let userChoice;
let questionNum = -1;
let time = 120000;
let score;
let tryAgainStatus = false;

const Questions = [
    {
        question:
            "Which built in method returns the length of a string?",
        options: ["a: length()", "b: size()", "c: index()"],
        answer: "a: length()",
    },
    {
        question:
            "Which of the following functions of array objects sorts the elements of an array?",
        options: ["a: unshift()", "b: toSource()", "c: sort()"],
        answer: "c: sort()",
    },
    {
        question:
            "Function and var are known as:",
        options: ["a: Keywords", "b: Declaration statements", "c: Data types"],
        answer: "b: Declaration statements",
    },
    {
        question:
            "Which of the following is not a Javascript data type?",
        options: ["a: Float", "b: Number", "c: Boolean"],
        answer: "a: Float",
    },
    {
        question:
            "Inside which HTML element do we put Javascript?",
        options: [ "a: <script>", "b: <head>", "c: <style>"],
        answer: "a: <script>",
    },
    {
        question:
            "What class is used to store keyed data and complex entities in javascript",
        options: ["a: constant", "b: variable", "c: object"],
        answer: "c: object",
    },
];

shuffleArray(Questions);

if (JSON.parse(localStorage.getItem("highScore")) == null) {
    var scoreArray = [];
} else
    var scoreArray = [].concat(JSON.parse(localStorage.getItem("highScore")));
    

function hide(target) {
    target.className = "hidden";
}

function show(target) {
    target.className = "visible";
}

function gameTimer() {
    let gameTimer = setInterval(function () {
        if (time > 0) {
            time = time - 1000;
            let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((time % (1000 * 60)) / 1000);
            timer.textContent = minutes + ":" + seconds;
        }
        if (time <= 0) {
            let tryAgain = confirm(
                "Looks like you ran out of time, would you like to try again?"
            );
            if (tryAgain == true) {
                location.reload();
            }
        }
        if (tryAgainStatus == true) {
            clearInterval(gameTimer);
        }
    }, 1000);
}

function startGame() {
    hide(title);
    hide(startGameButton);
    gameTimer();
    nextQuestion();
}
startGameButton.addEventListener("click", startGame);

function feedbackFade() {
    setInterval(function () {
        hide(feedback);
    }, 1500);
}

function nextQuestion() {
    if (choiceBox.childElementCount > 0) {
        choiceBox.innerHTML = "";
    }

    if (questionNum + 1 === Questions.length) {
        score = time / 1000;
        choiceBox.innerHTML = "";
        show(title);
        title.textContent = "All Done!";
        hint.textContent =
            "You've finished the quiz, you're score is  " + score;
        show(form);
        tryAgainStatus = true;
    }
    questionNum++;
    show(feedback);
    if (questionNum <= Questions.length - 1) {
        for (let i = 0; i < Questions[questionNum].options.length; i++) {
            hint.textContent = Questions[questionNum].question;
            let userOptions = document.createElement("button");
            choiceBox.appendChild(userOptions);
            userOptions.setAttribute("id", "choice");
            userOptions.textContent = Questions[questionNum].options[i];
            userOptions.addEventListener("click", nextQuestion);
        }
    }
}

function questionValidation(event) {
    let userClick = event.target;
    if (userClick.textContent == Questions[questionNum - 1].answer) {
        feedback.textContent = "Correct!";
        feedbackFade();
        return;
    } else {
        feedback.textContent = "Incorrect!";
        time = time - 15000;
        feedbackFade();
    }
}
choiceBox.addEventListener("click", questionValidation);

function scoreSubmit(event) {
    event.preventDefault();
    let savedScore = {
        initial: Initials.value,
        highScore: score,
    };
    scoreArray.push(savedScore);
    localStorage.setItem("highScore", JSON.stringify(scoreArray));
    Initials.value = "";
    scoreRender();
}
form.addEventListener("submit", scoreSubmit);


function scoreRender() {
    title.textContent = "High Scores";
    clearInterval(gameTimer);
    let playAgain = document.createElement("button");
    if (playAgain.childElementCount < 1) {
        playAgain.appendChild(playAgain);
        playAgain.textContent = "Play Again";
    }

    if (localScores.childElementCount <= 0) {
        for (i = 0; i < scoreArray.length; i++) {
            let userScore = document.createElement("li");
            userScore.textContent =
                scoreArray[i].initial +
                " - Score: " +
                scoreArray[i].highScore;
            localScores.appendChild(userScore);
        }
    }
    playAgain.addEventListener("click", function () {
        location.reload();
    });
}
viewScore.addEventListener("click", scoreRender);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}