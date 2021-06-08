// const quizWrap = document.querySelector('.quiz-wrap');
// const form = document.querySelector('.form');
// let error = document.createElement('div');
// error.className = 'error-block';
//
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
let quizWrap = document.querySelector('.quiz-wrap');
let form = document.querySelector('.form');
let name = document.querySelector('.name');
let error = document.createElement('div');
error.className = 'error-block';
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const restartButton = document.getElementById("restart");
let currentSlide = 0;
let questions = [];
let slides;

class Quiz {
  // constructor() {
  //   this.quizContainer = document.getElementById('quiz');
  //   this.resultsContainer = document.getElementById('results');
  //   this.submitButton = document.getElementById('submit');
  //   // this.quizWrap = document.querySelector('.quiz-wrap');
  //   // this.form = document.querySelector('.form');
  //   this.name = document.querySelector('.name');
  //   // this.error = document.createElement('div');
  //   // this.error.className = 'error-block';
  //   this.previousButton = document.getElementById("previous");
  //   this.nextButton = document.getElementById("next");
  //   this.restartButton = document.getElementById("restart");
  //   this.currentSlide = 0;
  //   this.questions = [];
  // }

  validation(event) {
    console.log(error);
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
      quizWrap.style.display = 'block';
    }
  }

  buildQuiz(){
    const output = [];

    questions.forEach(
      (currentQuestion, questionNumber) => {
        const answers = [];

        for(let number in currentQuestion.answers){
          answers.push(
            `<li>
              <label>
                <input type="radio" name="question${questionNumber}" value="${number}">
                  ${currentQuestion.answers[number]}
              </label>
             </li>`
          );
        }

        output.push(
          `<div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <ol class="answers"> ${answers.join("")} </ol>
          </div>`
        );
      }
    );

    quizContainer.innerHTML = output.join('');
    slides = document.querySelectorAll(".slide");
    console.log(slides);
  }

  showSlide(n) {
    console.log(slides);
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
    this.setAnswerHandlers();
    // timer()
  }

  showNextSlide() {
    this.showSlide(currentSlide + 1);
  }

  showPreviousSlide() {
    this.showSlide(currentSlide - 1);
  }

  checkResult (e) {
    const tar = e.target;
    if(tar.tagName === 'INPUT') {
      const questionNumber = tar.name.slice(-1);
      const userAnswer = tar.value;
      const isCorrect = questions[questionNumber].correctAnswer == userAnswer;
      if(isCorrect) {
        tar.parentNode.style.color = 'limegreen';
      } else {
        tar.parentNode.style.color = 'orangered';
      }
      const radioButtons = e.currentTarget.querySelectorAll('.answers input');
      radioButtons.forEach(button => button.setAttribute('disabled', true));
    }
  }

  setAnswerHandler() {
    Array.from(quizContainer.querySelectorAll('.slide .answers')).forEach(answer => {
      answer.addEventListener('click', this.checkResult);
    })
  }

  showResults() {
    const answerContainers = quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;

    questions.forEach((currentQuestion, questionNumber) => {

      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;


      if (userAnswer == currentQuestion.correctAnswer) {
        numCorrect++;
      }
    });

    resultsContainer.innerHTML = `${numCorrect} out of ${questions.length}`;
    submitButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
  }

  restart() {
    document.location.reload();
  }
}

async function getQuestions() {
  const response = await fetch('https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple');
  const data = await response.json();
  let quiz = new Quiz;

  // console.log( quiz.showSlide());

  data.results.forEach(item => {
    let question = item.question;
    let correctAnswer = item.correct_answer;
    let answers = item.incorrect_answers;
    let questionForm = {};
    questionForm.question = question;
    questionForm.answers = {};
    answers.forEach((currentAnswer, i) => {
      questionForm.answers[i] = currentAnswer;
    });


    let correctNumber = Math.floor(Math.random() * 4);

    let temp = questionForm.answers[correctNumber];

    questionForm.answers[correctNumber] = correctAnswer;
    if (temp !== undefined) {
      questionForm.answers[4] = temp;
    }

    questionForm.correctAnswer = correctNumber;

    questions.push(questionForm);
  });
  console.log(questions);

  //   // quiz.buildQuiz(quiz.questions, quiz.quizContainer);
  //   quiz.buildQuiz();
  //   quiz.nextButton.addEventListener('click', () => {
  //     quiz.showNextSlide(this.currentSlide);
  //   });
  // quiz.previousButton.addEventListener('click', () => {
  //     quiz.showPreviousSlide(this.currentSlide);
  //   });
  quiz.buildQuiz();
  form.addEventListener('submit', quiz.validation);
  submitButton.addEventListener('click', quiz.showResults);
  previousButton.addEventListener("click", quiz.showPreviousSlide);
  nextButton.addEventListener("click", quiz.showNextSlide);
  restartButton.addEventListener("click", quiz.restart);
}

getQuestions();