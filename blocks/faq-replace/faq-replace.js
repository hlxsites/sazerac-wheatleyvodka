/**
 * shows the answer to a question
 * @param event the onclick event
 */
function answerQuestion(event) {
  // mark all questions as inactive, by removing any active ones and reapply inactive
  const allQuestions = document.getElementById('faq-replace-questions-container').childNodes;
  allQuestions.forEach((e) => e.classList.remove('active'));
  allQuestions.forEach((e) => e.classList.add('inactive'));

  // clear the current answer and replace it with the new one.
  // get the hidden close by answer and clone it to not lose it
  const answerContainer = document.getElementById('faq-replace-answer-container');
  answerContainer.innerHTML = '';

  // get the answer from the question selected, it's the last child
  let { target } = event;
  if (target.tagName === 'IMG') {
    target = target.parentElement.parentElement;
  }
  answerContainer.append(target.lastElementChild.cloneNode(true));

  // mark the current question as active
  target.classList.add('active');
  target.classList.remove('inactive');
}

/**
 * loads and decorates the faq replace block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // go through all rows in the table and remember questions and answers, remove the rows
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

  // create a container for all questions
  const questionsContainer = document.createElement('div');
  questionsContainer.id = 'faq-replace-questions-container';
  container.append(questionsContainer);

  // create the visible answer container,
  // its content gets replaced every time a question is selected
  const answerContainer = document.createElement('div');
  answerContainer.id = 'faq-replace-answer-container';
  answerContainer.innerHTML = 'no question selected';
  container.append(answerContainer);

  // move the answer right underneath the question (hidden by css)
  // so that when a question is selected, the answer is close by
  // register event
  questions.forEach((question, nrOfQuestions) => {
    questionsContainer.appendChild(question);
    question.appendChild(answers[nrOfQuestions]);
    question.addEventListener('click', answerQuestion);
  });

  // show first answer by default
  questions[0].click();
}
