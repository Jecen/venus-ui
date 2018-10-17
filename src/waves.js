
function createSvg(tag, attr) {  
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

const waves = (el, option = {height: 60, num: 4}) => {
    const width = el.clientWidth
    const {height, num} = option
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('height',  `${height}px`)
    svg.setAttribute('width',  '100%')
    svg.style = `
        position: absolute;
        bottom: 0;
    `
    const dh = 2
    const offsetH = 20
    for (let index = 1; index < num + 1; index++) {
        const offset = parseInt(Math.random(1) * 100)
        const wavesMun = 2 * index
        const wavesSpeed = parseInt(Math.random() * 50) 

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
        // console.log(getWavesPath(wavesMun))
        let pathData =  [
            'M', 0, index * dh + offsetH,
            ...getWavesPath(),
            'L',width * 8, index * dh + offsetH,
            'L',width * 8, height,
            'L',0, height,
            'Z'
        ].join(' ');
        svg.append(createSvg('path', {
            d: pathData,
            style: `--d: ${wavesSpeed}s;--dw:${offset}%;fill: rgba(123,22,3, 0.3);`,
            width: '800%',
            height: '100%',
            class: 'animation'
        }))
    }
    
    

    el.append(svg)
}
window.waves = waves
export default  waves