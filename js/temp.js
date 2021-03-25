const  question = document.getElementById('question');
const q = ['question1', 'question2', 'question3', 'question4'];

function buildQuiz(q) {
    // for (let i = 0; i < q.length; i++) {
    //     console.log(q[i])
    // }
    question.innerHTML = q.join('  ');
    //question.style.color = 'white'
}

buildQuiz(q);

const showResults = () => {
    const answerContainers = quizContainer.querySelectorAll('.answwers');
    let numCorrect = 0;
}