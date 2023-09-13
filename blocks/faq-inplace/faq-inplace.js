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
  const half = block.children.length / 2;
  const leftCol = document.createElement('div');
  const rightCol = document.createElement('div');

  [...block.children].forEach((row, index) => {
    row.addEventListener('click', toggleRow);
    row.firstElementChild.addEventListener('click', toggleChild);
    row.lastElementChild.addEventListener('click', toggleChild);

    let divToAdd = leftCol;
    if (index >= half) {
      divToAdd = rightCol;
    }

    divToAdd.appendChild(row);
  });

  block.appendChild(leftCol);
  block.appendChild(rightCol);
}
