import { fetchQueryIndex } from '../../scripts/scripts.js';
import { createOptimizedPicture, decorateButtons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const contents = document.createElement('div');
  contents.className = 'all-recipes';

  const index = await fetchQueryIndex();
  // sort index alphabetically
  index.data.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });

  // create a div for each recipe
  let i = 0;
  // initially only show max cocktails
  const max = window.innerWidth >= 1152 ? 9 : 8;
  index.data.forEach((recipe) => {
    if (recipe.path.startsWith('/cocktails/')) {
      // create a div with a link and an image and a span for the title
      const item = document.createElement('div');
      item.className = 'recipe';
      if (i >= max) {
        item.style.display = 'none';
      }

      const newlink = document.createElement('a');
      newlink.href = recipe.path;

      const img = createOptimizedPicture(recipe.image, null, i >= max);
      img.className = 'recipe-image';

      const span = document.createElement('span');
      span.textContent = recipe.title;

      newlink.append(img);
      newlink.append(span);
      item.append(newlink);
      contents.append(item);
      i += 1;
    }
  });
  block.textContent = '';
  block.append(contents);
  if (i >= max) {
    const loadMore = document.createElement('div');
    loadMore.className = 'recipes-more';
    const link = document.createElement('a');
    link.id = 'loadMoreRecipes';
    link.href = '#';
    link.textContent = 'Load More Recipes';
    link.dataset.count = max;
    link.addEventListener('click', (e) => {
      const count = Number(e.target.dataset.count);
      // enable next max recipies
      const nextMax = window.innerWidth >= 1152 ? 9 : 8;
      for (let j = 0; j < nextMax; j += 1) {
        const item = contents.childNodes.length > count + j ? contents.childNodes[count + j] : null;
        if (item) {
          item.style.display = 'block';
        }
      }
      link.dataset.count = count + nextMax;
      if (count + nextMax >= contents.childNodes.length) {
        loadMore.style.display = 'none';
      }
      e.preventDefault();
    });
    loadMore.append(link);
    block.append(loadMore);
    decorateButtons(loadMore);
  }
}
