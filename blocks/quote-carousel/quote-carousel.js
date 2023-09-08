/**
 * decorates all cards and marks the current one active
 * @param event the triggered event or null if none
 * @param block the carousel block
 */
function decorateCards(event, block) {
  // the center of the entire carousel, used to determine style and snap
  const xCenter = (block.parentElement.getBoundingClientRect().width / 2)
    + block.parentElement.getBoundingClientRect().x;

  // style all cards, and when triggered by event, choose the card in the center
  const cards = block.querySelectorAll('.quotecard');
  cards.forEach((card) => {
    if (event != null && card.getBoundingClientRect().left < xCenter
      && card.getBoundingClientRect().right > xCenter) {
      // center is between left and right of this card, choose it as the card to center
      block.centerCard = card;
    } else if (block.centerCard !== card) {
      // style all cards that are not centered, update the pagedots
      card.classList.remove('active');
      card.ariaSelected = false;
      const cardId = card.id.replace('card-', '');
      block.parentElement.querySelectorAll('.quote-carousel-wrapper>ol>li').item(cardId).classList.remove('active');
    }
  });

  if (block.centerCard) {
    // mark current card as the center card
    block.centerCard.classList.add('active');
    block.centerCard.ariaSelected = true;
    const cardId = block.centerCard.id.replace('card-', '');
    block.parentElement.querySelectorAll('.quote-carousel-wrapper>ol>li').item(cardId).classList.add('active');
  }
}

/**
 * moves all cards in the carousel, by dragging with mouse or touch
 * @param event the user event
 * @param block the carousel block
 */
function move(event, block) {
  if (!block.pressed) return;
  event.preventDefault();

  // find current horizontal offset
  block.x = event.offsetX;
  if (event.type === 'touchmove') {
    const r = block.parentElement.getBoundingClientRect();
    block.x = (event.touches[0].clientX - r.left);
  }

  // determine the amount of moved pixels horizontally and move the cards accordingly
  const newOffsetX = block.x - block.startX;
  block.style.left = `${newOffsetX}px`;
  decorateCards(event, block);
}

/**
 * snaps the currently selected card to the center
 * @param block the carousel block
 */
function snap(block) {
  if (block.centerCard) {
    // the middle of the card to center
    const cardCurrentMiddle = block.centerCard.getBoundingClientRect().x
      + (block.centerCard.getBoundingClientRect().width / 2);

    // the snap point in the center. the middle of the card and
    // this snap point must overlay to center it
    const snapCenterPoint = block.parentElement.getBoundingClientRect().x
      + (block.parentElement.getBoundingClientRect().width / 2);

    // the deviation between the two, or said different:
    // the amount of pixels to move in order to snap
    const deviationToCenterPoint = Math.abs(snapCenterPoint - cardCurrentMiddle);

    // calculate the new horizontal offset
    let newOffsetX = Number(block.style.left.replace('px', ''));
    if (cardCurrentMiddle < snapCenterPoint) {
      newOffsetX += deviationToCenterPoint;
    } else {
      newOffsetX -= deviationToCenterPoint;
    }

    console.log('cardmiddle: '+cardCurrentMiddle+', devi: '+deviationToCenterPoint+', newOffsetX: '+newOffsetX+', snapcenter: '+snapCenterPoint);

    // apply the new offset with a transition
    block.style.transition = 'all .5s ease-in-out';
    block.style.left = `${newOffsetX}px`;
  }
  decorateCards(null, block);
}

/**
 * selects the given card and snaps it, so it is moved into center
 * @param quote the card to select
 * @param block the carousel block
 */
function selectCard(quote, block) {
  block.centerCard = quote;
  snap(block);
}

/**
 * decorates the faq-carousel block
 * @param block the block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  // store some information
  block.pressed = false;
  block.startX = null;
  block.x = null;
  block.centerCard = null;

  // add page dots at the bottom to choose a card (or a quote)
  const pageDots = document.createElement('ol');
  pageDots.classList.add('pagedots');
  block.parentElement.append(pageDots);

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
      selectCard(quote, block);
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
  block.parentElement.addEventListener('mousedown', (e) => {
    block.pressed = true;
    block.startX = e.offsetX - block.offsetLeft;
    block.parentElement.style.cursor = 'grabbing';
    block.style.transition = null;
  });

  block.parentElement.addEventListener('mouseenter', () => {
    block.parentElement.style.cursor = 'grab';
  });

  block.parentElement.addEventListener('mouseup', () => {
    block.parentElement.style.cursor = 'grab';
    block.pressed = false;
    snap(block);
  });
  block.parentElement.addEventListener('mousemove', (e) => { move(e, block); });

  block.parentElement.addEventListener('touchstart', (e) => {
    block.pressed = true;
    block.style.transition = null;
    const r = block.parentElement.getBoundingClientRect();
    block.startX = (e.touches[0].clientX - r.left) - block.offsetLeft;
  });
  block.parentElement.addEventListener('touchend', () => {
    block.pressed = false;
    snap(block);
  });
  block.parentElement.addEventListener('touchmove', (e) => { move(e, block); });

  /**
   * tiny function to start a timer when window is resized and stop/replace
   * that timer as long as the resize is going on. this way, there is no
   * unneeded painting executed(with invalid measurements for card center)
   * and when the window resize has stopped,
   * the last timer runs out and executes the given function.
   * @param func the function to execute once the resizing has stopped
   */
  function resizeWhenDone(func) {
    block.timer = null;
    return function (event) {
      if (block.timer) clearTimeout(block.timer);
      block.timer = setTimeout(func, 100, event);
    };
  }

  window.addEventListener('resize', resizeWhenDone(() => {
    snap(block);
  }));
}
