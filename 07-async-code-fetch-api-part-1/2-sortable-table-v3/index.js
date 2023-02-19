import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  DESC = "desc"
  ASC = "asc"

  step = 20
  start = 1
  data = []

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false
  } = {}) {
    this.headersConfig = headersConfig
    this.url = new URL(url, BACKEND_URL)
    this.isSortLocally = isSortLocally
    this.sorted = {
      id: sorted?.id || headersConfig.find(item => item.sortable).id,
      order: sorted?.order || this.ASC
    }

    this.render()
  }

  async render() {

    this.element = document.createElement("div")
    this.element.className = "products-list__container"
    this.element.setAttribute("data-element", "productsContainer")
    this.element.innerHTML = this.header + this.body

    this.data = await this.loadData()

    this.subElements.body.innerHTML = this.getBodyRows()
    this.subElements.header.addEventListener("pointerdown", this.onClickHeader)
    window.addEventListener('scroll', this.onScroll)
  }

  async loadData(id = this.sorted.id, order = this.sorted.order) {

    this.element.classList.add('sortable-table_loading')

    this.url.searchParams.set('_sort', id)
    this.url.searchParams.set('_order', order)
    this.url.searchParams.set('_start', this.start)
    this.url.searchParams.set('_end', this.start + this.step)

    const data = await fetchJson(this.url)

    this.element.classList.remove('sortable-table_loading')

    return data
  }

  get subElements() {
    if (!this._subElements) {
      this._subElements = {}
      const elements = this.element.querySelectorAll('[data-element]')

      for (const subElement of elements) {
        const name = subElement.dataset.element
        this._subElements[name] = subElement
      }
    }

    return this._subElements
  }

  onScroll = async (event) => {
    const tableBottom = document.documentElement.getBoundingClientRect().bottom
    const height = document.documentElement.clientHeight + 100

    if (tableBottom < height && !this.alreadyLoading && !this.isSortLocally) {
      this.alreadyLoading = true

      this.start += this.step
      const data = await this.loadData()

      this.data.push(...data)
      this.appendRows(data)

      this.alreadyLoading = false
    }
  }

  appendRows(newData) {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = this.getBodyRows(newData)

    this.subElements.body.append(...wrapper.childNodes)
  }

  onClickHeader = event => {
    const cell = event.target.closest('[data-sortable="true"]')

    if (cell && this.element.contains(cell)) {

      if (this.sorted.id === cell.dataset.id) {
        this.sorted.order = this.inversionSortType
      } else {
        this.sorted.id = cell.dataset.id
        this.sorted.order = this.DESC
      }

      if (this.isSortLocally) {
        this.sortOnClient(this.sorted.id, this.sorted.order)
      }
      else {
        this.sortOnServer(this.sorted.id, this.sorted.order)
      }

      this.displayArrow()
    }
  }

  get inversionSortType() {
    if (this.sorted.order === this.DESC) return this.ASC
    if (this.sorted.order === this.ASC) return this.DESC
  }

  displayArrow() {
    const headers = this.element.querySelectorAll('.sortable-table__cell[data-id][data-sortable="true"]')

    for (const headerItem of headers) {
      if (headerItem.dataset.id === this.sorted.id) {
        headerItem.dataset.order = this.sorted.order
      } else {
        headerItem.dataset.order = ""
      }
    }
  }

  async sortOnServer(id, order) {
    this.start = 1
    this.data = await this.loadData(id, order)

    this.subElements.body.innerHTML = this.getBodyRows()
  }

  sortOnClient(id, order) {
    const sortRule = this.getSortRule(id, order)
    const sortData = [...this.data].sort(sortRule)
    this.subElements.body.innerHTML = this.getBodyRows(sortData)
  }

  getSortRule(fieldValue, orderValue) {
    const headerItem = this.headersConfig.find(x => x.id === fieldValue) 
    const sortType = this.getSortType(orderValue)

    if (headerItem.sortType === "string") {
      return (a, b) => sortType * a[fieldValue].localeCompare(b[fieldValue], ["ru", "eng"], {caseFirst: "upper"})
    }
    if (headerItem.sortType === "number") {
      return (a, b) => sortType * (a[fieldValue] - b[fieldValue])
    }
    if (headerItem.sortType === "custom") {
      return (a, b) => sortType * headerItem.customSorting(a, b)
    }
  }

  getSortType = (param) => {
    switch (param) {
        case this.ASC:
            return 1
        case this.DESC:
            return -1
        default:
            throw "Передан некорректный тип сортировки!"
    }
  }

  sortOnClient (id, order) {
  get body() {
    return `<div data-element="body" class="sortable-table__body">
            </div>`
  }

  getBodyRows(data = this.data) {
    return data.map(x => 
          `<a href="/products/${x.id}" class="sortable-table__row">
              ${this.getRowCells(x).join("")}
           </a>`).join("")
  }

  getRowCells(item) {    
    return this.headersConfig.map(headerItem => headerItem.template ? 
                    headerItem.template(item[headerItem.id]) :
                   `<div class="sortable-table__cell">${item[headerItem.id]}</div>`)
  }

  get header() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.headersConfig.map(x => this.getHeaderCell(x)).join("")}
            </div>`
  }

  getHeaderCell(item) {
    return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
              <span>${item.title}</span>
              ${item.sortable ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                                  <span class="sort-arrow"></span>
                                </span>` : ``}
            </div>`
  }

  destroy() {
    this.remove()
    this._element = null    
    this._subElements = null 
  }

  sortOnServer (id, order) {
  remove() {
    if (this.element) {
      this.element.remove()
    }

    this.subElements.header.removeEventListener("pointerdown", this.onClickHeader)
    window.removeEventListener('scroll', this.onScroll)
    }
  }
  }
}
