export default async function decorate(block) {
  [...block.children].forEach((row, index) => {
    const step = document.createElement('div');
    step.classList.add('step');
    step.innerHTML = index + 1;
    row.firstElementChild.prepend(step);
  });
}
