import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { setActiveLink, updateNavHeight } from '../../scripts/scripts.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1000px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function addNavigationLogoForScrollingPage(nav) {
  const [navBrandPrimary] = nav.querySelectorAll('.nav-brand > p');

  if (!navBrandPrimary) return;

  const homePageLink = navBrandPrimary.querySelector('a');
  homePageLink.setAttribute('aria-label', 'Navigate to homepage');

  if (window.location.pathname !== '/') {
    window.addEventListener('resize', updateNavHeight);
    return;
  }

  const scrollingLogo = homePageLink.firstChild;
  const defaultLogo = document.createElement('span');
  defaultLogo.className = 'icon icon-wheatley-stacked';
  defaultLogo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-wheatley-stacked"></use></svg>';
  homePageLink.prepend(defaultLogo);
  scrollingLogo.classList.add('logo-hidden');
  scrollingLogo.classList.add('scrolling-logo');
  defaultLogo.classList.add('logo-hidden');
  defaultLogo.classList.add('default-logo');
  const logo = document.createElement('span');
  logo.className = 'icon icon-wheatley-stacked';
  logo.innerHTML = defaultLogo.innerHTML;
  homePageLink.prepend(logo);
  nav.classList.add('wide');
  nav.parentElement.classList.add('no-background', false);

  let timeout;
  const updateScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const isScrolled = window.scrollY > 40;
      nav.classList.toggle('narrow', isScrolled);
      nav.classList.toggle('wide', !isScrolled);
      nav.parentElement.classList.toggle('no-background', !isScrolled);
      if (isScrolled) {
        logo.innerHTML = scrollingLogo.innerHTML;
        updateNavHeight(isScrolled);
      } else if (!isScrolled) {
        updateNavHeight(isScrolled);
        logo.innerHTML = defaultLogo.innerHTML;
      }
    }, 10);
  };

  window.addEventListener('scroll', updateScroll);
  window.addEventListener('resize', updateScroll);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        const link = navSection.querySelector('a');
        if (link) {
          link.className = 'navigation';
          setActiveLink([link], 'active');
        }
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });

      const close = document.createElement('div');
      close.classList.add('nav-hamburger-close');
      const icon = document.createElement('span');
      icon.classList.add('nav-hamburger-icon');
      close.append(icon);
      close.addEventListener('click', () => toggleMenu(nav, navSections));
      navSections.append(close);
    }

    const navBrand = nav.querySelector('.nav-brand');
    if (navBrand) {
      const ul = navBrand.querySelector('ul');
      if (ul) {
        ul.remove();
        if (navSections) {
          const social = document.createElement('div');
          social.className = 'header-social';
          social.append(ul);
          navSections.querySelector('.nav-hamburger-close').insertAdjacentElement('beforebegin', social);
        }
      }
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <i>Menu</i>
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    if (navSections) {
      navSections.insertAdjacentElement('beforebegin', hamburger);
    } else {
      nav.append(hamburger);
    }

    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);

    addNavigationLogoForScrollingPage(nav);

    await decorateIcons(nav);

    // remove empty sections
    Array.from(nav.children).forEach((section) => {
      if (section.children.length === 0 || (section.children.length === 1 && section.children[0].tagName === 'UL' && section.children[0].children.length === 0)) {
        section.remove();
      }
    });

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(overlay);

    block.append(navWrapper);
  }
}
