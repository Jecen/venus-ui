import { LitElement, html } from '@polymer/lit-element';
// import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';


export default class LCDNumber extends LitElement {
  static get properties() {
    return {
      value: Number,
      color: String,
      size: Number,
      background: String,
      defaultColor: String
    };
  }

  constructor() {
    super();
    this.value = 1;
    this.color = '#999';
    this.size = 12;
    this.background = '#fff';
    this.defaultColor = '#ccc';
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open' });
    this.classList.add('pending');
    return root;
  }

  _render() {
    return html`
    <style>:host {display: inline-block;position: relative;padding: 5px;}:host(.pending) {opacity: 0;}.wrapper {position: relative;pointer-events: none;}svg {display: block;}</style>
    <div class="wrapper"><svg id="svg"></svg></div>
    `;
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this._didRender());
  }

  setAttr(tag, attr){
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attr) {
        for (const p in attr) {
            if (attr.hasOwnProperty(p)) {
                n.setAttributeNS(null, p, attr[p]);
            }
        }
    }
    return n
  }

  getNumber(svg, index, str, w) {
    console.log(index, str)
    const offset_Y = this.size * 0.1;
    const offset_X = this.size / 2 * 0.2 + w * index;
    const cell_w = this.size * 0.8 / 2
    const cell_y = this.size * 0.06
    const half = this.size / 2 - offset_Y
    const offset = this.size * 0.02
    const format = {
       "0": [1,1,1,1,1,1,0], 
       "1": [0,1,1,0,0,0,0], 
       "2": [1,1,0,1,1,0,1],
       "3": [1,1,1,1,0,0,1],
       "4": [0,1,1,0,0,1,1],
       "5": [1,0,1,1,0,1,1],
       "6": [1,0,1,1,1,1,1],
       "7": [1,1,1,0,0,0,0],
       "8": [1,1,1,1,1,1,1],
       "9": [1,1,1,1,0,1,1]
    }
    const paths = [
        `M${offset_X + offset} ${offset_Y} 
        L${offset_X + cell_y} ${offset_Y - cell_y / 2} 
        L${offset_X + cell_w - cell_y} ${offset_Y - cell_y / 2} 
        L${offset_X + cell_w - offset} ${offset_Y} 
        L${offset_X + cell_w - cell_y} ${offset_Y + cell_y / 2} 
        L${offset_X + cell_y} ${offset_Y + cell_y / 2} 
        Z`,
        `M${offset_X + cell_w} ${offset_Y + offset} 
        L${offset_X + cell_w + cell_y / 2} ${offset_Y + cell_y} 
        L${offset_X + cell_w + cell_y / 2} ${offset_Y + cell_w - cell_y} 
        L${offset_X + cell_w} ${offset_Y + cell_w - offset} 
        L${offset_X + cell_w - cell_y / 2} ${offset_Y + cell_w - cell_y}
        L${offset_X + cell_w - cell_y / 2} ${offset_Y + cell_y} 
        Z`,
        `M${offset_X + cell_w} ${offset_Y + offset + half} 
        L${offset_X + cell_w + cell_y / 2} ${offset_Y + cell_y + half} 
        L${offset_X + cell_w + cell_y / 2} ${offset_Y + cell_w - cell_y + half} 
        L${offset_X + cell_w} ${offset_Y + cell_w - offset + half} 
        L${offset_X + cell_w - cell_y / 2} ${offset_Y + cell_w - cell_y + half}
        L${offset_X + cell_w - cell_y / 2} ${offset_Y + cell_y + half} 
        Z`,
        `M${offset_X + offset} ${offset_Y + half * 2} 
        L${offset_X + cell_y} ${offset_Y - cell_y / 2 + half * 2} 
        L${offset_X + cell_w - cell_y} ${offset_Y - cell_y / 2 + half * 2} 
        L${offset_X + cell_w - offset} ${offset_Y + half * 2} 
        L${offset_X + cell_w - cell_y} ${offset_Y + cell_y / 2 + half * 2} 
        L${offset_X + cell_y} ${offset_Y + cell_y / 2 + half * 2} 
        Z`,
        `M${offset_X } ${offset_Y + offset + half} 
        L${offset_X + cell_y / 2} ${offset_Y + cell_y + half} 
        L${offset_X + cell_y / 2} ${offset_Y + cell_w - cell_y + half} 
        L${offset_X} ${offset_Y + cell_w - offset + half} 
        L${offset_X - cell_y / 2} ${offset_Y + cell_w - cell_y + half}
        L${offset_X - cell_y / 2} ${offset_Y + cell_y + half} 
        Z`,
        `M${offset_X} ${offset_Y + offset} 
        L${offset_X + cell_y / 2} ${offset_Y + cell_y} 
        L${offset_X + cell_y / 2} ${offset_Y + cell_w - cell_y} 
        L${offset_X} ${offset_Y + cell_w - offset} 
        L${offset_X - cell_y / 2} ${offset_Y + cell_w - cell_y}
        L${offset_X - cell_y / 2} ${offset_Y + cell_y} 
        Z`,
        `M${offset_X + offset} ${offset_Y + half} 
        L${offset_X + cell_y} ${offset_Y - cell_y / 2 + half} 
        L${offset_X + cell_w - cell_y} ${offset_Y - cell_y / 2 + half} 
        L${offset_X + cell_w - offset} ${offset_Y + half} 
        L${offset_X + cell_w - cell_y} ${offset_Y + cell_y / 2 + half} 
        L${offset_X + cell_y} ${offset_Y + cell_y / 2 + half} 
        Z`,
    ]
    const currentFormat = format[str]
    const nodes = []
    currentFormat.forEach((flag, index) => {
        // console.log(flag, index)
        nodes.push(this.setAttr('path', {
            d: paths[index],
            style: `fill:${flag > 0 ? this.color: this.defaultColor};`
        }))
    })

    nodes.forEach(n => {
        svg.appendChild(n);
    })
  }

  _didRender() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const str = this.value.toString()
    const count = str.length;
    const font_padding = this.size * 0.2;
    const w = count * (this.size / 2 + font_padding / 2 + 2);
    const h = this.size;
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    // TODO 把小数点剔除并记录小数点的位置

    for(let i = 0; i < count ; i++) {
        const cell_w = this.size / 2;
        const currentStr = str.charAt(i);
        const temp = this.setAttr('rect', {
            x: w / count * i,
            y: 0,
            width: w / count,
            height: h,
            style: `fill:${this.background};`
        })
        
        svg.appendChild(temp);
    }
    for(let i = 0; i < count ; i++) {
        const currentStr = str.charAt(i);
        const number_n = this.getNumber(svg, i, currentStr, w / count)
    }

    this.classList.remove('pending');
  }
}
customElements.define('lcd-number', LCDNumber);
