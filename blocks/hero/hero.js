/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const picture = block.querySelector('picture');
  const h1 = block.querySelector('h1');
  const h2 = block.querySelector('h2');
  const a = block.querySelector('a');
  const h3 = block.querySelector('h3');

  if (picture && h1 && h2 && a) {
    block.innerHTML = '';
    const left = document.createElement('div');
    left.classList.add('left');
    left.appendChild(h1);
    left.appendChild(h2);
    left.appendChild(a);

    const right = document.createElement('div');
    right.classList.add('right');
    right.appendChild(picture);
    block.appendChild(left);
    block.appendChild(right);

    block.classList.add('no-background');

    if (h3) {
      const footer = document.createElement('div');
      footer.classList.add('hero-footer');
      footer.appendChild(h3);
      block.parentElement.appendChild(footer);

      let timeout;
      const updateScroll = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          footer.classList.toggle('scrolled', window.innerWidth >= 1000 && block.offsetHeight - window.scrollY < 70);
        }, 1);
      };

      window.addEventListener('scroll', updateScroll);
      window.addEventListener('resize', updateScroll);
    }
  }
}
