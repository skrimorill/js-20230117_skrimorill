class Tooltip {

  static instance

  shear = 10

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this
    }
    return Tooltip.instance
  }

  initialize () {
    document.addEventListener("pointerover", this.pointerOver)    
    document.addEventListener("pointerout", this.pointerOut)  
  }

  
  remove() {
    if (this._element) {
      this.element.remove()
    }
  }

  destroy() {
    this.remove()
    this._element = null
    document.removeEventListener("pointerover", this.pointerOver)    
    document.removeEventListener("pointerout", this.pointerOut)   
    document.removeEventListener("pointermove", this.pointerMove)   
  }

  render(label) {
    this.element.innerHTML = label
    document.body.append(this.element)    
  }

  pointerOver = (event) => {
    const tooltipLabel = event.target?.dataset?.tooltip

    if (tooltipLabel) {
      this.render(tooltipLabel)
      this.tooltipIsShow = true
      document.addEventListener("pointermove", this.pointerMove)  
    }
  }

  pointerOut = (event) => {
    if (this.tooltipIsShow) {
      this.remove()
      this.tooltipIsShow = false
      document.removeEventListener("pointermove", this.pointerMove)  
    }
  }

  pointerMove = (event) => {
    this.element.style.left = event.pageX + shear + 'px';
    this.element.style.top =  event.pageY + shear + 'px';
  }

  get element() {
    if (!this._element) {
      this._element = document.createElement("div")
      this._element.className = "tooltip"
    }

    return this._element
  }
}

export default Tooltip;
