/* global WebImporter */
export default function process(main, document, params, url) {
  if (url.includes('/cocktails/') && !url.includes('/cocktails/?')) {
    const creatorContainer = main.querySelector('.created-by-container');
    if (creatorContainer) {
      const img = main.querySelector('.creator-image');
      const name = main.querySelector('.creator-name');
      const social = main.querySelector('.creator-social');

      const list = document.createElement('ul');
      if (name) {
        const creatorName = document.createElement('li');
        creatorName.append(name);
        list.append(creatorName);
      }
      if (social) {
        const creatorSocial = document.createElement('li');
        creatorSocial.append(social);
        list.append(creatorSocial);
      }
      creatorContainer.textContent = '';
      if (img) {
        creatorContainer.append(img);
      }
      creatorContainer.append(list);
    }
    WebImporter.DOMUtils.remove(main, ['#cocktail-guide']);
  }
}
