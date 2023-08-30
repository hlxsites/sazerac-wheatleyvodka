import {
  getMetadata,
  buildBlock,
  decorateBlock, loadBlock,
} from './lib-franklin.js';

/**
 * Loads the cocktail template and replaces the content when the metadata is set accordingly
 * @param {Element} doc The container element
 * @returns {Promise}
 */
export async function loadCocktail(doc) {
  const templatePath = getMetadata('template');
  if (templatePath !== '') {
    // when the metadata define a template, retrieve it
    const resp = await fetch(`${templatePath}.plain.html`, window.location.pathname.endsWith(`${templatePath}`) ? { cache: 'reload' } : {});

    if (resp.ok) {
      // load template content
      const tplText = await resp.text();

      // retrieve the content wrapper, our top most div and put it's cocktail content aside
      const cocktailDataContainer = doc.querySelector('div.default-content-wrapper');
      const cocktailData = cocktailDataContainer.innerHTML; // FIXME do not use serialization

      // apply the template content
      cocktailDataContainer.innerHTML = tplText;

      // reapply the cocktails content
      cocktailDataContainer.querySelector('div.cocktail').innerHTML = cocktailData; // FIXME do not use serialization

      // create a new columns block, putting any paragraphs to the right column,
      // put the remainers to the left column (such as headers and lists)
      const rightCol = cocktailDataContainer.querySelector('.cocktail>p');
      const leftCol = cocktailDataContainer.querySelector('.cocktail');
      const columnsTable = buildBlock('columns', [[leftCol, rightCol]]);
      const wrapper = document.createElement('div');
      wrapper.append(columnsTable);
      cocktailDataContainer.prepend(wrapper);

      // move the first header1 to top
      const firstHeaderOne = doc.querySelector('h1');
      cocktailDataContainer.prepend(firstHeaderOne);

      // init the blocks
      decorateBlock(columnsTable);
      loadBlock(columnsTable);

      const pg = doc.querySelector('.pocketguide');
      decorateBlock(pg);
      loadBlock(pg);
    }
  }
}
