import {
  getMetadata,
  buildBlock,
  decorateBlock,
} from './lib-franklin.js';

/**
 * Loads the cocktail template and replaces the content when the metadata is set accordingly
 * @param {Element} doc The container element
 * @returns {Promise}
 */
export async function loadCocktail(doc) {
  const templatePath = getMetadata('template');
  if (templatePath !== '') {
    const resp = await fetch(`${templatePath}.plain.html`, window.location.pathname.endsWith(`${templatePath}`) ? { cache: 'reload' } : {});

    if (resp.ok) {
      const tplText = await resp.text();

      const cocktailDataContainer = doc.querySelector('.default-content-wrapper');
      const cocktailData = cocktailDataContainer.innerHTML;

      cocktailDataContainer.innerHTML = tplText;
      cocktailDataContainer.querySelector('.cocktail').innerHTML = cocktailData;

      const rightCol = cocktailDataContainer.querySelector('.cocktail>p');
      rightCol.remove();
      const leftCol = cocktailDataContainer.querySelector('.cocktail');
      leftCol.remove();
      const columnsTable = buildBlock('columns', [[leftCol, rightCol]]);
      const wrapper = document.createElement('div');
      wrapper.append(columnsTable);
      cocktailDataContainer.prepend(wrapper);
      decorateBlock(columnsTable);
    }
  }
}
