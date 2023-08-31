import {
  getMetadata,
  buildBlock,
} from './lib-franklin.js';

/**
 * Loads the cocktail template and replaces the content when the metadata is set accordingly
 * @param {Element} doc The container element
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export async function loadCocktail(doc) {
  const templatePath = getMetadata('template');
  if (templatePath !== '') {
    // when the metadata define a template, retrieve it
    const resp = await fetch(`${templatePath}.plain.html`, window.location.pathname.endsWith(`${templatePath}`) ? { cache: 'reload' } : {});

    if (resp.ok) {
      // load template content
      const tplText = await resp.text();

      // retrieve the content wrapper, our top most div and put it's cocktail content aside
      const main = doc.querySelector('main');
      const cocktailData = Array.from(main.children);

      // apply the template content
      main.innerHTML = tplText;

      // reapply the cocktails content
      const cocktailDiv = main.querySelector('div.cocktail');
      cocktailDiv.textContent = '';
      cocktailDiv.append(...cocktailData);

      const insertLocation = cocktailDiv.previousElementSibling;

      // create a new columns block, putting any paragraphs to the right column,
      // put the remainers to the left column (such as headers and lists)
      const rightCol = main.querySelector('.cocktail picture');
      const leftCol = main.querySelector('.cocktail');
      const columnsTable = buildBlock('columns', [[leftCol, rightCol]]);
      const wrapper = document.createElement('div');
      wrapper.append(columnsTable);
      if (insertLocation) {
        // in case when there is content before the cocktail details,
        // insert the columns block after that content
        insertLocation.append(wrapper);
      } else {
        // when there is no content before the cocktail details, just add it on top
        main.prepend(wrapper);
      }

      // move the first header1 to top
      const firstHeaderOne = doc.querySelector('h1');
      wrapper.prepend(firstHeaderOne);
    }
  }
}
