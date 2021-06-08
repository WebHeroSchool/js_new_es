

class Quiz {
  constructor() {
    this.quizContainer = document.getElementById('quiz');
    this.resultsContainer = document.getElementById('results');
    this.submitButton = document.getElementById('submit');
    this.quiz = document.querySelector('.quiz-wrap');
    this.form = document.querySelector('.form');
    this.name = document.querySelector('.name');
    this.error = document.createElement('div');
    this.error.className = 'error-block';
    this.previousButton = document.getElementById("previous");
    this.nextButton = document.getElementById("next");
    this.restartButton = document.getElementById("restart");
    this.currentSlide = 0;
    this.questions = [];
  }

  validation(event) {
    let regex = /^[А-ЯЁ][а-яё]{1,9}$/;
    this.name.classList.remove('error');

    if(!regex.test(this.name.value)) {
      event.preventDefault();
      this.name.classList.add('error');
      this.error.innerHTML = 'Please enter correct name';
      this.name.parentElement.insertBefore(this.error, this.name);
    }
    else {
      event.preventDefault();
      this.form.style.display = 'none';
      this.quiz.style.display = 'block';
    }
  }

  buildQuiz(){
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

  showSlide(n) {
    const slides = document.querySelectorAll(".slide");
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    let currentSlide = n;
    if(currentSlide === 0){
      this.previousButton.style.display = 'none';
    }
    else{
      this.previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length - 1){
      this.nextButton.style.display = 'none';
      if (!resultsContainer.innerHTML) {
        submitButton.style.display = 'inline-block';
      }
    }
    else{
      this.nextButton.style.display = 'inline-block';
      this.submitButton.style.display = 'none';
    }
    // timer()
  }

  showNextSlide() {
    showSlide(currentSlide + 1);
  }

  showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  checkResult (e) {
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
  }

  setAnswerHandler() {
    Array.from(this.quizContainer.querySelectorAll('.slide .answers')).forEach(answer => {
      answer.addEventListener('click', checkResult);
    })
  }

  showResults() {
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

    this.resultsContainer.innerHTML = `${numCorrect} out of ${questions.length}`;
    this.submitButton.style.display = 'none';
    this.restartButton.style.display = 'inline-block';
  }

  restart() {
    document.location.reload();
  }
}

async function getQuestions() {
  const response = await fetch('https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple');
  const data = await response.json();
  let quiz = new Quiz;

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

    quiz.questions.push(questionForm);
  });

    quiz.buildQuiz(quiz.questions, quiz.quizContainer);
    quiz.nextButton.addEventListener('click', () => {
      quiz.showNextSlide(this.currentSlide);
    });
  quiz.previousButton.addEventListener('click', () => {
      quiz.showPreviousSlide(this.currentSlide);
    });
}

