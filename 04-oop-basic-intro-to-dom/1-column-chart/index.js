export default class ColumnChart {
  chartHeight = 50;

  constructor({data = [], label = '', value = 0, link = '', formatHeading = (data) => data} = {}) {
    this.data = data
    this.label = label
    this.link = link
    this.value = formatHeading(value)
    

    this.render();
    this.initEventListeners();
  }

  hasData() {
    return this.data.length > 0
  }

  getTemplate() {
    const chartLoading = this.hasData() ? "" : "column-chart_loading"

    return `
    <div class="column-chart ${chartLoading}"" style="--chart-height: 50">
        <div class='column-chart__title'>
        Total ${this.label}
        ${this.getLink()}
        </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
        ${this.bodyGraphTemplate}
        </div>
      </div>
    </div>
    `;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

  }

  get bodyGraphTemplate() {
    return this.getColumnProps().map(prop => `<div style="--value: ${prop.value}" data-tooltip="${prop.percent}"></div>`).join('');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;
  
    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      }
  })
}

  getLink () {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  update(data) {
    this.data = data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}




const ordersChart = new ColumnChart() 

const salesChart = new ColumnChart() 

const customersChart = new ColumnChart()


