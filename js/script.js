let num;
let score;
console.log('Задание 4.1');
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
];

myQuestions.forEach(item => {
    console.log(item.answers[item.correctAnswer])
});

console.log('Задание 4.2');

myQuestions.push({
    question: "Which tool can you use to ensure code quality?",
    answers: {
      a: "Angular",
      b: "jQuery",
      c: "RequireJS",
      d: "ESLint"
    },
    correctAnswer: "d"
  });
myQuestions.reverse();
console.log(myQuestions);
myQuestions.forEach(item => {
    if (item.correctAnswer === 'c') {
        console.log(item.answers[item.correctAnswer])
    }
});

console.log('Задание 4.3');

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

// console.log('Задание 1; a = 1');
//
// let a = 1;
//
// if (a === 0) {
//     console.log('Верно');
// } else {
//     console.log('Неверно');
// }
//
// console.log('Задание 1; a = 0');
//
// a = 0;
//
// if (a === 0) {
//     console.log('Верно');
// } else {
//     console.log('Неверно');
// }
//
// console.log('Задание 1; a = -3');
//
// a = -3;
//
// if (a === 0) {
//     console.log('Верно');
// } else {
//     console.log('Неверно');
// }
//
// console.log('Задание 2');
//
// for (let i = 1; i <= 20; i++) {
//     if (i % 2 === 0) {
//         console.log(i, 'Переменная четная');
//     } else {
//         console.log(i, 'Переменная нечетная');
//     }
// }
