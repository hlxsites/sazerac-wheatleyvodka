export default async function decorate(block) {
  [...block.children].forEach((row, index) => {
    const step = document.createElement('div');
    step.classList.add('step');
    step.innerHTML = `<span>${index + 1}</span>`;
    row.firstElementChild.prepend(step);
  });
}
