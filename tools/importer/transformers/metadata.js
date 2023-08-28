/* global WebImporter */
export default function process(main, document) {
  const section = document.createElement('hr');
  main.append(section);

  const title = document.querySelector('head title').textContent;

  const cells = [
    ['Metadata'],
    ['Title', `${title}`],
  ];
  const metadataTable = WebImporter.DOMUtils.createTable(cells, document);
  main.append(metadataTable);
}
