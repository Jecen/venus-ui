import { LitElement, html } from '@polymer/lit-element';
// import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';


export default class Waves extends LitElement {
  static get properties() {
    return {
      num: Number, // 多少条波浪
      color: String, // 波浪颜色
      svgHeight: Number, // 相对与容器最底部的高度
      animation: String, // 是否动画
    };
  }

  constructor() {
    super();
    this.num = 4;
    this.color = 'rgba(123,22,3, 0.3)';
    this.svgHeight = 100;
    this.animation = 'infinite';
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open' });
    this.classList.add('pending');
    return root;
  }

  _render() {
    return html`
    <style>:host {display: block;position:relative;}:host(.pending){opacity:0;}.wrapper{position:relative;width:100%;height:100%;display:block;overflow:hidden;pointer-events:none;}svg{display:block;}@keyframes moveTheWave {0% {transform:translate3d(var(--dw), 0, 0);}100% {transform:translate3d(var(--dow), 0, 0); }}.animation {animation: moveTheWave var(--d) linear infinite;}.paused {animation-play-state: paused;}</style>
    <div class="wrapper" id="wrapper"></div>
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

  _getPath(index, width, height) {
    const offsetH = 20
    const dh = 2
    const offset = parseInt(Math.random(1) * 100)
    const wavesMun = 2 * index
    const wavesSpeed = parseInt(Math.random() * 30) + 10

    const getWavesPath = (path = [], i = 0) => {
        if (i < wavesMun * 4) {
            return getWavesPath([...path,
                'C', 
                width * 2 / wavesMun * i, index * dh + offsetH,
                width * 2 / wavesMun * (i + 1) , index * dh + offsetH + (i % 4 === 0 ? -30 : 30),
                width * 2 / wavesMun * (i + 2), index * dh + offsetH], i + 2)
        } else {
            return path
        }
    }
    const pathData =  [
        'M', 0, index * dh + offsetH,
        ...getWavesPath(),
        'L',width * 8, index * dh + offsetH,
        'L',width * 8, height,
        'L',0, height,
        'Z'
    ].join(' ');
    return {
      d: pathData,
      style: `--d: ${wavesSpeed}s;--dw:${-offset}%;--dow:${-offset - 400}%;fill: ${this.color};`
    }
  }

  _createSvg(tag, attr) {  
    if(!document.createElementNS) return;//防止IE8报错  
    let el = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for(let key in attr) {
        switch(key) {
            case 'xlink:href'://文本路径加属性特有
                el.setAttributeNS('http://www.w3.org/1999/xlink', key, attr[key]); 
                break;
            default:
                el.setAttribute(key, attr[key])
        }
    }  
   return el
}

  _didRender() {
    const wrapper = this.shadowRoot.getElementById('wrapper')
    const width = wrapper.clientWidth
    const { svgHeight, num, animation } = this
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('height',  `${this.svgHeight}px`)
    svg.setAttribute('width',  '100%')
    svg.style = ` position: absolute; bottom: 0; `
    this._clearNode(wrapper);

    for (let index = 1; index < num + 1; index++) {
      const {d, style } = this._getPath(index, width, svgHeight)
      const path = this._createSvg('path', { d, style, width: '800%', height: '100%', class: `animation ${animation === 'hover' ? "paused" : ""}` })
      svg.appendChild(path)
    }
    wrapper.appendChild(svg)
    if (this.animation === 'hover') {
      this.addEventListener('mouseenter', () => {
        const paths = svg.getElementsByTagName('path')
        console.log(paths)
        for(let i = 0; i< paths.length ; i++) {
          paths[i].classList = 'animation'
        }
      })
      this.addEventListener('mouseout', () => {
        const paths = svg.getElementsByTagName('path')
        for(let i = 0; i< paths.length ; i++) {
          paths[i].classList = 'animation paused'
        }
      })
    }
    this.classList.remove('pending');
  }
}
customElements.define('venus-waves', Waves);
