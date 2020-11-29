/**
 * Canvas section management of image editor
 */
(function () {
  'use strict';
  var canvas = function () {
    try {
      $(`${this.containerSelector} .main-panel`).append(`<div class="canvas-holder" id="canvas-holder"><div class="content"><canvas id="c"></canvas></div></div>`);
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

      // snap to an angle on rotate if shift key is down
      fabricCanvas.on('object:rotating', (e) => {
        if (e.e.shiftKey) {
          e.target.snapAngle = 15;
        } else {
          e.target.snapAngle = false;
        }
      })

      fabricCanvas.on('object:modified', () => {
        console.log('trigger: modified')
        let currentState = this.canvas.toJSON();
        this.history.push(JSON.stringify(currentState));
      })

      const savedCanvas = saveInBrowser.load('canvasEditor');
      if (savedCanvas) {
        fabricCanvas.loadFromJSON(savedCanvas, fabricCanvas.renderAll.bind(fabricCanvas));
      }

      // move objects with arrow keys
      (() => document.addEventListener('keydown', (e) => {
        const key = e.which || e.keyCode;
        let activeObject;

        if (document.querySelectorAll('textarea:focus, input:focus').length > 0) return;

        if (key === 37 || key === 38 || key === 39 || key === 40) {
          e.preventDefault();
          activeObject = fabricCanvas.getActiveObject();
          if (!activeObject) {
            return;
          }
        }

        if (key === 37) {
          activeObject.left -= 1;
        } else if (key === 39) {
          activeObject.left += 1;
        } else if (key === 38) {
          activeObject.top -= 1;
        } else if (key === 40) {
          activeObject.top += 1;
        }

        if (key === 37 || key === 38 || key === 39 || key === 40) {
          activeObject.setCoords();
          fabricCanvas.renderAll();
          fabricCanvas.trigger('object:modified');
        }
      }))();

      // delete object on del key
      (() => {
        document.addEventListener('keydown', (e) => {
          const key = e.which || e.keyCode;
          if (
            key === 46 &&
            document.querySelectorAll('textarea:focus, input:focus').length === 0
          ) {

            fabricCanvas.getActiveObjects().forEach(obj => {
              fabricCanvas.remove(obj);
            });

            fabricCanvas.discardActiveObject().requestRenderAll();
            fabricCanvas.trigger('object:modified')
          }
        })
      })();

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