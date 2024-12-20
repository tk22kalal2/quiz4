const API_KEY = "AIzaSyA6crBKIIcjw6WbG-jaobiswZXnpxYJ0T4"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

let currentQuestion = 0; // Track the current question number
let correctAnswer = "";  // Store the correct answer

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
    const questionText = data?.candidates[0].content.parts[0].text || "No question available";

    // Sample options for demonstration
    correctAnswer = "Red"; // Set correct answer internally
    const options = [
      "Red",
      "Yellow",
      "Green",
      "Orange"
    ];
    
    return { questionText, options };
  } catch (error) {
    console.error("Error fetching question:", error);
    return { questionText: "Failed to load question.", options: [] };
  }
}

// Load and display the next question
async function loadNextQuestion() {
  nextButton.style.display = "none"; // Hide Next button during API call
  currentQuestion++;

  const { questionText, options } = await fetchQuestion();
  displayQuestion(questionText, options);
}

// Display the question and answer options as buttons
function displayQuestion(questionText, options) {
  questionElement.innerText = questionText;
  answerButtonsElement.innerHTML = ""; // Clear previous answer buttons

  options.forEach(optionText => {
    const button = document.createElement("button");
    button.innerText = optionText;
    button.classList.add("answer-button");
    button.addEventListener("click", () => selectAnswer(button, optionText));
    answerButtonsElement.appendChild(button);
  });
}

// Handle answer selection and display feedback
function selectAnswer(button, selectedAnswer) {
  const isCorrect = selectedAnswer === correctAnswer; // Check if the selected answer is correct
  button.classList.add(isCorrect ? "correct" : "incorrect");

  // Highlight correct answer in green and disable all buttons
  Array.from(answerButtonsElement.children).forEach(btn => {
    btn.disabled = true; // Disable all buttons after answering
    if (btn.innerText === correctAnswer) {
      btn.classList.add("correct"); // Highlight the correct answer
    } else if (btn !== button && !isCorrect) {
      btn.classList.add("incorrect"); // Highlight incorrect answers if user chose wrong
    }
  });

  nextButton.style.display = "block"; // Show Next button after selecting an answer
}
