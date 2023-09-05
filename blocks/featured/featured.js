import { fetchQueryIndex } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const DEFAULT_RECIPE = {
  path: '/cocktails',
  title: 'All Cocktails',
  image: '/media_153d117ec7460d5d289d6d8a030f2aaac497b3fc2.png#width=905&height=650',
};

export default async function decorate(block) {
  const usePlain = block.classList.contains('plain');
  const contents = document.createElement('div');
  contents.className = 'featured-recipes';
  let parent = contents;
  let nextParent = contents;
  if (!usePlain) {
    block.classList.add('special');
    const leftCol = document.createElement('div');
    leftCol.className = 'featured-recipes-left';
    contents.append(leftCol);

    const rightCol = document.createElement('div');
    rightCol.className = 'featured-recipes-right';
    contents.append(rightCol);

    // start with left col
    parent = leftCol;
    nextParent = rightCol;
  }

  const index = await fetchQueryIndex();
  const items = block.querySelectorAll('a');
  items.forEach((link) => {
    const path = new URL(link.href).pathname;
    const recipe = path === DEFAULT_RECIPE.path ? DEFAULT_RECIPE
      : index.data.find((r) => r.path === path);
    if (recipe) {
      const item = document.createElement('div');
      item.className = 'featured-recipe';

      // create an img and a link element
      const img = createOptimizedPicture(recipe.image, recipe.title, true);
      img.className = 'featured-recipe-image';
      const newlink = document.createElement('a');
      newlink.href = recipe.path;
      if (path === DEFAULT_RECIPE.path) {
        // nest img and button directly in div
        img.classList.add('featured-recipe-button');
        item.append(img);
        item.append(newlink);
        newlink.textContent = recipe.title;
        newlink.className = 'button primary';
        item.classList.add('button-container');
      } else {
        // nest img and span(title) inside the link
        const span = document.createElement('span');
        span.textContent = recipe.title;

        newlink.append(img);
        newlink.append(span);
        item.append(newlink);
      }
      parent.append(item);
      // switch to right col if not plain
      parent = nextParent;
    }
  });
  block.textContent = '';
  block.append(contents);
}
