import { decorateIcons } from '../../scripts/lib-franklin.js';

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function getModal(modalId, createContent, closeListener) {
  let dialogElement = document.getElementById(modalId);
  if (!dialogElement) {
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;

    const contentHTML = createContent?.() || '';

    dialogElement.innerHTML = `
    <div>
        <div class="embed-navigation">
          <button name="normalscreen" style="display:none;" class="embed-normalscreen" title="Close Fullscreen"><span class="icon icon-normalscreen"></button>
          <button name="fullscreen" class="embed-fullscreen" title="Fullscreen"><span class="icon icon-fullscreen"></button>
          <button name="close" class="embed-close" title="Close"><span class="icon icon-close"></button>
        </div>  
        ${contentHTML}
        </div>
      `;

    decorateIcons(dialogElement);
    document.body.appendChild(dialogElement);

    const buttonNormal = dialogElement.querySelector('button[name="normalscreen"]');
    const buttonFull = dialogElement.querySelector('button[name="fullscreen"]');
    buttonNormal.addEventListener('click', () => {
      buttonNormal.style.display = 'none';
      buttonFull.style.display = 'block';
      closeFullscreen();
    });
    buttonFull.addEventListener('click', () => {
      buttonNormal.style.display = 'block';
      buttonFull.style.display = 'none';
      openFullscreen(dialogElement.querySelector('div'));
    });
    dialogElement.querySelector('button[name="close"]')
      .addEventListener('click', () => {
        dialogElement.close();
      });

    dialogElement.addEventListener('close', (event) => closeListener(event));
  }
  return dialogElement;
}

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div class="embed-video">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : `${embed}?rel=0${suffix}`}" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    const dialogElement = document.getElementById('embed-modal');
    if (dialogElement) dialogElement.showModal();
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['twitter'],
      embed: embedTwitter,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    const innerHTML = config.embed(url, autoplay);
    const modal = getModal('embed-modal', () => innerHTML, () => {
      const dialog = document.getElementById('embed-modal');
      dialog.remove();
    });
    modal.showModal();
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
    block.classList.add('embed-is-loaded');
  }
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    const button = document.createElement('a');
    button.title = 'Play';
    button.href = '#';
    button.addEventListener('click', (e) => {
      loadEmbed(block, link, true);
      e.preventDefault();
    });
    wrapper.appendChild(button);
    button.append(placeholder);
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
