const API_KEY = "AIzaSyA6crBKIIcjw6WbG-jaobiswZXnpxYJ0T4"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

let currentQuestion = 0; // Track the current question number

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
        contents: [{ role: "user", parts: [{ text: `Question ${currentQuestion + 1} for MBBS quiz` }] }]
      }),
    });
    const data = await response.json();
    return data?.candidates[0].content.parts[0].text || "No question available";
  } catch (error) {
    console.error("Error fetching question:", error);
    return "Failed to load question.";
  }
}

// Load and display the next question
async function loadNextQuestion() {
  nextButton.style.display = "none"; // Hide Next button during API call
  currentQuestion++;

  const questionText = await fetchQuestion();
  displayQuestion(questionText);
}

// Display the question and answer options
function displayQuestion(questionText) {
  questionElement.innerText = questionText;
  answerButtonsElement.innerHTML = ""; // Clear previous answer buttons

  const answers = ["Option 1", "Option 2", "Option 3", "Option 4"];
  answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("answer-button");
    button.addEventListener("click", () => selectAnswer(button));
    answerButtonsElement.appendChild(button);
  });
}

// Handle answer selection and display feedback
function selectAnswer(button) {
  const isCorrect = button.innerText === "Option 1"; // Example: Only Option 1 is correct
  button.classList.add(isCorrect ? "correct" : "incorrect");

  Array.from(answerButtonsElement.children).forEach(btn => {
    btn.disabled = true; // Disable all buttons after answering
    if (btn !== button && btn.innerText === "Option 1") {
      btn.classList.add("correct"); // Highlight correct answer
    }
  });

  nextButton.style.display = "block"; // Show Next button after selecting an answer
}
