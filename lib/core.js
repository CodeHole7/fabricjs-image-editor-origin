(function () {
  'use strict';
  var ImageEditor = function (containerSelector) {
    this.containerSelector = containerSelector;
    this.containerEl = $(containerSelector);

    this.containerEl.addClass('default-container');

    this.canvas = null;
    this.activeTool = null;
    this.activeSelection = null;

    this.setActiveTool = (id) => {
      this.activeTool = id;
      $(`${containerSelector} .toolpanel`).removeClass('visible');
      if (id !== 'select' || (id == 'select' && this.activeSelection)) {
        $(`${containerSelector} .toolpanel#${id}-panel`).addClass('visible');
        if (id === 'select') {
          console.log('selection')
          $(`${containerSelector} .toolpanel#${id}-panel`).attr('class', `toolpanel visible type-${this.activeSelection.type}`)
        }
      }

      this.canvas.isDrawingLineMode = false;
      this.canvas.isDrawingPathMode = false;
      this.canvas.isDrawingMode = false;
      this.canvas.isDrawingTextMode = false;

      this.canvas.defaultCursor = 'default';
      this.canvas.selection = true;
      this.canvas.forEachObject(o => {
        o.selectable = true;
        o.evented = true;
      })

      switch (id) {
        case 'draw':
          this.canvas.isDrawingMode = true;
          break;
        case 'line':
          this.canvas.isDrawingLineMode = true
          this.canvas.defaultCursor = 'crosshair'
          this.canvas.selection = false
          this.canvas.forEachObject(o => {
            o.selectable = false
            o.evented = false
          });
          break;
        case 'path':
          this.canvas.isDrawingPathMode = true
          this.canvas.defaultCursor = 'crosshair'
          this.canvas.selection = false
          this.canvas.forEachObject(o => {
            o.selectable = false
            o.evented = false
          });
          break;
        case 'textbox':
          this.canvas.isDrawingTextMode = true
          this.canvas.defaultCursor = 'crosshair'
          this.canvas.selection = false
          this.canvas.forEachObject(o => {
            o.selectable = false
            o.evented = false
          });
          break;
        case 'upload':
          $(`${this.containerSelector} #btn-image-upload`).click();
          break;
        default:
          break;
      }
    }

    this.setActiveSelection = (activeSelection) => {
      this.activeSelection = activeSelection;
      this.setActiveTool('select');
    }

    this.configUndoRedoStack = () => {
      this.history = window.UndoRedoStack();
    }

    this.init = () => {
      this.configUndoRedoStack();

      this.initializeToolbar();
      this.initializeMainPanel();

      this.initializeShapes();

      this.initializeFreeDrawSettings();
      this.initializeCanvasSettingPanel();
      this.initializeSelectionSettings();

      this.canvas = this.initializeCanvas();

      this.initializeLineDrawing(this.canvas);
      this.initializePathDrawing(this.canvas);
      this.initializeTextBoxDrawing(this.canvas);
      this.initializeUpload(this.canvas);
    }

    this.initializeMainPanel = () => {
      $(`${containerSelector}`).append('<div class="main-panel"></div>');
    }

    this.init();
  }

  window.ImageEditor = ImageEditor;
})();