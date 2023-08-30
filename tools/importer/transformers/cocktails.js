/* global WebImporter */
export default function process(main, document, params, url) {
  if (url.includes('/cocktails/') && !url.includes('/cocktails/?')) {
    const creatorContainer = main.querySelector('.created-by-container');
    if (creatorContainer) {
      const creator = main.querySelector('.cocktail-created-by');
      const list = document.createElement('ul');
      const item = document.createElement('li');
      item.append(creatorContainer);
      list.append(item);
      creator.append(list);
    }
    WebImporter.DOMUtils.remove(main, ['#cocktail-guide']);
  }
}
