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
let correctAnswer = ""; // Store the correct answer

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
    
    // Sample realistic options for demonstration
    correctAnswer = "B. Arachnoid mater"; // Assume correct answer from the API
    const options = [
      correctAnswer,
      "A. Dura mater",
      "C. Pia mater",
      "D. Subarachnoid space"
    ];
    
    return { questionText, options: shuffleOptions(options) };
  } catch (error) {
    console.error("Error fetching question:", error);
    return { questionText: "Failed to load question.", options: [] };
  }
}

// Shuffle options to randomize the position of the correct answer
function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

// Load and display the next question
async function loadNextQuestion() {
  nextButton.style.display = "none"; // Hide Next button during API call
  currentQuestionIndex++;

  const { questionText, options } = await fetchQuestion();
  displayQuestion({ question: questionText, correct_answer: correctAnswer, incorrect_answers: options.filter(opt => opt !== correctAnswer) });
}

// Display the question and answer options
function displayQuestion(question) {
  // Set question text
  questionElement.innerHTML = question.question;

  // Combine correct and incorrect answers and shuffle them
  const answers = [...question.incorrect_answers, question.correct_answer];
  answerButtonsElement.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  
  // Display answers
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

  // Update question number display
  questionNumber.innerHTML = `Question <span class="current">${currentQuestionIndex}</span>
            <span class="total">/${questions.length}</span>`;

  // Add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        nextButton.disabled = false; // Enable Next button after selection
      }
    });
  });
}

// Handle answer selection and display feedback
function selectAnswer(selectedAnswer) {
  const isCorrect = selectedAnswer === correctAnswer;

  // Add classes for correct/incorrect answers
  document.querySelectorAll(".answer").forEach(answer => {
    if (answer.querySelector(".text").innerText === correctAnswer) {
      answer.classList.add("correct");
    } else if (answer.querySelector(".text").innerText !== selectedAnswer && !isCorrect) {
      answer.classList.add("incorrect");
    }
    answer.classList.add("checked"); // Mark all answers as checked
  });
  
  nextButton.style.display = "block"; // Show Next button after answer selection
}
