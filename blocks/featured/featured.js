import { fetchQueryIndex } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const contents = document.createElement('div');
  contents.className = 'featured-recipes';

  const leftCol = document.createElement('div');
  leftCol.className = 'featured-recipes-left';
  contents.append(leftCol);

  const rightCol = document.createElement('div');
  rightCol.className = 'featured-recipes-right';
  contents.append(rightCol);

  const index = await fetchQueryIndex();
  const items = block.querySelectorAll('a');
  // start with left col
  let parent = leftCol;
  items.forEach((link) => {
    const path = new URL(link.href).pathname;
    const recipe = index.data.find((r) => r.path === path);
    if (recipe) {
      const item = document.createElement('div');
      item.className = 'featured-recipe';
      // create a link and inside a div with a background image and a span for the title
      const newlink = document.createElement('a');
      newlink.href = recipe.path;

      const img = createOptimizedPicture(recipe.image, recipe.title, true);
      img.className = 'featured-recipe-image';

      const span = document.createElement('span');
      span.textContent = recipe.title;

      newlink.append(img);
      newlink.append(span);
      item.append(newlink);
      parent.append(item);
      // switch to right col
      parent = rightCol;
    }
  });
  block.textContent = '';
  block.append(contents);
}
