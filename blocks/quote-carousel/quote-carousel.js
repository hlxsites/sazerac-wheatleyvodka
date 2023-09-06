let pressed = false;
let startX;
let x;

const sliderContainer = document.querySelector('.quote-carousel-wrapper');
const innerSlider = document.querySelector('.quote-carousel');

let centerCard = null;

function move(event) {
  if (!pressed) return;
  event.preventDefault();

  x = event.offsetX;
  if (event.type === 'touchmove') {
    const r = sliderContainer.getBoundingClientRect();
    x = (event.touches[0].clientX - r.left);
  }
  const newOffsetX = x - startX;
  innerSlider.style.left = `${newOffsetX}px`;

  const xCenter = (sliderContainer.getBoundingClientRect().width / 2)
    + sliderContainer.getBoundingClientRect().x;
  const cards = document.querySelectorAll('.quotecard');
  cards.forEach((card) => {
    if (card.getBoundingClientRect().left < xCenter
      && card.getBoundingClientRect().right > xCenter) {
      centerCard = card;
    }
    card.classList.remove('active');
  });
  if (centerCard) {
    centerCard.classList.add('active');
  }
}

export default async function decorate(block) {
  [...block.children].forEach((quote, index) => {
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
    if (index === 0) {
      quote.classList.add('active');
    }
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
