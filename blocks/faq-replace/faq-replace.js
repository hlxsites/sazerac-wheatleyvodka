function answerQuestion(event) {
  const allQuestions = document.getElementById('faq-replace-questions-container').childNodes;
  allQuestions.forEach((e) => e.classList.remove('active'));
  allQuestions.forEach((e) => e.classList.add('inactive'));

  const answerContainer = document.getElementById('faq-replace-answer-container');
  answerContainer.innerHTML = '';
  answerContainer.append(event.target.lastElementChild.cloneNode(true));
  event.target.classList.add('active');
  event.target.classList.remove('inactive');
}

/**
 * loads and decorates the faq replace block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const questions = [];
  const answers = [];
  [...block.children].forEach((row, nrOfQuestions) => {
    const question = row.firstElementChild;
    const answer = row.lastElementChild;
    questions[nrOfQuestions] = question;
    answers[nrOfQuestions] = answer;
    row.remove();
  });

  const container = document.querySelector('.faq-replace');
  const questionsContainer = document.createElement('div');
  questionsContainer.id = 'faq-replace-questions-container';
  container.append(questionsContainer);
  const answerContainer = document.createElement('div');
  answerContainer.id = 'faq-replace-answer-container';
  answerContainer.innerHTML = 'no question selected';
  container.append(answerContainer);

  questions.forEach((question, nrOfQuestions) => {
    questionsContainer.appendChild(question);
    question.appendChild(answers[nrOfQuestions]);
    question.addEventListener('click', answerQuestion);
  });
  questions[0].click();
}
