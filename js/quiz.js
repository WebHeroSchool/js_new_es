class Game {

  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.quizName = document.querySelector('.name');
    this.form = document.querySelector('.form');
    this.input = document.querySelector('.input');
    this.quizContainer = document.querySelector('.game-wrap');
    this.winList =  document.querySelector('.winList');
    this.time =  document.querySelector('.time');
    this.sum =  document.querySelector('.sum');
    this.quiz = document.querySelector('.quiz');
    this.nextButton = document.querySelector(".next");
    this.submitButton = document.querySelector('.submit');
    this.currentWinContainer = document.querySelector('.currentWin');
    this.fifty =  document.querySelector('.fifty');
    this.call =  document.querySelector('.call');
    this.audience =  document.querySelector('.audience');
    this.resultsContainer = document.querySelector('.results');
    this.restartButton = document.querySelector(".restart");
    this.overlay = document.querySelector(".overlay");
    this.modal = document.querySelector(".modal");
    this.modalContent = document.querySelector(".modal-text");
    this.modalButton = document.querySelector(".modal button");
    this.preloaderPhone = document.querySelector(".container-phone");
    this.preloaderCircles = document.querySelector(".container-circles");
    this.numOfResponses = 4;
    this.player = '';
    this.currentSlide = 0;
    this.questions = [];
    this.sums = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
    this.currentWin = 0;
    this.winningAmount = 0;
    this.timerId = 0;
    this.timerNext = 0;
    this.isCorrect = 0;
  }

  getRandomAnswer(num = this.numOfResponses) {
    return Math.floor(Math.random() * num)
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
    } else {
      event.preventDefault();
      this.player = this.input.value;
      this.form.style.display = 'none';
      this.quizContainer.style.display = 'flex';
      this.showSlide(this.currentSlide);
    }
  };

  buildQuiz(){
    this.error = document.createElement('div');
    this.error.className = 'error-block';
    this.quizName.innerText += `: ${this.name}`;
    const output = [];

    this.sums.forEach((item, i) => {
      let winItem = document.createElement('div');
      winItem.innerText = item.toString();
      winItem.classList.add('win');
      if (i % 5 === 4) {
        winItem.classList.add('guaranteed')
      }
      this.winList.appendChild(winItem );
    });

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

    this.quiz.innerHTML = output.join('');
  }

  timer = () => {
    let seconds = 59;

    let idInt = () => {
      if (seconds >= 0) {
       this.time.innerText = `Time left: ${seconds}`;
        seconds--;
      } else {
        clearInterval(this.timerId);
        this.showResults();
      }
    };

    this.timerId = setInterval(idInt, 1000);
    this.nextButton.addEventListener('click', function() {
      clearInterval(this.timerId);
    });
  };

  showSlide = (n) => {
    // function isChecked(element) {
    //   return element.checked;
    // }

    clearInterval(this.timerNext);
    this.time.innerText = `Time left: 60`;

    const slides = document.querySelectorAll(".slide");
    const radioBtns = slides[this.currentSlide].querySelectorAll('INPUT');

    if (!Array.from(radioBtns).every(this.isChecked)) {
      this.nextButton.disabled = true;
      this.nextButton.style.opacity = '0.7';
    }

    slides[this.currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    this.currentSlide = n;
    this.currentWin = this.sums[this.currentSlide];
    this.sum.innerText = `Winning amount: ${this.currentWin}`;
    if (this.currentSlide % 5 === 4) {
      this.sum.innerText = `Winning amount: ${this.currentWin} - guaranteed level`;

    }
    console.log('correctAnswer', this.questions[this.currentSlide].correctAnswer);
    this.timer()
  };

  showNextSlide = () => {
    if (this.currentSlide === this.questions.length - 1) {
      this.showResults();
    } else {
      this.showSlide(this.currentSlide + 1);
    }
  };

  getHint = (hint) => {
    this.overlay.classList.add('active');
    this.modal.classList.add('active');

    let answers = this.questions[this.currentSlide].answers;
    console.log(answers);
    let correctAnswer = this.questions[this.currentSlide].correctAnswer;
    let random;
    let num = 0;

    if (hint === this.fifty) {
      while (num < 2) {
        random = this.getRandomAnswer().toString();
          if (random !== correctAnswer && random in this.questions[this.currentSlide].answers) {
            const selector = `input[name=question-${this.currentSlide}][value='${random}']`;
            document.querySelector(selector).closest('li').remove();
            delete answers[random];
            num++;
          }
      }
    }

    if (hint === this.call) {
      this.preloaderPhone.style.display = 'block';
      random = this.getRandomAnswer(2);
      setTimeout(() => {
        this.preloaderPhone.style.display = 'none';
        this.modalButton.style.display = 'block';
        if (random === 1) {
          this.modalContent.innerText = `Friend's answer: ${this.questions[this.currentSlide].answers[correctAnswer]}`
        } else {
          while (num < 1) {
            random = this.getRandomAnswer().toString();
            if (random !== correctAnswer && answers[random] !== undefined) {
              this.modalContent.innerText = `Friend's answer: ${this.questions[this.currentSlide].answers[random]}`;
              num++;
            }
          }
        }
      }, 3000);

    }

    if (hint === this.audience) {
      this.preloaderCircles.style.display = 'flex';
      setTimeout(() => {
        this.preloaderCircles.style.display = 'none';
        this.modalButton.style.display = 'block';
        while (num < 1) {
          random = this.getRandomAnswer().toString();
          if (answers[random] !== undefined) {
            this.modalContent.innerText = `Audience selection: ${this.questions[this.currentSlide].answers[random]}`;
            num++
          }
        }
      }, 3000);

    }

    // hint.disabled  = true;
    // hint.style.opacity = '0.7';
  };

  getHintFifty = () => {
    this.getHint(this.fifty)
  };

  getHintCall = () => {
    this.getHint(this.call)
  };

  getHintAudience = () => {
    this.getHint(this.audience)
  };

  isChecked(element) {
    return element.checked;
  }

  checkResult = (e) => {
    const tar = e.target;
    const slides = document.querySelectorAll(".slide");
    const radioBtns = slides[this.currentSlide].querySelectorAll('INPUT');



    if (Array.from(radioBtns).some(this.isChecked)) {
      this.nextButton.disabled = false;
      this.nextButton.style.opacity = '1';
    }

    if(tar.tagName === 'INPUT') {
      const questionNumber = tar.name.split('-')[1];
      const userAnswer = tar.value;
      this.isCorrect = this.questions[questionNumber].correctAnswer === userAnswer;

      if(this.isCorrect) {
        tar.parentNode.style.color = 'limegreen';
        clearInterval(this.timerId);

        if (this.currentSlide !== this.questions.length - 1) {
          this.timerNext = setTimeout(() => this.showNextSlide(), 5000);
        }

        if (this.currentSlide % 5 === 4) {
          this.winningAmount = this.currentWin;
          this.currentWinContainer.innerText = `Current win: ${this.currentWin}`;
        }

      } else {
        tar.parentNode.style.color = 'orangered';
        this.nextButton.style.disabled = 'none';
        this.time.style.opacity = '0';
        this.nextButton.style.display = 'none';
        this.submitButton.innerText = 'Finish the game';
        setTimeout(() => this.showResults(), 10000);
      }

      const radioButtons = e.currentTarget.querySelectorAll('.answers input');
      radioButtons.forEach(button => button.setAttribute('disabled', true));
    }
  };

  setAnswerHandler() {
    Array.from(this.quiz.querySelectorAll('.slide .answers')).forEach(answer => {
      answer.addEventListener('click', this.checkResult);
    })
  }

  showResults = () => {
    this.quizContainer.style.display = 'none';
    if (this.isCorrect) {
      this.winningAmount = this.sums[this.currentSlide - 1];
    }
    this.resultsContainer.innerHTML = `${this.player}, game over! Your winnings: ${this.winningAmount}`;
    this.restartButton.style.display = 'inline-block';
  };

  restart() {
    document.location.reload();
  }

  addListeners = () => {
    this.form.addEventListener('submit', this.validation);
    this.submitButton.addEventListener('click', this.showResults);
    this.nextButton.addEventListener("click", this.showNextSlide);
    this.restartButton.addEventListener("click", this.restart);
    this.fifty.addEventListener("click", this.getHintFifty);
    this.call.addEventListener("click", this.getHintCall);
    this.audience.addEventListener("click", this.getHintAudience);
    this.modalButton.addEventListener('click', () => {
      this.overlay.classList.remove('active');
      this.modal.classList.remove('active');
    });
    document.addEventListener('click', (event) => {
      if(
        !event.target.closest('button') &&
        !event.target.closest('.modal')
        // !event.target.closest('.modal button') &&
        // !event.target.closest('.form')
        // !event.target.closest('.burger')
      ) {
        this.overlay.classList.remove('active');
        this.modal.classList.remove('active');
      }
    });
  }
}

let game = new Game('Books', 'https://opentdb.com/api.php?amount=15&category=10&difficulty=easy&type=multiple');
game.getQuestions();
game.addListeners();


//todo: адаптив, стили модалки
