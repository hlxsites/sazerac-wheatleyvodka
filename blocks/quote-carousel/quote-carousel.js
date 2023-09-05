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
    quote.querySelector('div').prepend(iconSpan);
  });
}
