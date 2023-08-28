/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const picture = block.querySelector('picture');
  const h1 = block.querySelector('h1');
  const h2 = block.querySelector('h2');
  const a = block.querySelector('a');

  if (picture && h1 && h2 && a) {
    block.innerHTML = '';
    const left = document.createElement('div');
    left.appendChild(h1);
    left.appendChild(h2);
    left.appendChild(a);

    const right = document.createElement('div');
    right.appendChild(picture);
    block.appendChild(left);
    block.appendChild(right);
  }
}
