function doToggle(event) {
  const element = event.target.parentElement;
  const answer = element.lastElementChild;
  if (answer.style.display === 'block') {
    answer.style.display = 'none';
    element.classList.remove('active');
  } else {
    element.classList.add('active');
    answer.style.display = 'block';
  }
}

/**
 * loads and decorates the faq inplace block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // go through all rows in the table and process questions and answers, remove the rows
  [...block.children].forEach((row) => {
    row.firstElementChild.addEventListener('click', (e) => doToggle(e));
    row.lastElementChild.addEventListener('click', (e) => doToggle(e));
  });
}
