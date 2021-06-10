class Game {

  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.quizName = document.querySelector('.name');
    this.quizContainer = document.getElementById('quiz');
    this.resultsContainer = document.getElementById('results');
    this.quiz = document.querySelector('.quiz-wrap');
    this.form = document.querySelector('.form');
    this.input = document.querySelector('.input');
    this.time =  document.querySelector('.time');
    this.sum =  document.querySelector('.sum');
    // this.previousButton = document.getElementById("previous");
    this.nextButton = document.getElementById("next");
    this.submitButton = document.getElementById('submit');
    this.restartButton = document.getElementById("restart");
    this.fifty =  document.querySelector('.fifty');
    this.call =  document.querySelector('.call');
    this.audience =  document.querySelector('.audience');
    this.numOfResponses = 4;
    this.player = '';
    this.currentSlide = 0;
    this.questions = [];
    this.sums = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
    this.currentWin = 0;
    this.winningAmount = 0;
    this.timerId = 0;
    this.timerNext = 0;
  }

  getRandomAnswer() {
    return Math.floor(Math.random() * this.numOfResponses)
  };

  getQuestions() {
    fetch(this.url)
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


          let correctNumber = this.getRandomAnswer();
          let temp = questionForm.answers[correctNumber];

          questionForm.answers[correctNumber] = correctAnswer;
          if (temp !== undefined) {
            questionForm.answers[this.numOfResponses - 1] = temp;
          }
          questionForm.correctAnswer = correctNumber.toString();
          this.questions.push(questionForm);
        });

        this.buildQuiz();

        this.setAnswerHandler();
      });
  }

  validation = (event) => {
    let regex = /^[А-яЁёA-z]{2,9}$/;
    this.input.classList.remove('error');

    if(!regex.test(this.input.value)) {
      event.preventDefault();
      this.input.classList.add('error');
      this.error.innerHTML = 'Please enter correct name';
      this.input.parentElement.insertBefore(this.error, this.input);
      this.input.value = '';
    }
    else {
      event.preventDefault();
      this.player = this.input.value;
      this.form.style.display = 'none';
      this.quiz.style.display = 'block';
      this.showSlide(this.currentSlide);
    }
  };

  buildQuiz(){
    // this.nextButton.disabled = true;
    // this.nextButton.style.opacity = '0.8';
    this.error = document.createElement('div');
    this.error.className = 'error-block';
    this.quizName.innerText += `: ${this.name}`;
    const output = [];

    this.questions.forEach(
      (currentQuestion, questionNumber) => {
        const answers = [];

        for(let number in currentQuestion.answers){
          answers.push(
            `<li>
              <label>
                <input type="radio" name="question-${questionNumber}" value="${number}">
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
    // const radioBtns = slides[this.currentSlide].querySelectorAll('INPUT');
    let seconds = 59;

    let idInt = () => {
      if (seconds >= 0) {
       this.time.innerText = seconds;
        seconds--;
      } else {
        // radioBtns.forEach(button => button.setAttribute('disabled', true));
        clearInterval(this.timerId);
        this.showResults();
        if (this.currentSlide === slides.length - 1) {
          this.showResults();
          } else {
            this.showNextSlide();
          }

      }
    };

    this.timerId = setInterval(idInt, 1000);
    //
    this.nextButton.addEventListener('click', function() {
      clearInterval(this.timerId);
    });
    //
    // this.previousButton.addEventListener('click', function() {
    //   clearInterval(timerId);
    // });
  };

  showSlide = (n) => {

    function isCheked(element) {
      return element.checked;
    }

    clearInterval(this.timerNext);
    this.time.innerText = 60;

    const slides = document.querySelectorAll(".slide");
    const radioBtns = slides[this.currentSlide].querySelectorAll('INPUT');

    if (!Array.from(radioBtns).every(isCheked)) {
      this.nextButton.disabled = true;
      this.nextButton.style.opacity = '0.7';
    }


    slides[this.currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    this.currentSlide = n;
    this.currentWin = this.sums[this.currentSlide];
    this.sum.innerText = `Winning amount: ${this.currentWin}`;

    if(this.currentSlide === slides.length - 1) {
      this.nextButton.style.display = 'none';
      } else {
        this.nextButton.style.display = 'inline-block';
      }
    console.log(this.questions[this.currentSlide].correctAnswer);
    this.timer()


  };

  showNextSlide = () => {

    this.showSlide(this.currentSlide + 1);
  };

  getHint = (hint) => {
    let answers = this.questions[this.currentSlide].answers;
    console.log(answers);
    let correctAnswer = this.questions[this.currentSlide].correctAnswer;
    console.log('correctAnswer', correctAnswer);
    // delete answers[correctAnswer];
    // let incorrectAnswer = [];
    // console.log(answers);

    if (hint === 'fifty') {
      let random;

      let num = 0;


      while (num < 2) {
        random = this.getRandomAnswer();
        console.log('random', random)


          console.log('false', random)
          if (random != correctAnswer && random in this.questions[this.currentSlide].answers) {
            // const selector = `input[name=question-${this.currentSlide}][value=${random}]`;
            const selector = `input[name=question-${this.currentSlide}][value='${random}']`;
            document.querySelector(selector).closest('li').remove();
            delete answers[random];
            num++;
            console.log('num', num)
          }



      }

    }

  };

  getHintFifty = () => {
    this.getHint('fifty')
  };

  checkResult = (e) => {
    const tar = e.target;
    function isCheked(element) {
      return element.checked;
    }
    const slides = document.querySelectorAll(".slide");
    const radioBtns = slides[this.currentSlide].querySelectorAll('INPUT');
    if (Array.from(radioBtns).some(isCheked)) {
      this.nextButton.disabled = false;
      this.nextButton.style.opacity = '1';
    }

    if(tar.tagName === 'INPUT') {
      const questionNumber = tar.name.split('-')[1];
      console.log(questionNumber);
      const userAnswer = tar.value;
      const isCorrect = this.questions[questionNumber].correctAnswer === userAnswer;

      if(isCorrect) {
        tar.parentNode.style.color = 'limegreen';
        clearInterval(this.timerId);
        // this.showNextSlide();

        if (this.currentSlide !== this.questions.length - 1) {
          this.timerNext = setTimeout(() => this.showNextSlide(), 5000);
        }

        if (this.currentSlide % 5 === 4) {
          this.winningAmount = this.currentWin
        }
      } else {
        tar.parentNode.style.color = 'orangered';
        this.nextButton.style.disabled = 'none';
        // this.submitButton.style.display = 'inline-block';
        this.time.style.opacity = '0';
        this.nextButton.disabled = true;
        this.nextButton.style.opacity = '0.7';
        setTimeout(() => this.showResults(), 10000);
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
    // const answerContainers = this.quizContainer.querySelectorAll('.answers');
    // let numCorrect = 0;

    // this.questions.forEach((currentQuestion, questionNumber) => {
    //   const answerContainer = answerContainers[questionNumber];
    //   const selector = `input[name=question${questionNumber}]:checked`;
    //   const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    //
    //   if (userAnswer === currentQuestion.correctAnswer) {
    //     numCorrect++;
    //   }
    // });
    this.quiz.style.display = 'none';
    this.resultsContainer.innerHTML = `${this.player}, game over! Your winnings: ${this.winningAmount}`;
    this.restartButton.style.display = 'inline-block';
  };

  restart() {
    document.location.reload();
  }

  addListeners = () => {
    this.form.addEventListener('submit', this.validation);
    this.submitButton.addEventListener('click', this.showResults);
    // this.previousButton.addEventListener("click", this.showPreviousSlide);
    this.nextButton.addEventListener("click", this.showNextSlide);
    this.restartButton.addEventListener("click", this.restart);
    this.fifty.addEventListener("click", this.getHintFifty);
  }
}

let game = new Game('Books', 'https://opentdb.com/api.php?amount=15&category=10&difficulty=easy&type=multiple');
game.getQuestions();
game.addListeners();




//todo: подсказки
//todo: по кнопке "завершить игру" забрать выигранное
