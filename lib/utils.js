/**
 * Define util functions
 */

/**
 * Get fabric js gradient from colorstops, orientation and angle
 * @param {Array} handlers array of color stops
 * @param {Number} width gradient width
 * @param {Number} height gradient height
 * @param {String} orientation orientation type linear/radial
 * @param {Number} angle the angle of linear gradient
 */
const generateFabricGradientFromColorStops = (handlers, width, height, orientation, angle) => {
  const gradAngleToCoords = (angle) => {
    let anglePI = (-parseInt(angle, 10)) * (Math.PI / 180)
    let angleCoords = {
      'x1': (Math.round(50 + Math.sin(anglePI) * 50)) / 100,
      'y1': (Math.round(50 + Math.cos(anglePI) * 50)) / 100,
      'x2': (Math.round(50 + Math.sin(anglePI + Math.PI) * 50)) / 100,
      'y2': (Math.round(50 + Math.cos(anglePI + Math.PI) * 50)) / 100,
    }

    return angleCoords
  }

  let bgGradient = {};
  let colorStops = [];

  for (var i in handlers) {
    colorStops.push({
      id: i,
      color: handlers[i].color,
      offset: handlers[i].position / 100,
    })
  }

  if (orientation === 'linear') {
    let angleCoords = gradAngleToCoords(angle)
    bgGradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: angleCoords.x1 * width,
        y1: angleCoords.y1 * height,
        x2: angleCoords.x2 * width,
        y2: angleCoords.y2 * height
      },
      colorStops,
    })
  } else if (orientation === 'radial') {
    bgGradient = new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: width / 2,
        y1: height / 2,
        r1: 0,
        x2: width / 2,
        y2: height / 2,
        r2: width / 2
      },
      colorStops: colorStops
    });
  }

  return bgGradient
}

const getRealBBox = async (obj) => {

  let tempCanv, ctx, w, h;

  // we need to use a temp canvas to get imagedata
  const getImageData = (dataUrl) => {
    if (tempCanv == null) {
      tempCanv = document.createElement('canvas');
      tempCanv.style.border = '1px solid blue';
      tempCanv.style.position = 'absolute';
      tempCanv.style.top = '-100%';
      tempCanv.style.visibility = 'hidden';
      ctx = tempCanv.getContext('2d');
      document.body.appendChild(tempCanv);
    }

    return new Promise(function (resolve, reject) {
      if (dataUrl == null) return reject();

      var image = new Image();
      image.addEventListener('load', () => {
        w = image.width;
        h = image.height;
        tempCanv.width = w;
        tempCanv.height = h;
        ctx.drawImage(image, 0, 0, w, h);
        var imageData = ctx.getImageData(0, 0, w, h).data.buffer;
        resolve(imageData, false);
      });
      image.src = dataUrl;
    });
  }


  // analyze pixels 1-by-1
  const scanPixels = (imageData) => {
    var data = new Uint32Array(imageData),
      x, y, y1, y2, x1 = w,
      x2 = 0;

    // y1
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        if (data[y * w + x] & 0xff000000) {
          y1 = y;
          y = h;
          break;
        }
      }
    }

    // y2
    for (y = h - 1; y > y1; y--) {
      for (x = 0; x < w; x++) {
        if (data[y * w + x] & 0xff000000) {
          y2 = y;
          y = 0;
          break;
        }
      }
    }

    // x1
    for (y = y1; y < y2; y++) {
      for (x = 0; x < w; x++) {
        if (x < x1 && data[y * w + x] & 0xff000000) {
          x1 = x;
          break;
        }
      }
    }

    // x2
    for (y = y1; y < y2; y++) {
      for (x = w - 1; x > x1; x--) {
        if (x > x2 && data[y * w + x] & 0xff000000) {
          x2 = x;
          break;
        }
      }
    }

    return {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      width: x2 - x1,
      height: y2 - y1
    }
  }

  let data = await getImageData(obj.toDataURL());

  return scanPixels(data);

}

/**
 * Align objects on canvas according to the pos
 * @param {Object} canvas fabric js canvas
 * @param {Array} activeSelection the array of fabric js objects
 * @param {String} pos the position to align left/center-h/right/top/center-v/bottom
 */
const alignObject = (canvas, activeSelection, pos) => {
  switch (pos) {
    case 'left':

      (async () => {
        let bound = activeSelection.getBoundingRect()
        let realBound = await getRealBBox(activeSelection)
        activeSelection.set('left', (activeSelection.left - bound.left - realBound.x1))
        activeSelection.setCoords()
        canvas.renderAll()
        canvas.trigger('object:modified')
      })()

      break

    case 'center-h':

      (async () => {
        let bound = activeSelection.getBoundingRect()
        let realBound = await getRealBBox(activeSelection)
        activeSelection.set(
          'left',
          (activeSelection.left - bound.left - realBound.x1) + (canvas.width / 2) - (realBound.width / 2)
        )
        activeSelection.setCoords()
        canvas.renderAll()
        canvas.trigger('object:modified')
      })()

      break

    case 'right':

      (async () => {
        let bound = activeSelection.getBoundingRect()
        let realBound = await getRealBBox(activeSelection)
        activeSelection.set('left', (activeSelection.left - bound.left - realBound.x1) + canvas.width - realBound.width)
        activeSelection.setCoords()
        canvas.renderAll()
        canvas.trigger('object:modified')
      })()

      break

    case 'top':

      (async () => {
        let bound = activeSelection.getBoundingRect()
        let realBound = await getRealBBox(activeSelection)
        activeSelection.set('top', (activeSelection.top - bound.top - realBound.y1))
        activeSelection.setCoords()
        canvas.renderAll()
        canvas.trigger('object:modified')
      })()

      break

    case 'center-v':

      (async () => {
        let bound = activeSelection.getBoundingRect()
        let realBound = await getRealBBox(activeSelection)
        activeSelection.set(
          'top',
          (activeSelection.top - bound.top - realBound.y1) + (canvas.height / 2) - (realBound.height / 2)
        )
        activeSelection.setCoords()
        canvas.renderAll()
        canvas.trigger('object:modified')
      })()

      break

    case 'bottom':

      (async () => {
        let bound = activeSelection.getBoundingRect()
        let realBound = await getRealBBox(activeSelection)
        activeSelection.set(
          'top',
          (activeSelection.top - bound.top - realBound.y1) + (canvas.height - realBound.height)
        )
        activeSelection.setCoords()
        canvas.renderAll()
        canvas.trigger('object:modified')
      })()

      break

    default:
      break
  }
}

