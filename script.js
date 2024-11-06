
const quizContainer = document.querySelector(".quiz-container");
const questionElement = document.querySelector("#question");
const answerButtonsElement = document.querySelector("#answer-buttons");
const nextButton = document.querySelector("#next-button");
let currentQuestionIndex = 0;
let isFetching = false;

// Define your API URL and Key here
const API_KEY = "AIzaSyA6crBKIIcjw6WbG-jaobiswZXnpxYJ0T4";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Fetch a question from the API
const fetchQuestion = async () => {
  isFetching = true;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Generate an MBBS quiz question" }] }],
      }),
    });
    const data = await response.json();
    if (response.ok && data.candidates) {
      const questionText = data.candidates[0].content.parts[0].text;
      displayQuestion(questionText);
    } else {
      throw new Error("Could not fetch question.");
    }
  } catch (error) {
    console.error("Error fetching question:", error);
  } finally {
    isFetching = false;
  }
};

// Display the question and possible answers
const displayQuestion = (questionText) => {
  questionElement.innerText = questionText;
  answerButtonsElement.innerHTML = ""; // Clear previous answers

  // Dummy answers; replace this with actual API response if it includes answers
  const answers = ["Answer 1", "Answer 2", "Answer 3", "Answer 4"];
  answers.forEach(answerText => {
    const button = document.createElement("button");
    button.innerText = answerText;
    button.classList.add("answer-button");
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
};

// Handle answer selection and feedback
const selectAnswer = (e) => {
  const selectedButton = e.target;
  // You might use an API call to verify answer correctness or set logic here
  const isCorrect = selectedButton.innerText === "Answer 1"; // Example check
  selectedButton.classList.add(isCorrect ? "correct" : "incorrect");
  
  // Disable all answer buttons after a selection
  Array.from(answerButtonsElement.children).forEach(button => button.disabled = true);
  
  nextButton.style.display = "block"; // Show the 'Next' button after an answer is selected
};

// Load the next question
const loadNextQuestion = () => {
  nextButton.style.display = "none"; // Hide next button
  Array.from(answerButtonsElement.children).forEach(button => button.classList.remove("correct", "incorrect"));
  fetchQuestion(); // Fetch a new question
};

// Event listeners
nextButton.addEventListener("click", loadNextQuestion);
window.addEventListener("load", fetchQuestion); // Load the first question on page load
