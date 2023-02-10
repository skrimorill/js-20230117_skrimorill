export default class DoubleSlider {
  constructor ({min, max, formatValue, selected = {} } = {}) {       
    this.min = min ?? 0
    this.max = max ?? 200
    this.rangeValue = this.max - this.min > 0 ? this.max - this.min : 1
    this.formatValue = formatValue
    this.from = selected?.from ?? min
    this.to = selected?.to ?? max
}

get element(){
    if (!this._element) {
      this._element = document.createElement("div")
      this._element.className = "range-slider"
      this._element.innerHTML = this.sliderInnerHTML

      this._element.ondragstart = () => false

      this.subElements.thumbLeft.addEventListener("pointerdown", this.onPointerDown)
      this.subElements.thumbRight.addEventListener("pointerdown", this.onPointerDown)

      this.updatePoints()
    }

    return this._element
}

get sliderInnerHTML() {
  return `<span data-element="from">${this.formatValue ? this.formatValue(this.from) : this.from}</span>
            <div data-element="inner" class="range-slider__inner">
              <span data-element="progress" class="range-slider__progress"></span>
              <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
              <span data-element="thumbRight" class="range-slider__thumb-right"></span>
            </div>
          <span data-element="to">${this.formatValue ? this.formatValue(this.to) : this.to }</span>`

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

onPointerDown = (event) => {
  event.preventDefault()
  const thumb = event.target

  this.dragging = thumb
  this.element.classList.add('range-slider_dragging')

  document.addEventListener("pointermove", this.onPointerMove)
  document.addEventListener("pointerup", this.onPointerUp)
}

onPointerMove = (event) => {
  event.preventDefault()

  const { left: innerLeft, right: innerRight, width } = this.subElements.inner.getBoundingClientRect();

  if (this.dragging === this.subElements.thumbLeft) {
    let newLeft = (event.clientX - innerLeft) / width
    if (newLeft < 0) {
      newLeft = 0;
    }
    newLeft *= 100
    const right = parseFloat(this.subElements.thumbRight.style.right)

    if (newLeft + right > 100) {
      newLeft = 100 - right
    }

    this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%'
    this.from = Math.round(this.min + parseFloat(newLeft) * this.rangeValue / 100)
    this.subElements.from.innerHTML = this.formatValue ? this.formatValue(this.from) : this.from
  }

  if (this.dragging === this.subElements.thumbRight) {
    let newRight = (innerRight - event.clientX) / width
    if (newRight < 0) {
      newRight = 0
    }
    newRight *= 100

    const left = parseFloat(this.subElements.thumbLeft.style.left);

    if (left + newRight > 100) {
      newRight = 100 - left
    }
    this.dragging.style.right = this.subElements.progress.style.right = newRight + '%'
    this.to = Math.round(this.max - parseFloat(newRight) * this.rangeValue / 100)
    this.subElements.to.innerHTML = this.formatValue ? this.formatValue(this.to) : this.to
  }
}

onPointerUp = (event) => {
  this.element.classList.remove('range-slider_dragging')

  document.removeEventListener("pointermove", this.onPointerMove)
  document.removeEventListener("pointerup", this.onPointerUp)

  this.element.dispatchEvent(new CustomEvent('range-select', {
    detail: { from: this.from, to: this.to},
    bubbles: true
  }))
}

updatePoints() {
  const left = Math.floor((this.from - this.min) / this.rangeValue * 100) + '%'
  const right = Math.floor((this.max - this.to) / this.rangeValue * 100) + '%'

  this.subElements.progress.style.left = left
  this.subElements.progress.style.right = right

  this.subElements.thumbLeft.style.left = left
  this.subElements.thumbRight.style.right = right
}

remove() {
  if (this._element) {
    this.element.remove()
  }
}

destroy() {
  this.remove()
  this._element = null
  this._subElements = null
    
  document.removeEventListener("pointermove", this.onPointerMove)   
  document.removeEventListener("pointerup",  this.onPointerUp) 
  }
}
