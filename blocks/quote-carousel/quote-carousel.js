let pressed = false;
let startX;
let x;

const sliderContainer = document.querySelector('.quote-carousel-wrapper');
const innerSlider = document.querySelector('.quote-carousel');

function move(event) {
  if (!pressed) return;
  event.preventDefault();

  x = event.offsetX;
  if (event.type === 'touchmove') {
    const r = sliderContainer.getBoundingClientRect();
    x = (event.touches[0].clientX - r.left);
  }
  innerSlider.style.left = `${x - startX}px`;
}

export default async function decorate(block) {
  [...block.children].forEach((quote) => {
    const aphoristContainer = document.createElement('div');
    aphoristContainer.className = 'aphorist';
    const picture = quote.querySelector('picture');
    const parent = picture.parentElement;
    aphoristContainer.append(picture);
    aphoristContainer.append(quote.querySelector('ul'));
    parent.replaceWith(aphoristContainer);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'quote-icon';

    const innderDiv = quote.querySelector('div');
    const childs = innderDiv.childNodes;
    quote.append(...childs);
    innderDiv.remove();
    quote.prepend(iconSpan);
    quote.classList.add('quotecard');
  });

  sliderContainer.addEventListener('mousedown', (e) => {
    pressed = true;
    startX = e.offsetX - innerSlider.offsetLeft;
    sliderContainer.style.cursor = 'grabbing';
  });

  sliderContainer.addEventListener('mouseenter', () => {
    sliderContainer.style.cursor = 'grab';
  });

  sliderContainer.addEventListener('mouseup', () => {
    sliderContainer.style.cursor = 'grab';
    pressed = false;
  });
  sliderContainer.addEventListener('mousemove', move);

  sliderContainer.addEventListener('touchstart', (e) => {
    pressed = true;
    const r = sliderContainer.getBoundingClientRect();
    startX = (e.touches[0].clientX - r.left) - innerSlider.offsetLeft;
  });
  sliderContainer.addEventListener('touchend', () => {
    pressed = false;
  });
  sliderContainer.addEventListener('touchmove', move);
}