/**
 * Get the filters of current image selection
 * @param {Object} activeSelection fabric js object
 */
const getCurrentEffect = (activeSelection) => {
  let updatedEffects = {
    opacity: 100,
    blur: 0,
    brightness: 50,
    saturation: 50,
    gamma: {
      r: 45,
      g: 45,
      b: 45
    }
  }

  updatedEffects.opacity = activeSelection.opacity * 100

  let hasBlur = activeSelection.filters.find(x => x.blur)
  if (hasBlur) {
    updatedEffects.blur = hasBlur.blur * 100
  }

  let hasBrightness = activeSelection.filters.find(x => x.brightness)
  if (hasBrightness) {
    updatedEffects.brightness = ((hasBrightness.brightness + 1) / 2) * 100
  }

  let hasSaturation = activeSelection.filters.find(x => x.saturation)
  if (hasSaturation) {
    updatedEffects.saturation = ((hasSaturation.saturation + 1) / 2) * 100
  }

  let hasGamma = activeSelection.filters.find(x => x.gamma)
  if (hasGamma) {
    updatedEffects.gamma.r = Math.round(hasGamma.gamma[0] / 0.022)
    updatedEffects.gamma.g = Math.round(hasGamma.gamma[1] / 0.022)
    updatedEffects.gamma.b = Math.round(hasGamma.gamma[2] / 0.022)
  }

  return updatedEffects;
}

const getUpdatedFilter = (effects, effect, value) => {
  let updatedEffects = {
    ...effects
  }
  switch (effect) {
    case 'gamma.r':
      updatedEffects.gamma.r = value
      break
    case 'gamma.g':
      updatedEffects.gamma.g = value
      break
    case 'gamma.b':
      updatedEffects.gamma.b = value
      break

    default:
      updatedEffects[effect] = value
      break
  }

  effects = updatedEffects;

  // rebuild filter array, calc values for fabric
  // blur 0-1 (def val 0), brightness, saturation -1-1 (def val: 0), gamma 0-2.2 (def val: 1)
  let updatedFilters = []

  if (effects.blur > 0) {
    updatedFilters.push(new fabric.Image.filters.Blur({
      blur: effects.blur / 100
    }));
  }

  if (effects.brightness !== 50) {
    updatedFilters.push(new fabric.Image.filters.Brightness({
      brightness: ((effects.brightness / 100) * 2) - 1
    }));
  }

  if (effects.saturation !== 50) {
    updatedFilters.push(new fabric.Image.filters.Saturation({
      saturation: ((effects.saturation / 100) * 2) - 1
    }));
  }

  if (
    effects.gamma.r !== 45 ||
    effects.gamma.g !== 45 ||
    effects.gamma.b !== 45
  ) {
    updatedFilters.push(new fabric.Image.filters.Gamma({
      gamma: [
        Math.round((effects.gamma.r * 0.022) * 10) / 10,
        Math.round((effects.gamma.g * 0.022) * 10) / 10,
        Math.round((effects.gamma.b * 0.022) * 10) / 10
      ]
    }));
  }

  return updatedFilters;
}

const getActiveFontStyle = (activeSelection, styleName) => {
  if (activeSelection.getSelectionStyles && activeSelection.isEditing) {
    let styles = activeSelection.getSelectionStyles()
    if (styles.find(o => o[styleName] === '')) {
      return ''
    }

    return styles[0][styleName]
  }

  return activeSelection[styleName] || ''
}


const setActiveFontStyle = (activeSelection, styleName, value) => {
  if (activeSelection.setSelectionStyles && activeSelection.isEditing) {
    let style = {}
    style[styleName] = value;
    activeSelection.setSelectionStyles(style)
    activeSelection.setCoords()
  } else {
    activeSelection.set(styleName, value)
  }
}

const downloadImage = (data, extension = 'png', mimeType = 'image/png') => {
  const imageData = data.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const byteCharacters = atob(imageData);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const file = new Blob([byteArray], {
    type: mimeType + ';base64'
  });
  const fileURL = window.URL.createObjectURL(file);

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file);
    return;
  }
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = 'image.' + extension;
  link.dispatchEvent(new MouseEvent('click'));
  setTimeout(() => {
    // for Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(fileURL);
  }, 60);
}


const downloadSVG = (SVGmarkup) => {
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVGmarkup);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'image.svg';
  link.dispatchEvent(new MouseEvent('click'));
  setTimeout(() => {
    // for Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(url);
  }, 60);
}