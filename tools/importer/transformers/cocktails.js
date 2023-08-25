/* global WebImporter */
export default function process(main, document, params, url) {
  if (url.includes('/cocktails/') && !url.includes('/cocktails/?')) {
    // somehow the cols left/right is wrong on the import source...
    const leftCol = main.querySelector('.right-col');
    const rightCol = main.querySelector('.left-col');
    let cells = [
      ['Columns'],
      [leftCol, rightCol],
    ];
    const columnsTable = WebImporter.DOMUtils.createTable(cells, document);
    main.querySelector('.cocktail-content-container').replaceWith(columnsTable);

    const creatorContainer = main.querySelector('.created-by-container');
    if (creatorContainer) {
      const creator = main.querySelector('.cocktail-created-by');
      const list = document.createElement('ul');
      const item = document.createElement('li');
      item.append(creatorContainer);
      list.append(item);
      creator.append(list);
    }

    const section = document.createElement('hr');
    columnsTable.after(section);

    cells = [
      ['Section Metadata'],
      ['Style', 'pocketguide'],
    ];
    section.after(WebImporter.DOMUtils.createTable(cells, document));

    document.querySelector('.wheatley-button').href = '/wheatleyvodkacocktailbook.pdf';
  }
}
