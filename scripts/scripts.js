import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
} from './lib-franklin.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    if (window.location.pathname === '/') {
      const parent = h1.parentElement;
      const h2 = main.querySelector('h2');
      const a = main.querySelector('a');
      const h3 = main.querySelector('h3');
      section.append(buildBlock('hero', { elems: [picture, h1, h2, a, h3].filter((e) => e) }));
      parent.remove();
    } else {
      section.append(buildBlock('hero', { elems: [picture] }));
      if (h1.previousElementSibling?.tagName === 'P') {
        h1.previousElementSibling.remove();
      }
    }
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Updates the nav height based on scrollpostion and min-width
 */
export function updateNavHeight(isScrolled = false) {
  if (isScrolled) {
    const navHeight = window.location.pathname === '/'
      || window.matchMedia('(min-width: 1000px)').matches ? '70px' : '65px';

    document.querySelector(':root').style.setProperty('--nav-height', navHeight);
  } else {
    const navHeight = window.matchMedia('(min-width: 1000px)').matches ? '143px' : '106.5px';
    document.querySelector(':root').style.setProperty('--nav-height', navHeight);
  }
}

/**
 * Set Link class to active when on the same page
 * @param links {NodeListOf<Element>} Array of links to check
 * @param className {string} Class to add to active link
 */
export function setActiveLink(links, className) {
  if (!links || links.length === 0) return;
  const ogUrl = window.location.pathname;
  const slicer = ogUrl.endsWith('/') ? -2 : -1;
  const actualPage = ogUrl.split('/').slice(slicer)[0].toLowerCase();
  if (actualPage === '') return;
  links.forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href.includes(actualPage)) {
      a.classList.add(className);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  updateNavHeight(window.location.pathname !== '/');
}

function setTitle(doc) {
  const title = doc.querySelector('head title');
  if (title) {
    if (window.location.pathname !== '/') {
      if (!title.textContent.endsWith('– Wheatley Vodka')) {
        title.textContent = `${title.textContent} – Wheatley Vodka`;
      }
    } else {
      title.textContent = 'Wheatley Vodka';
    }
  }
  const metaTitle = doc.querySelector('head meta[property="og:title"]');
  if (metaTitle) {
    if (window.location.pathname !== '/') {
      if (!metaTitle.content?.endsWith('– Wheatley Vodka')) {
        metaTitle.content = `${metaTitle.content} – Wheatley Vodka`;
      }
    } else {
      metaTitle.content = 'Wheatley Vodka';
    }
  }
}

function setMetaTag(type, name, value) {
  let meta = document.querySelector(`meta[${type}='${name}']`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.querySelector('head').append(meta);
  }
  meta.content = value;
}

function createMetadata(name, value) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', value);

  document.head.append(meta);
}

/**
 * Adds a favicon.
 * @param {string} href The favicon URL
 * @param {string} rel The icon rel
 * @param {string} type The icon content type
 * @param {string} size The dimensions of the icon, e.g. 80x80
 */
function addFavIcon(
  href,
  rel = 'icon',
) {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;

  const existingLink = document.querySelector(`head link[rel="${rel}"]`);
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  setTitle(doc);
  const h1 = doc.querySelector('body h1');
  if (h1) {
    setMetaTag('name', 'og:description', h1.textContent);
    setMetaTag('name', 'description', h1.textContent);
  }
  decorateTemplateAndTheme();
  if (getMetadata('template')) {
    const cocktails = await import(`${window.hlx.codeBasePath}/scripts/cocktails.js`);
    await cocktails.loadCocktail(doc);
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  addFavIcon(`${window.hlx.codeBasePath}/styles/icons/favicon-32x32.png`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/icons/favicon-180x180.png`, 'apple-touch-icon');
  createMetadata('msapplication-TileImage', `${window.hlx.codeBasePath}/styles/icons/favicon-270x270.png`);

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

export async function fetchIndex(indexFile, sheet, pageSize = 500) {
  const idxKey = indexFile.concat(sheet || '');

  const handleIndex = async (offset) => {
    const sheetParam = sheet ? `&sheet=${sheet}` : '';

    const resp = await fetch(`/${indexFile}.json?limit=${pageSize}&offset=${offset}${sheetParam}`);
    const json = await resp.json();

    const newIndex = {
      complete: (json.limit + json.offset) === json.total,
      offset: json.offset + pageSize,
      promise: null,
      data: [...window.index[idxKey].data, ...json.data],
    };

    return newIndex;
  };

  window.index = window.index || {};
  window.index[idxKey] = window.index[idxKey] || {
    data: [],
    offset: 0,
    complete: false,
    promise: null,
  };

  if (window.index[idxKey].complete) {
    return window.index[idxKey];
  }

  if (window.index[idxKey].promise) {
    return window.index[idxKey].promise;
  }

  window.index[idxKey].promise = handleIndex(window.index[idxKey].offset);
  const newIndex = await (window.index[idxKey].promise);
  window.index[idxKey] = newIndex;

  return newIndex;
}

export async function fetchQueryIndex() {
  return fetchIndex('query-index');
}

loadPage();
