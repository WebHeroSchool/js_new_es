class Game {

  constructor() {
    this.quizContainer = document.getElementById('quiz');
    this.resultsContainer = document.getElementById('results');
    this.quiz = document.querySelector('.quiz-wrap');
    this.form = document.querySelector('.form');
    this.name = document.querySelector('.name');

    this.previousButton = document.getElementById("previous");
    this.nextButton = document.getElementById("next");
    this.submitButton = document.getElementById('submit');
    this.restartButton = document.getElementById("restart");
    this.currentSlide = 0;
    this.questions = [];
  }

  getQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple')
      .then(res => res.json())
      .then(json => {
        json.results.forEach(item => {
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

          this.questions.push(questionForm);
        });

        this.buildQuiz();
        this.showSlide(this.currentSlide);
        this.setAnswerHandler();
      });
  }

  validation = (event) => {
    let regex = /^[А-ЯЁ][а-яё]{1,9}$/;
    this.name.classList.remove('error');

    if(!regex.test(this.name.value)) {
      event.preventDefault();
      this.name.classList.add('error');
      this.error.innerHTML = 'Please enter correct name';
      this.name.parentElement.insertBefore(this.error, this.name);
      this.name.value = '';
    }
    else {
      event.preventDefault();
      this.form.style.display = 'none';
      this.quiz.style.display = 'block';
    }
  };

  buildQuiz(){
    this.error = document.createElement('div');
    this.error.className = 'error-block';
    const output = [];

    this.questions.forEach(
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

    this.quizContainer.innerHTML = output.join('');
  }

  timer = () => {
    const slides = document.querySelectorAll(".slide");
    const radioBtns = slides[this.currentSlide].querySelectorAll('INPUT');
    let seconds = 10;
    let idInt = () => {
      if (seconds >= 0) {
        seconds--;
      } else {
        radioBtns.forEach(button => button.setAttribute('disabled', true));
        clearInterval(timerId);
        if (this.currentSlide === slides.length - 1) {
          this.showResults();
        } else {
          this.showNextSlide();
        }
      }
    };

    let timerId = setInterval(idInt, 1000);

    this.nextButton.addEventListener('click', function() {
      clearInterval(timerId);
    });

    this.previousButton.addEventListener('click', function() {
      clearInterval(timerId);
    });
  };

  showSlide = (n) => {
    const slides = document.querySelectorAll(".slide");

    slides[this.currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    this.currentSlide = n;

    if(this.currentSlide === 0){
      this.previousButton.style.display = 'none';
    }
    else{
      this.previousButton.style.display = 'inline-block';
    }

    if(this.currentSlide === slides.length - 1){
      this.nextButton.style.display = 'none';

      if (!this.resultsContainer.innerHTML) {
        this.submitButton.style.display = 'inline-block';
      }
    } else {
      this.nextButton.style.display = 'inline-block';
      this.submitButton.style.display = 'none';
    }

    this.timer()
  };

  showNextSlide = () => {
    this.showSlide(this.currentSlide + 1);
  };

  showPreviousSlide = () => {
    this.showSlide(this.currentSlide - 1);
  };

  checkResult = (e) => {
    const tar = e.target;

    if(tar.tagName === 'INPUT') {
      const questionNumber = tar.name.slice(-1);
      const userAnswer = tar.value;
      const isCorrect = this.questions[questionNumber].correctAnswer == userAnswer;

      if(isCorrect) {
        tar.parentNode.style.color = 'limegreen';
      } else {
        tar.parentNode.style.color = 'orangered';
      }

      const radioButtons = e.currentTarget.querySelectorAll('.answers input');
      radioButtons.forEach(button => button.setAttribute('disabled', true));
    }
  };

  setAnswerHandler() {
    Array.from(this.quizContainer.querySelectorAll('.slide .answers')).forEach(answer => {
      answer.addEventListener('click', this.checkResult);
    })
  }

  showResults = () => {
    const answerContainers = this.quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;

    this.questions.forEach((currentQuestion, questionNumber) => {
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      if (userAnswer == currentQuestion.correctAnswer) {
        numCorrect++;
      }
    });

    this.resultsContainer.innerHTML = `${numCorrect} out of ${this.questions.length}`;
    this.submitButton.style.display = 'none';
    this.restartButton.style.display = 'inline-block';
  };

  restart() {
    document.location.reload();
  }

  addListeners = () => {
    this.form.addEventListener('submit', this.validation);
    this.submitButton.addEventListener('click', this.showResults);
    this.previousButton.addEventListener("click", this.showPreviousSlide);
    this.nextButton.addEventListener("click", this.showNextSlide);
    this.restartButton.addEventListener("click", this.restart);
  }
}

let game = new Game();
game.getQuestions();
game.addListeners();
