export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data

    this.render()
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTable();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(element);
  }
  
  getTable() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => this.getHeaderRows(item)).join('')}
        </div>
        <div data-element="body" class="sortable-table__body">
        ${this.getBodyRows(this.data)}
        </div>
      </div>
    `
  }

  
  getHeaderRows({id = '', title = '', sortable = ''} = {}) {
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
      <span>${title}</span>
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
    </div>
    `
  }

  getBodyRows(data = []) {
    return data.map( item => {
      return `<a href="/products/${item.id}" class="sortable-table__row">
      ${this.getBodyRow(item)}
      </a>`
    }).join('');
  }
  
  getBodyRow(item) {
    const cellItem = this.headerConfig.map(({id, template} = {}) => {
      return {id, template}
    })

    return cellItem.map(({id, template} = {}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`
    }).join('')
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
  
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
  
    return result;
  }

  sort(field, order) {
    
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);


    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getBodyRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => { 
      return (sortType === 'number') 
        ? direction * (a[field] - b[field])
        : (sortType === 'string') 
        ? direction * a[field].localeCompare(b[field], ['ru', 'en'])
        : direction * (a[field] - b[field]);
      }
    )
  }

  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}


