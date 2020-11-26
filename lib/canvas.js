(function () {
  'use strict';
  var canvas = function () {
    try {
      $(`${this.containerSelector} .main-panel`).append(`<div class="canvas-holder" id="canvas-holder"><canvas id="c"></canvas></div>`);
      const fabricCanvas = new fabric.Canvas('c').setDimensions({
        width: 800,
        height: 600
      })

      fabricCanvas.originalW = fabricCanvas.width;
      fabricCanvas.originalH = fabricCanvas.height;

      // set up selection style
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.borderColor = '#C00000';
      fabric.Object.prototype.cornerColor = '#C00000';
      fabric.Object.prototype.cornerStrokeColor = '#FFF';
      fabric.Object.prototype.padding = 0;

      // retrieve active selection to react state
      fabricCanvas.on('selection:created', (e) => this.setActiveSelection(e.target))
      fabricCanvas.on('selection:updated', (e) => this.setActiveSelection(e.target))
      fabricCanvas.on('selection:cleared', (e) => this.setActiveSelection(null))

      fabricCanvas.on('object:modified', () => {
        console.log('trigger: modified')
        let currentState = this.canvas.toJSON();
        this.history.push(JSON.stringify(currentState));
      })

      const savedCanvas = saveInBrowser.load('canvasEditor');
      if (savedCanvas) {
        fabricCanvas.loadFromJSON(savedCanvas, fabricCanvas.renderAll.bind(fabricCanvas));
      }

      setTimeout(() => {
        let currentState = fabricCanvas.toJSON();
        this.history.push(JSON.stringify(currentState));
      }, 1000);

      return fabricCanvas;
    } catch (_) {
      console.error("can't create canvas instance");
      return null;
    }
  }

  window.ImageEditor.prototype.initializeCanvas = canvas;
})();