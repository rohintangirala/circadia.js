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
      this.activate()
    } else {
      this.deactivate()
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
    document.body.querySelectorAll('*').forEach((node) => {
      var nodeComputedStyle = window.getComputedStyle(node);
      var parentNodeComputedStyle = window.getComputedStyle(node.parentNode);

      if (nodeComputedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' && parentNodeComputedStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
        var originalColor = window.getComputedStyle(node).color;
        var parsedColor = this.parseRgb(originalColor);
        var luminance = this.relativeLuminance(parsedColor);
        var contrastRatio = this.contrast(luminance);

        if (contrastRatio < 4.5) {
          var rgbBrightened = this.brighten(parsedColor);
          var formattedColor = `rgb(${rgbBrightened[0]}, ${rgbBrightened[1]}, ${rgbBrightened[2]})`;
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
    var parsed = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

    if (parsed) {
      return [parsed[1], parsed[2], parsed[3]];
    }
  }

  relativeLuminance(rgb) {
    var rgbScaled = rgb.map(x => x/255);
    var rgbAdjusted = this.adjustRgb(rgbScaled);
    var luminance = rgbAdjusted[0]*0.2126 + rgbAdjusted[1]*0.7152 + rgbAdjusted[2]*0.0722;

    return luminance;
  }

  contrast(luminance) {
    var ratio = (luminance + 0.05) / (0.05);

    return ratio;
  }

  adjustRgb(rgb) {
    var r = rgb[0] <= 0.03928 ? rgb[0]/12.92 : Math.pow(((rgb[0]+0.055)/1.055), 2.4);
    var g = rgb[1] <= 0.03928 ? rgb[1]/12.92 : Math.pow(((rgb[1]+0.055)/1.055), 2.4);
    var b = rgb[2] <= 0.03928 ? rgb[2]/12.92 : Math.pow(((rgb[2]+0.055)/1.055), 2.4);
    var adjusted = [r, g, b];
    
    return adjusted;
  }

  brighten(rgb) {
    var maximumValue = Math.max(...rgb);
    var diff = 255 - maximumValue;
    var rgbBrightened = rgb.map(x => parseInt(x) + diff);

    return rgbBrightened;
  }
}

