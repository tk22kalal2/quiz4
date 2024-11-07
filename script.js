const API_KEY = "AIzaSyA6crBKIIcjw6WbG-jaobiswZXnpxYJ0T4";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const questionContainer = document.getElementById("question-container");
const questionElement = document.querySelector(".question");
const answerButtonsElement = document.querySelector(".answer-wrapper");
const questionNumber = document.querySelector(".number");

let currentQuestionIndex = 0;
let score = 0;

// Initialize quiz on start button click
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", loadNextQuestion);

// Start the quiz and load the first question
function startQuiz() {
    startButton.style.display = "none";
    questionContainer.style.display = "block";
    loadNextQuestion();
}

// Fetch a new question and options from Gemini API
async function fetchQuestion() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Provide a NEET PG style multiple-choice question with four answer options." }] }]
            }),
        });
        const data = await response.json();
        const questionContent = data.candidates[0].content.parts[0].text.split("\n");

        const questionText = questionContent[0]; // The question
        const options = questionContent.slice(1); // Four options

        return { questionText, options };
    } catch (error) {
        console.error("Error fetching question:", error);
        return { questionText: "Failed to load question.", options: [] };
    }
}

// Load and display the next question
async function loadNextQuestion() {
    nextButton.style.display = "none"; // Hide Next button during API call
    currentQuestionIndex++;

    const { questionText, options } = await fetchQuestion();
    if (options.length === 4) {
        displayQuestion({ question: questionText, options });
    } else {
        console.error("Invalid question format received from API.");
    }
}

// Display the question and options
function displayQuestion({ question, options }) {
    questionElement.innerHTML = question;

    // Shuffle and display options as answer buttons
    answerButtonsElement.innerHTML = "";
    options.sort(() => Math.random() - 0.5);

    options.forEach((optionText) => {
        const answerButton = document.createElement("div");
        answerButton.classList.add("answer");
        answerButton.innerHTML = `
            <span class="text">${optionText}</span>
            <span class="checkbox"><i class="fas fa-check"></i></span>
        `;
        answerButtonsElement.appendChild(answerButton);

        answerButton.addEventListener("click", () => checkAnswer(answerButton, optionText, options));
    });

    questionNumber.innerHTML = `Question <span class="current">${currentQuestionIndex}</span>`;
}

// Check the selected answer and update the score
function checkAnswer(selectedAnswer, answerText, options) {
    const correctAnswer = options.find(option => option.startsWith("B")); // Assuming "B." denotes the correct answer
    const allAnswers = document.querySelectorAll(".answer");

    // Mark answers as correct or incorrect
    if (answerText === correctAnswer) {
        score++;
        selectedAnswer.classList.add("correct"); // Mark selected correct answer as green
    } else {
        selectedAnswer.classList.add("wrong"); // Mark selected wrong answer as red

        // Highlight the correct answer
        allAnswers.forEach((answer) => {
            if (answer.querySelector(".text").innerHTML === correctAnswer) {
                answer.classList.add("correct");
            }
        });
    }

    // Disable all answer buttons after selection
    allAnswers.forEach((answer) => answer.classList.add("checked"));
    nextButton.style.display = "block"; // Show Next button to proceed
}
