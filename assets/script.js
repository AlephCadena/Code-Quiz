const viewScore = document.querySelector("#view-score");
const timer = document.querySelector("#timer");
const quizBox = document.querySelector("#quiz-box");
const title = document.querySelector("#title");
const hint = document.querySelector("#question");
const startGameButton = document.getElementById("start-game");
const choiceBox = document.querySelector("#choice-box");
const form = document.querySelector("form");
const formInitials = document.getElementById("name");
const feedback = document.querySelector("#feedback");
const playAgainButton = document.getElementById("play-again");
const localScores = document.getElementById("local-scores");

let userChoice;
let questNumber = -1;
let time = 120000;
let score;
let tryAgainStatus = false;
if (JSON.parse(localStorage.getItem("highScore")) == null) {
    var scoreArray = [];
} else
    var scoreArray = [].concat(JSON.parse(localStorage.getItem("highScore")));
const quizQuestions = [
    {
        question:
            "This is a named reference to any value in javascript; It is a container for data",
        options: ["a: variable", "b: querySelector()", "c: function"],
        answer: "a: variable",
    },
    {
        question:
            "A ________ is a set of statements which performs a task or calculates a value",
        options: ["a: keydown", "b: iteration", "c: function"],
        answer: "c: function",
    },
    {
        question:
            "This method returns the first element within the HTML document which matches the specified selector",
        options: ["a: slice()", "b: querySelector()", "c: concat()"],
        answer: "b: querySelector()",
    },
    {
        question:
            "____ is a concept which helps us manage the visibilty of variables in a javascript file",
        options: ["a: scope", "b: global", "c: constant"],
        answer: "a: scope",
    },
    {
        question:
            "A data representation of the objects which make up the content of an HTML document",
        options: [
            "a: Document Object Model (DOM)",
            "b: local storage",
            "c: function",
        ],
        answer: "a: Document Object Model (DOM)",
    },
    {
        question:
            "This class is used to store keyed data and complex entities in javascript",
        options: ["a: constant", "b: variable", "c: object"],
        answer: "c: object",
    },
];

shuffleArray(quizQuestions);
startGameButton.addEventListener("click", startGame);
viewScore.addEventListener("click", scoreRender);
choiceBox.addEventListener("click", questionValidation);
form.addEventListener("submit", scoreSubmit);
function hide(target) {
    target.className = "hidden";
}

function show(target) {
    target.className = "visible";
}

function startGame() {
    hide(title);
    hide(startGameButton);
    gameTimer();
    nextQuestion();
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
                "Sorry, you ran out of time! Do you want to play again?"
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

function feedbackFade() {
    setInterval(function () {
        hide(feedback);
    }, 1500);
}

function nextQuestion() {
    if (choiceBox.childElementCount > 0) {
        choiceBox.innerHTML = "";
    }

    if (questNumber + 1 === quizQuestions.length) {
        score = time / 1000;
        choiceBox.innerHTML = "";
        show(title);
        title.textContent = "All Done!";
        hint.textContent =
            "You have finished taking the quiz and have a score of " + score;
        show(form);
        tryAgainStatus = true;
    }
    questNumber++;
    show(feedback);
    if (questNumber <= quizQuestions.length - 1) {
        for (let i = 0; i < quizQuestions[questNumber].options.length; i++) {
            hint.textContent = quizQuestions[questNumber].question;
            let userChoices = document.createElement("button");
            choiceBox.appendChild(userChoices);
            userChoices.setAttribute("id", "choice");
            userChoices.textContent = quizQuestions[questNumber].options[i];
            userChoices.addEventListener("click", nextQuestion);
        }
    }
}

function questionValidation(event) {
    let userClick = event.target;
    if (userClick.textContent == quizQuestions[questNumber - 1].answer) {
        feedback.textContent = "Correct!";
        feedbackFade();
        return;
    } else {
        feedback.textContent = "Incorrect!";
        time = time - 15000;
        feedbackFade();
    }
}

function scoreSubmit(event) {
    event.preventDefault();
    let savedScore = {
        initial: formInitials.value,
        highScore: score,
    };
    scoreArray.push(savedScore);
    localStorage.setItem("highScore", JSON.stringify(scoreArray));
    formInitials.value = "";
    scoreRender();
}

function scoreRender() {
    title.textContent = "High Scores";
    clearInterval(gameTimer);
    let playAgain = document.createElement("button");
    if (playAgainButton.childElementCount < 1) {
        playAgainButton.appendChild(playAgain);
        playAgain.textContent = "Play Again";
    }
    hide(hint);
    hide(form);
    hide(startGameButton);
    hide(choiceBox);
    show(localScores);
    show(title)
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}