getQuestions();
//
// fetch('https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple')
//   .then(res => res.json())
//   .then(json => {
//     json.results.forEach(item => {
//       let question = item.question;
//       let correctAnswer = item.correct_answer;
//       let answers = item.incorrect_answers;
//       let questionForm = {};
//       questionForm.question = question;
//       questionForm.answers = {};
//       answers.forEach((currentAnswer, i) => {
//         questionForm.answers[i] = currentAnswer;
//       });
//
//       let correctNumber = Math.floor(Math.random() * 4);
//
//       let temp = questionForm.answers[correctNumber];
//
//       questionForm.answers[correctNumber] = correctAnswer;
//       if (temp !== undefined) {
//         questionForm.answers[4] = temp;
//       }
//
//       questionForm.correctAnswer = correctNumber;
//
//       questions.push(questionForm);
//     });
//
//     buildQuiz();
//     const slides = document.querySelectorAll(".slide");
//
//     function validation(event) {
//       let regex = /^[А-ЯЁ][а-яё]{1,9}$/;
//       name.classList.remove('error');
//
//       if(!regex.test(name.value)) {
//         event.preventDefault();
//         name.classList.add('error');
//         error.innerHTML = 'Please enter correct name';
//         name.parentElement.insertBefore(error, name);
//       }
//       else {
//         event.preventDefault();
//         form.style.display = 'none';
//         quiz.style.display = 'block';
//       }
//     }
//
//     function buildQuiz(){
//       const output = [];
//
//       questions.forEach(
//         (currentQuestion, questionNumber) => {
//           const answers = [];
//
//           for(number in currentQuestion.answers){
//             answers.push(
//               `<li>
//               <label>
//                 <input type="radio" name="question${questionNumber}" value="${number}">
//                   ${currentQuestion.answers[number]}
//               </label>
//              </li>`
//             );
//           }
//
//           output.push(
//             `<div class="slide">
//             <div class="question"> ${currentQuestion.question} </div>
//             <ol class="answers"> ${answers.join("")} </ol>
//           </div>`
//           );
//         }
//       );
//
//       quizContainer.innerHTML = output.join('');
//     }
//
//     function timer() {
//       const slides = document.querySelectorAll(".slide");
//       const radioBtns = slides[currentSlide].querySelectorAll('INPUT');
//       let seconds = 10;
//       let idInt = function() {
//         if (seconds >= 0) {
//           seconds--;
//         } else {
//           radioBtns.forEach(button => button.setAttribute('disabled', true));
//           clearInterval(timerId);
//           if (currentSlide === slides.length - 1) {
//             showResults();
//           } else {
//             showNextSlide();
//           }
//         }
//       };
//       let timerId = setInterval(idInt, 1000);
//
//       nextButton.addEventListener('click', function() {
//         clearInterval(timerId);
//       });
//       previousButton.addEventListener('click', function() {
//         clearInterval(timerId);
//       });
//     }
//
//     function showSlide(n) {
//       const slides = document.querySelectorAll(".slide");
//       slides[currentSlide].classList.remove('active-slide');
//       slides[n].classList.add('active-slide');
//       currentSlide = n;
//       if(currentSlide === 0){
//         previousButton.style.display = 'none';
//       }
//       else{
//         previousButton.style.display = 'inline-block';
//       }
//       if(currentSlide === slides.length - 1){
//         nextButton.style.display = 'none';
//         if (!resultsContainer.innerHTML) {
//           submitButton.style.display = 'inline-block';
//         }
//       }
//       else{
//         nextButton.style.display = 'inline-block';
//         submitButton.style.display = 'none';
//       }
//       timer()
//     }
//
//     function showNextSlide() {
//       showSlide(currentSlide + 1);
//     }
//
//     function showPreviousSlide() {
//       showSlide(currentSlide - 1);
//     }
//
//     function checkResult (e) {
//       const tar = e.target;
//       if(tar.tagName === 'INPUT') {
//         const questionNumber = tar.name.slice(-1);
//         const userAnswer = tar.value;
//         const isCorrect = questions[questionNumber].correctAnswer == userAnswer;
//         if(isCorrect) {
//           tar.parentNode.style.color = 'limegreen';
//         } else {
//           tar.parentNode.style.color = 'orangered';
//         }
//         const radioButtons = e.currentTarget.querySelectorAll('.answers input');
//         radioButtons.forEach(button => button.setAttribute('disabled', true));
//       }
//     }
//
//     function setAnswerHandler() {
//       Array.from(quizContainer.querySelectorAll('.slide .answers')).forEach(answer => {
//         answer.addEventListener('click', checkResult);
//       })
//     }
//
//     function showResults() {
//       const answerContainers = quizContainer.querySelectorAll('.answers');
//       let numCorrect = 0;
//
//       questions.forEach((currentQuestion, questionNumber) => {
//
//         const answerContainer = answerContainers[questionNumber];
//         const selector = `input[name=question${questionNumber}]:checked`;
//         const userAnswer = (answerContainer.querySelector(selector) || {}).value;
//
//
//         if (userAnswer == currentQuestion.correctAnswer) {
//           numCorrect++;
//         }
//       });
//
//       resultsContainer.innerHTML = `${numCorrect} out of ${questions.length}`;
//       submitButton.style.display = 'none';
//       restartButton.style.display = 'inline-block';
//     }
//
//     function restart() {
//       document.location.reload();
//     }
//
//     showSlide(currentSlide);
//     setAnswerHandler();
//
//     form.addEventListener('submit', validation);
//     submitButton.addEventListener('click', showResults);
//     previousButton.addEventListener("click", showPreviousSlide);
//     nextButton.addEventListener("click", showNextSlide);
//     restartButton.addEventListener("click", restart);
//
//   });