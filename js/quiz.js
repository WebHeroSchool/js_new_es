const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
let quiz = document.querySelector('.quiz-wrap');
let form = document.querySelector('.form');
let name = document.querySelector('.name');
let error = document.createElement('div');
error.className = 'error-block';
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const restartButton = document.getElementById("restart");
let currentSlide = 0;


const myQuestions = [
  {
    question: "Who invented JavaScript?",
    answers: {
      a: "Douglas Crockford",
      b: "Sheryl Sandberg",
      c: "Brendan Eich"
    },
    correctAnswer: "c"
  },
  {
    question: "Which one of these is a JavaScript package manager?",
    answers: {
      a: "Node.js",
      b: "TypeScript",
      c: "npm"
    },
    correctAnswer: "c"
  },
  {
    question: "Which tool can you use to ensure code quality?",
    answers: {
      a: "Angular",
      b: "jQuery",
      c: "RequireJS",
      d: "ESLint"
    },
    correctAnswer: "d"
  }
];

buildQuiz();
const slides = document.querySelectorAll(".slide");

function validation(event) {
  let regex = /^[А-ЯЁ][а-яё]{1,9}$/;
  name.classList.remove('error');

  if(!regex.test(name.value)) {
    event.preventDefault();
    name.classList.add('error');
    error.innerHTML = 'Please enter correct name';
    name.parentElement.insertBefore(error, name);
  }
  else {
    event.preventDefault();
    form.style.display = 'none';
    quiz.style.display = 'block';
  }
}

function buildQuiz(){
  const output = [];

  myQuestions.forEach(
    (currentQuestion, questionNumber) => {
      const answers = [];

      for(letter in currentQuestion.answers){
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
              ${letter} :
              ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      output.push(
        `<div class="slide">
          <div class="question"> ${currentQuestion.question} </div>
          <div class="answers"> ${answers.join("")} </div>
        </div>`
      );
    }
  );

  quizContainer.innerHTML = output.join('');
}



function timer() {
  const radioBtns = slides[currentSlide].querySelectorAll('INPUT');
  let seconds = 10;
  let idInt = function() {
    if (seconds >= 0) {
      seconds--;
    } else {
      radioBtns.forEach(button => button.setAttribute('disabled', true));
      clearInterval(timerId);
      if (currentSlide === slides.length - 1) {
        showResults();
        // return;
      } else {
        showNextSlide();
      }
    }
  };
  let timerId = setInterval(idInt, 1000);

  nextButton.addEventListener('click', function() {
    clearInterval(timerId);
  });
  previousButton.addEventListener('click', function() {
    clearInterval(timerId);
  });
}

function showSlide(n) {

  slides[currentSlide].classList.remove('active-slide');
  slides[n].classList.add('active-slide');
  currentSlide = n;
  if(currentSlide === 0){
    previousButton.style.display = 'none';
  }
  else{
    previousButton.style.display = 'inline-block';
  }
  if(currentSlide === slides.length - 1){
    nextButton.style.display = 'none';
    if (!resultsContainer.innerHTML) {
      submitButton.style.display = 'inline-block';
    }
  }
  else{
    nextButton.style.display = 'inline-block';
    submitButton.style.display = 'none';
  }
  timer()
}

function showNextSlide() {
  showSlide(currentSlide + 1);
}

function showPreviousSlide() {
  showSlide(currentSlide - 1);
}

function checkResult (e) {
  const tar = e.target;
  if(tar.tagName === 'INPUT') {
    const questionNumber = tar.name.slice(-1);
    const userAnswer = tar.value;
    const isCorrect = myQuestions[questionNumber].correctAnswer === userAnswer;
    if(isCorrect) {
      tar.parentNode.style.color = 'limegreen';
    } else {
      tar.parentNode.style.color = 'orangered';
    }
    const radioButtons = e.currentTarget.querySelectorAll('.answers input');
    radioButtons.forEach(button => button.setAttribute('disabled', true));
  }
}

function setAnswerHandler() {
  Array.from(quizContainer.querySelectorAll('.slide .answers')).forEach(answer => {
    answer.addEventListener('click', checkResult);
  })
}

function showResults() {
  const answerContainers = quizContainer.querySelectorAll('.answers');
  let numCorrect = 0;

  myQuestions.forEach((currentQuestion, questionNumber) => {

    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    if (userAnswer === currentQuestion.correctAnswer) {
      numCorrect++;
    }
  });

  resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  submitButton.style.display = 'none';
  restartButton.style.display = 'inline-block';
}

function restart() {
  document.location.reload();
}

showSlide(currentSlide);
setAnswerHandler();

form.addEventListener('submit', validation);
submitButton.addEventListener('click', showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
restartButton.addEventListener("click", restart);

