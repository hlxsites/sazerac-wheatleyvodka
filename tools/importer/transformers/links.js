/**
 * Prefixes relative links with the target domain and remove trailing slash.
 */
export default function process(main, document) {
  document.querySelectorAll('a').forEach((a) => {
    const targetDomain = 'https://main--sazerac-wheatleyvodka--hlxsites.hlx.page';
    // if the link is relative, make it absolute
    if (a.href.startsWith('/')) {
      let link = a.href;
      const p1 = a.href.indexOf('#');
      const p2 = a.href.indexOf('?');
      let p = p1;
      if (p1 < 0 || (p2 > 0 && p2 < p1)) {
        p = p2;
      }
      if (p > 0) {
        link = a.href.substring(0, p);
        if (link.endsWith('/')) {
          link = link.substring(0, link.length - 1);
        }
        link += a.href.substring(p);
      } else if (link.endsWith('/')) {
        link = link.substring(0, link.length - 1);
      }
      a.href = targetDomain + link;
    }
  });
}
