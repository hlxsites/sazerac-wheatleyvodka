/* global WebImporter */
export default function process(main) {
  WebImporter.DOMUtils.remove(main, ['#header-outer', '#header-space', '#footer-outer', '#ageGateScreen', '.nectar-skip-to-content', '.slide-out-from-right']);
}
