function toggle(element) {
  const answer = element.lastElementChild;
  if (answer.style.display === 'block') {
    answer.style.display = 'none';
    element.classList.remove('active');
  } else {
    element.classList.add('active');
    answer.style.display = 'block';
  }
}

function toggleChild(event) {
  toggle(event.target.parentElement);
}

function toggleRow(event) {
  toggle(event.target);
}

/**
 * loads and decorates the faq inplace block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  [...block.children].forEach((row) => {
    row.addEventListener('click', toggleRow);
    row.firstElementChild.addEventListener('click', toggleChild);
    row.lastElementChild.addEventListener('click', toggleChild);
  });
}
