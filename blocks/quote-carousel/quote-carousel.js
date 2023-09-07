let pressed = false;
let startX;
let x;
let centerCard = null;
const sliderContainer = document.querySelector('.quote-carousel-wrapper');
const innerSlider = document.querySelector('.quote-carousel');

function decorateCards(event) {
  const xCenter = (sliderContainer.getBoundingClientRect().width / 2)
    + sliderContainer.getBoundingClientRect().x;
  const cards = document.querySelectorAll('.quotecard');
  cards.forEach((card) => {
    if (event != null && card.getBoundingClientRect().left < xCenter
      && card.getBoundingClientRect().right > xCenter) {
      centerCard = card;
    } else if (centerCard !== card) {
      card.classList.remove('active');
      card.ariaSelected = false;
      const cardId = card.id.replace('card-', '');
      sliderContainer.querySelectorAll('.quote-carousel-wrapper>ol>li').item(cardId).classList.remove('active');
    }
  });

  if (centerCard) {
    centerCard.classList.add('active');
    centerCard.ariaSelected = true;
    const cardId = centerCard.id.replace('card-', '');
    sliderContainer.querySelectorAll('.quote-carousel-wrapper>ol>li').item(cardId).classList.add('active');
  }
}

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
  decorateCards(event);
}

function snap() {
  if (centerCard) {
    const cardCurrentMiddle = centerCard.getBoundingClientRect().x
      + (centerCard.getBoundingClientRect().width / 2);
    const snapCenterPoint = sliderContainer.getBoundingClientRect().x
      + (sliderContainer.getBoundingClientRect().width / 2);
    const deviationToCenterPoint = Math.abs(snapCenterPoint - cardCurrentMiddle);
    let newOffsetX = Number(innerSlider.style.left.replace('px', ''));
    if (cardCurrentMiddle < snapCenterPoint) {
      newOffsetX += deviationToCenterPoint;
    } else {
      newOffsetX -= deviationToCenterPoint;
    }
    innerSlider.style.transition = 'all .5s ease-in-out';
    innerSlider.style.left = `${newOffsetX}px`;
  }
  decorateCards(null);
}

function selectCard(quote) {
  centerCard = quote;
  snap();
}

export default async function decorate(block) {
  const pageDots = document.createElement('ol');
  pageDots.classList.add('pagedots');
  sliderContainer.append(pageDots);
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
    if (block.children.length === index - 1) {
      quote.style.marginRight = 0;
    }
    quote.id = `card-${index}`;

    const pageDot = document.createElement('li');
    pageDot.classList.add('pagedot');
    pageDot.ariaLabel = `Page Dot ${index}`;
    pageDot.addEventListener('click', () => {
      selectCard(quote);
    });
    pageDots.append(pageDot);
    if (index === 0) {
      quote.classList.add('active');
      sliderContainer.querySelectorAll('.quote-carousel-wrapper>ol>li').item(index).classList.add('active');
      quote.style.marginLeft = 0;
    }
  });

  sliderContainer.addEventListener('mousedown', (e) => {
    pressed = true;
    startX = e.offsetX - innerSlider.offsetLeft;
    sliderContainer.style.cursor = 'grabbing';
    innerSlider.style.transition = null;
  });

  sliderContainer.addEventListener('mouseenter', () => {
    sliderContainer.style.cursor = 'grab';
  });

  sliderContainer.addEventListener('mouseup', () => {
    sliderContainer.style.cursor = 'grab';
    pressed = false;
    snap();
  });
  sliderContainer.addEventListener('mousemove', move);

  sliderContainer.addEventListener('touchstart', (e) => {
    pressed = true;
    innerSlider.style.transition = null;
    const r = sliderContainer.getBoundingClientRect();
    startX = (e.touches[0].clientX - r.left) - innerSlider.offsetLeft;
  });
  sliderContainer.addEventListener('touchend', () => {
    pressed = false;
    snap();
  });
  sliderContainer.addEventListener('touchmove', move);
}
