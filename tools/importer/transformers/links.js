/**
 * Prefixes relative links with the target domain and remove trailing slash.
 */
export default function process(main, document) {
  document.querySelectorAll('a').forEach((a) => {
    const targetDomain = 'https://main--sazerac-wheatleyvodka--hlxsites.hlx.page';
    if (a.href.startsWith('/')) { // relative link?
      let link = a.href;
      // check for query parameters or anchor
      const p1 = a.href.indexOf('#');
      const p2 = a.href.indexOf('?');
      let p = p1;
      if (p1 < 0 || (p2 > 0 && p2 < p1)) {
        p = p2;
      }
      if (p > 0) {
        // remove query parameters or anchor
        link = a.href.substring(0, p);
        // remove trailing slash
        if (link.endsWith('/')) {
          link = link.substring(0, link.length - 1);
        }
        // reappend query parameters or anchor
        link += a.href.substring(p);
      } else if (link.endsWith('/')) {
        // no query parameters or anchor, remove trailing slash
        link = link.substring(0, link.length - 1);
      }
      // make link absolute
      a.href = targetDomain + link;
    }
  });
}
