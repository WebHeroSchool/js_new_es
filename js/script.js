let num;

const questions = [
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
    },
    {
        question: "Some question",
        answers: {
            a: "answer1",
            b: "answer2",
            c: "answer3",
            d: "answer4"
        },
        correctAnswer: "a"
    },
];

let answers = ['c', 'c', 'd', 'b'];

// const checkAnswers = function (answersArr, questionArr) {
//     for (let i = 0; i < questionArr.length; i++) {
//         console.log(`Вопрос ${i+1} ${questionArr[i].question}`);
//         if (answersArr[i] === questionArr[i].correctAnswer) {
//             console.log(`${answersArr[i]}: ${questionArr[i].answers[answersArr[i]]} - ответ верный`)
//         } else {
//             console.error(`${answersArr[i]}: ${questionArr[i].answers[answersArr[i]]} - ответ неверный`);
//             console.log(`верный ответ ${questionArr[i].correctAnswer}: ${questionArr[i].answers[questionArr[i].correctAnswer]}`)
//         }
//     }
// };

//checkAnswers(answers, questions);

const next = document.querySelector('.next');
const prev = document.querySelector('.previous');
const slide = document.createElement('div');
document.body.appendChild(slide);
slide.innerHTML = 1;

const results = document.createElement('div');
document.body.appendChild(results);

const showResults = (answersArr, questionArr) => {
    let score = 0; //счетчик для верных ответов
    for (let i = 0; i < questionArr.length; i++) {
        if (answersArr[i] === questionArr[i].correctAnswer) {
            score++
        }
    }
    return results.innerHTML = `Количество правильных ответов: ${score}`;
};
showResults(answers, questions);

const showNextSlide = (qualifiedName, value) => {
    prev.disabled = false;
    slide.innerHTML++;
    if (slide.innerHTML >= questions.length) {
        next.disabled = true;
    }
};

const showPrevSlide = (qualifiedName, value) => {
    next.disabled = false;
    slide.innerHTML--;
    if (slide.innerHTML <= 1) {
        prev.setAttribute('disabled', 'disabled');
    }
};

next.addEventListener('click', showNextSlide);
prev.addEventListener('click', showPrevSlide);

