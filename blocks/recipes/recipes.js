import { fetchQueryIndex } from '../../scripts/scripts.js';
import { decorateButtons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const contents = document.createElement('div');
  contents.className = 'all-recipes';

  const index = await fetchQueryIndex();
  // sort index alphabetically
  index.data.sort((a, b) => {
    const titleA = a.pageTitle.toUpperCase();
    const titleB = b.pageTitle.toUpperCase();
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
  index.data.forEach((recipe) => {
    if (recipe.path.startsWith('/cocktails/')) {
      // create a div with a link and an image and a span for the title
      const item = document.createElement('div');
      item.className = 'recipe';
      if (i >= 8) {
        item.style.display = 'none';
      }

      const newlink = document.createElement('a');
      newlink.href = recipe.path;

      const img = document.createElement('div');
      img.className = 'recipe-image';
      img.style.backgroundImage = `url(${recipe.image})`;

      const span = document.createElement('span');
      span.textContent = recipe.pageTitle;

      newlink.append(img);
      newlink.append(span);
      item.append(newlink);
      contents.append(item);
      i += 1;
    }
  });
  block.textContent = '';
  block.append(contents);
  if (i >= 8) {
    const loadMore = document.createElement('div');
    loadMore.className = 'recipes-more';
    const link = document.createElement('a');
    link.id = 'loadMoreRecipes';
    link.href = '#';
    link.textContent = 'Load More Recipes';
    link.dataset.count = 8;
    link.addEventListener('click', (e) => {
      const count = Number(e.target.dataset.count);
      // enable next 8 recipes
      for (let j = 0; j < 8; j += 1) {
        const item = contents.childNodes.length > count + j ? contents.childNodes[count + j] : null;
        if (item) {
          item.style.display = 'block';
        }
      }
      link.dataset.count = count + 8;
      if (count + 8 >= contents.childNodes.length) {
        loadMore.style.display = 'none';
      }
      e.preventDefault();
    });
    loadMore.append(link);
    block.append(loadMore);
    decorateButtons(loadMore);
  }
}
