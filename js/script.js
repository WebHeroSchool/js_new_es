let quizContainer = document.querySelector('.quiz');
let resultsContainer = document.querySelector('.results');
let submitButton = document.querySelector('.button_results');
let numCorrect = 0;
let nameForm = document.querySelector('.form');
let sendButton = document.querySelector('.send-button');
let userName = document.querySelector('.user-name');
let buttonsNav = document.querySelector('.wrap-btn');
const previousButton = document.querySelector('.button_previous');
const nextButton = document.querySelector('.button_next');
let slides;
let currentSlide = 0;
let validate = null;
let questions;

class Quiz {

    buildQuiz(items, node) {
        const output = [];
        items.forEach(
          (currentQuestion, questionNumber) => {
              let answersArray = [].concat(currentQuestion.correct_answer, currentQuestion.incorrect_answers);
              let answersMarkup = [];
              answersArray.sort(() => Math.random() - 0.5);

              for (let item in answersArray) {
                  answersMarkup.push(
                    `<label>
                <input type='radio' name='question${questionNumber}' value='${answersArray[item]}'>
                  ${answersArray[item]}
                </label>`
                  );
              }

              output.push(
                `<div class='slide'>
                <div class='question'> ${currentQuestion.question} </div>
                <div class='answers'> ${answersMarkup.join(' ')} </div>
              </div>`
              );
          }
        );
        node.innerHTML = output.join('');
        slides = document.querySelectorAll('.slide');
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.validateName();
            if (validate) {
                this.startGame();
            }
        });
    }

    validateName() {
        let regex = /^([А-Я]{1}[а-я]{1,9}|[A-Z]{1}[a-z]{1,9})$/;
        userName.classList.remove('error');

        if (!regex.test(userName.value)) {
            userName.classList.add('error');
            let error = document.createElement('div');
            error.className = 'error-block';
            error.style.color = 'red';
            error.innerHTML = 'Укажите корректное имя';
            userName.parentElement.insertBefore(error, userName);
            validate = false;
        } else {
            validate = true;
        }
    }

    startGame() {
        nameForm.style.opacity = '0';
        quizContainer.style.display = 'inline-block';
        buttonsNav.style.display = 'flex';
        this.showSlide(currentSlide);
    }

    showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
        console.log('currentSlide = ' + currentSlide);

        if(currentSlide === 0) {
            previousButton.style.display = 'none';
        } else{
            previousButton.style.display = 'block';
        }

        if(currentSlide === slides.length-1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else{
            nextButton.style.display = 'block';
            submitButton.style.display = 'none';
        }

        submitButton.addEventListener('click', this.showResults);

        this.timer();
        this.setAnswerHandlers();
    }

    timer() {
        let minutes = 0;
        let seconds = 10;
        let self = this;

        let idInt = function () {
            if (seconds >= 0) {
                document.querySelector('.time').innerHTML = makeMeTwoDigits(minutes) + ":" + makeMeTwoDigits(seconds);
                seconds--;
            } else {
                slides[currentSlide].classList.add('done');
                console.log(currentSlide);
                clearInterval(timerId);
                console.log(currentSlide === slides.length - 1);
                if (currentSlide === slides.length - 1) {
                    self.showResults();
                    return;
                } else {

                    self.showNextSlide(currentSlide);
                }
            }
        };
        let timerId = setInterval(idInt, 1000);

        function makeMeTwoDigits(n) {
            return (n < 10 ? "0" : "") + n;
        }

        nextButton.addEventListener('click', function() {
              clearInterval(timerId);
          }
        );
        previousButton.addEventListener('click', function() {
              clearInterval(timerId);
          }
        );
    }

    showNextSlide(n) {
        console.log('переключили вперед');
        if (n < slides.length - 1) {
            this.showSlide(n + 1);
        }
    }

    showPreviousSlide(n) {
        console.log('переключили назад');
        if (n > 0) {
            this.showSlide(n - 1);
        }
    }

    checkResults(e) {
        const tar = e.target;
        if(tar.tagName === 'INPUT') {
            const questionNumber = tar.name.slice(-1);
            const userAnswer = tar.value;
            const isCorrect = questions[questionNumber].correct_answer === userAnswer;
            if(isCorrect) {
                tar.parentNode.style.color = 'green';
                numCorrect++;
            } else {
                tar.parentNode.style.color = 'red';
            }
            const radioButtons = e.currentTarget.querySelectorAll('.answer, input');
            radioButtons.forEach(button => button.setAttribute('disabled', 'disable'));
        }
    }

    setAnswerHandlers() {
        Array.from(quizContainer.querySelectorAll('.slide .answers')).forEach(answer => {
            answer.addEventListener('click', this.checkResults);
        })
    }

    showResults() {
        document.querySelector('.time').style.display = 'none';
        quizContainer.style.display = 'none';
        previousButton.style.display = 'none';
        nextButton.style.display = 'none';
        submitButton.style.display = 'none';
        resultsContainer.innerHTML = `${userName.value}, your result is ${numCorrect} of ${questions.length}`
        let restart = document.querySelector('.button_restart');
        restart.style.display = 'block';
        restart.addEventListener('click', function() {
            document.location.reload();
        });
    }
}

async function getQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=4&category=22&difficulty=easy&type=multiple');
    const data = await response.json();
    let quiz = new Quiz;

    questions = data.results;

    quiz.buildQuiz(questions, quizContainer);
    nextButton.addEventListener('click', () => {
        quiz.showNextSlide(currentSlide);
    });
    previousButton.addEventListener('click', () => {
        quiz.showPreviousSlide(currentSlide);
    });

}

getQuestions();

// 1. Добавляем данные вопросов.
// 2. Рисуем разметку слайдов.
// 3. Показываем первый слайд.
// 4. По нажатию на кнопки показываем либо предыдущий, либо следующий слайд.
// 5. Переключаем слайды по таймеру.
// 6. По нажатию на кнопки обнуляем таймер.
// 7. Проверяем правильность ответов.
// 8. Считаем правильные ответы и в конце выводим их количество.
// 9. По кнопке обнуляем игру.
// 10. Перед игрой спрашиваем имя игрока.
// https://opentdb.com/api.php?amount=4&category=22&difficulty=easy&type=multiple