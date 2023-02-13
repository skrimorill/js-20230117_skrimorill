import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  static isloading = 'column-chart_loading';
  chartHeight = 50;

  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    formatHeading = data => data
  } = {}) {
    this.data = [];
    this.url = new URL(BACKEND_URL + '/' + url);
    this.label = label;
    this.value = 0;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
    this.update(range.from, range.to);
  }
  setDataDependsProps() {
    if (this.data.length) {
      this.dataIsloading = '';
      this.maxHeight = Math.max(...this.data.map(item => item[1]));

      this.scale = this.chartHeight / this.maxHeight;

      this.value = this.data.reduce((value, item) => {return value + item[1];}, 0);
    } else {
      this.dataIsloading = ColumnChart.isloading;
      this.value = 0;
    }
  }
  createTitle() {
    const link = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ``;
    return `
        <div class="column-chart__title">Total ${this.label}
            ${link}
        </div>
    `;
  }
  createContainer() {
    return `
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
            <div data-element="body" class="column-chart__chart">
              ${this.createChart()}
            </div>
        </div>
    `;
  }
  createChart() {
    return this.data.
    map(item =>
      `
            <div style="--value: ${Math.floor(item[1] * this.scale)}" data-tooltip="${Math.round(item[1] / this.maxHeight * 100)}%">
            </div>
        `
    ).join('');
  }
  render() {
    this.setDataDependsProps();

    const element = document.createElement('div'); // (*)
    element.innerHTML =
      `
        <div class="column-chart ${this.dataIsloading}" style="--chart-height: ${this.chartHeight}">
          ${this.createTitle()}
          ${this.createContainer()}
        </div>
      `;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }
  getData (dateFrom, dateTo) {
    this.url.searchParams.set('from', dateFrom.toISOString());
    this.url.searchParams.set('to', dateTo.toISOString());
    return fetchJson(this.url);
  }
  async update(dateFrom, dateTo) {
    const data = await this.getData(dateFrom, dateTo);

    this.data = Object.entries(data);

    this.setDataDependsProps();
    this.element.classList.remove(ColumnChart.isloading);
    this.subElements.body.innerHTML = this.createChart();
    this.subElements.header.innerHTML = this.formatHeading(this.value);
    this.subElements = this.getSubElements();

    return data;
  }
  getSubElements() {
    const elements = this.element.querySelectorAll(`[data-element]`);
    return [...elements].reduce((result, subElement) => {
      result[subElement.dataset.element] = subElement;
      return result;
    }, {});
  }
  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
