const API_KEY = "AIzaSyA6crBKIIcjw6WbG-jaobiswZXnpxYJ0T4"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const questionContainer = document.getElementById("question-container");
const questionElement = document.querySelector(".question");
const answerButtonsElement = document.querySelector(".answer-wrapper");
const questionNumber = document.querySelector(".number");

let currentQuestionIndex = 0;
let questions = []; // Array to store fetched questions
let score = 0; // Track score

// Initialize quiz on start button click
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", loadNextQuestion);

// Start the quiz and load the first question
function startQuiz() {
  startButton.style.display = "none";
  questionContainer.style.display = "block";
  loadNextQuestion();
}

// Fetch a new question from Gemini API
async function fetchQuestion() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `Question For NEET PG` }] }]
      }),
    });
    const data = await response.json();
    const questionText = data?.candidates[0].content.parts[0].text || "No question available";
    
    const options = ["A. Dura mater", "B. Arachnoid mater", "C. Pia mater", "D. Subarachnoid space"];
    
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
  displayQuestion({ question: questionText, correct_answer: "B. Arachnoid mater", incorrect_answers: options.filter(opt => opt !== "B. Arachnoid mater") });
}

// Display the question and answer options
function displayQuestion(question) {
  questionElement.innerHTML = question.question;

  // Combine correct and incorrect answers and shuffle them
  const answers = [...question.incorrect_answers, question.correct_answer];
  answerButtonsElement.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer) => {
    answerButtonsElement.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>
    `;
  });

  questionNumber.innerHTML = `Question <span class="current">${currentQuestionIndex}</span>`;

  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => answer.classList.remove("selected"));
        answer.classList.add("selected");
        nextButton.disabled = false; // Enable Next button after selection
      }
    });
  });
}

// Check the selected answer and update the score
const checkAnswer = () => {
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestionIndex - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestionIndex - 1].correct_answer) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === questions[currentQuestionIndex - 1].correct_answer) {
        answer.classList.add("correct");
      }
    });
  }

  document.querySelectorAll(".answer").forEach(answer => answer.classList.add("checked"));
  nextButton.style.display = "block"; // Show Next button to proceed
};
