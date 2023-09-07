let pressed = false;
let startX;
let x;
let centerCard = null;
const sliderContainer = document.querySelector('.quote-carousel-wrapper');
const innerSlider = document.querySelector('.quote-carousel');

/**
 * decorates all cards and marks the current one active
 * @param event the triggered event or null if none
 */
function decorateCards(event) {
  // the center of the entire carousel, used to determine style and snap
  const xCenter = (sliderContainer.getBoundingClientRect().width / 2)
    + sliderContainer.getBoundingClientRect().x;

  // style all cards, and when triggered by event, choose the card in the center
  const cards = document.querySelectorAll('.quotecard');
  cards.forEach((card) => {
    if (event != null && card.getBoundingClientRect().left < xCenter
      && card.getBoundingClientRect().right > xCenter) {
      // center is between left and right of this card, choose it as the card to center
      centerCard = card;
    } else if (centerCard !== card) {
      // style all cards that are not centered, update the pagedots
      card.classList.remove('active');
      card.ariaSelected = false;
      const cardId = card.id.replace('card-', '');
      sliderContainer.querySelectorAll('.quote-carousel-wrapper>ol>li').item(cardId).classList.remove('active');
    }
  });

  if (centerCard) {
    // mark current card as the center card
    centerCard.classList.add('active');
    centerCard.ariaSelected = true;
    const cardId = centerCard.id.replace('card-', '');
    sliderContainer.querySelectorAll('.quote-carousel-wrapper>ol>li').item(cardId).classList.add('active');
  }
}

/**
 * moves all cards in the carousel, by dragging with mouse or touch
 * @param event the user event
 */
function move(event) {
  if (!pressed) return;
  event.preventDefault();

  // find current horizontal offset
  x = event.offsetX;
  if (event.type === 'touchmove') {
    const r = sliderContainer.getBoundingClientRect();
    x = (event.touches[0].clientX - r.left);
  }

  // determine the amount of moved pixels horizontally and move the cards accordingly
  const newOffsetX = x - startX;
  innerSlider.style.left = `${newOffsetX}px`;
  decorateCards(event);
}

/**
 * snaps the currently selected card to the center
 */
function snap() {
  if (centerCard) {
    // the middle of the card to center
    const cardCurrentMiddle = centerCard.getBoundingClientRect().x
      + (centerCard.getBoundingClientRect().width / 2);

    // the snap point in the center. the middle of the card and
    // this snap point must overlay to center it
    const snapCenterPoint = sliderContainer.getBoundingClientRect().x
      + (sliderContainer.getBoundingClientRect().width / 2);

    // the deviation between the two, or said different:
    // the amount of pixels to move in order to snap
    const deviationToCenterPoint = Math.abs(snapCenterPoint - cardCurrentMiddle);

    // calculate the new horizontal offset
    let newOffsetX = Number(innerSlider.style.left.replace('px', ''));
    if (cardCurrentMiddle < snapCenterPoint) {
      newOffsetX += deviationToCenterPoint;
    } else {
      newOffsetX -= deviationToCenterPoint;
    }

    // apply the new offset with a transition
    innerSlider.style.transition = 'all .5s ease-in-out';
    innerSlider.style.left = `${newOffsetX}px`;
  }
  decorateCards(null);
}

/**
 * selects the given card and snaps it, so it is moved into center
 * @param quote the card to select
 */
function selectCard(quote) {
  centerCard = quote;
  snap();
}

/**
 * decorates the faq-carousel block
 * @param block the block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  // add page dots at the bottom to choose a card (or a quote)
  const pageDots = document.createElement('ol');
  pageDots.classList.add('pagedots');
  sliderContainer.append(pageDots);

  // for all cards, create their content and style it accordingly
  [...block.children].forEach((quote, index) => {
    // bottom part with image and name
    const aphoristContainer = document.createElement('div');
    aphoristContainer.className = 'aphorist';
    const picture = quote.querySelector('picture');
    const parent = picture.parentElement;
    aphoristContainer.append(picture);
    aphoristContainer.append(quote.querySelector('ul'));
    parent.replaceWith(aphoristContainer);

    // remove unused div level
    const innderDiv = quote.querySelector('div');
    const childs = innderDiv.childNodes;
    quote.append(...childs);
    innderDiv.remove();

    // the quote icon on top left
    const iconSpan = document.createElement('span');
    iconSpan.className = 'quote-icon';
    quote.prepend(iconSpan);

    // style the card, do not add a margin right for the last one
    quote.classList.add('quotecard');
    if (block.children.length === index - 1) {
      quote.style.marginRight = 0;
    }

    // define id of card
    quote.id = `card-${index}`;

    // create left white spacer to have the round icon style
    const leftSpacer = document.createElement('div');
    leftSpacer.classList.add('leftspacer');
    quote.prepend(leftSpacer);

    // add a page dot at the bottom
    const pageDot = document.createElement('li');
    pageDot.classList.add('pagedot');
    pageDot.ariaLabel = `Page Dot ${index}`;
    pageDot.addEventListener('click', () => {
      selectCard(quote);
    });
    pageDots.append(pageDot);

    // for the first card, mark active and remove left margin, also mark page dot active
    if (index === 0) {
      quote.classList.add('active');
      pageDot.classList.add('active');
      quote.style.marginLeft = 0;
    }
  });

  // register all event listeners for mouse and touch
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
