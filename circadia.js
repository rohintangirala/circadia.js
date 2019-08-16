class Circadia {
  constructor() {
    this.styles = {
      background: 'rgb(0, 0, 0)'
    };

    this.originalDom = document.body.cloneNode(true);

    if (localStorage.getItem('activated' === null)) {
      localStorage.setItem('activated', 'false');
    }

    if (localStorage.getItem('activated') === 'true') {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    this.attachStyles(this.styles);
    this.adjustColors();
    localStorage.setItem('activated', 'true');
  }

  deactivate() {
    document.body = this.originalDom;
    localStorage.setItem('activated', 'false');
  }

  adjustColors() {
    document.body.querySelectorAll('*').forEach(node => {
      let nodeComputedStyle = window.getComputedStyle(node);
      let parentNodeComputedStyle = window.getComputedStyle(node.parentNode);

      if (nodeComputedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' && parentNodeComputedStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
        let originalColor = window.getComputedStyle(node).color;
        let parsedColor = this.parseRgb(originalColor);
        let luminance = this.relativeLuminance(parsedColor);
        let contrastRatio = this.contrast(luminance);

        if (contrastRatio < 4.5) {
          let rgbBrightened = this.brighten(parsedColor);
          let formattedColor = `rgb(${rgbBrightened[0]}, ${rgbBrightened[1]}, ${rgbBrightened[2]})`;
          node.style.color = formattedColor;
        }
      }
    });
  }

  attachStyles(styles) {
    Object.keys(styles).forEach((key, i) => {
      document.body.style[key] = styles[key];
    });
  }

  parseRgb(color) {
    let parsed = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

    if (parsed) {
      return [parsed[1], parsed[2], parsed[3]];
    };
  }

  relativeLuminance(rgb) {
    let rgbScaled = rgb.map(x => x / 255);
    let rgbAdjusted = this.adjustRgb(rgbScaled);
    let luminance = rgbAdjusted[0] * 0.2126 + rgbAdjusted[1] * 0.7152 + rgbAdjusted[2] * 0.0722;

    return luminance;
  }

  contrast(luminance) {
    let ratio = (luminance + 0.05) / (0.05);

    return ratio;
  }

  adjustRgb(rgb) {
    let r = rgb[0] <= 0.03928 ? rgb[0] / 12.92 : Math.pow(((rgb[0] + 0.055) / 1.055), 2.4);
    let g = rgb[1] <= 0.03928 ? rgb[1] / 12.92 : Math.pow(((rgb[1] + 0.055) / 1.055), 2.4);
    let b = rgb[2] <= 0.03928 ? rgb[2] / 12.92 : Math.pow(((rgb[2] + 0.055) / 1.055), 2.4);
    let adjusted = [r, g, b];

    return adjusted;
  }

  brighten(rgb) {
    let maximumValue = Math.max(...rgb);
    let diff = 255 - maximumValue;
    let rgbBrightened = rgb.map(x => parseInt(x) + diff);

    return rgbBrightened;
  }
}
