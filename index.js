import LCDNumber from './src/lcd-number.js'
import VenusWaves from './src/venus-waves.js'
// import waves from './src/waves'

const onload = function () {
    // For native Imports, manually fire WebComponentsReady so user code
    // can use the same code path for native and polyfill'd imports.
    if (!window.HTMLImports) {
        document.dispatchEvent(
            new CustomEvent('WebComponentsReady', {
                bubbles: true,
            })
        );
    }
};
const webComponentsSupported = (
    'registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template')
);
if (!webComponentsSupported) {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//unpkg.com/@webcomponents/webcomponentsjs@next/webcomponents-loader.js';
    script.onload = onload;
    document.head.appendChild(script);
} else {
    onload();
}

export default {
    'lcd-number': LCDNumber,
    'venus-waves': VenusWaves
}