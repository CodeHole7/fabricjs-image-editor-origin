(function () {
  'use strict';
  var canvasSettings = function () {
    const _self = this;
    $(`${this.containerSelector} .main-panel`).append(`<div class="toolpanel" id="background-panel"><p class="title">Canvas Settings</p></div>`);

    // set dimension section
    $(`${this.containerSelector} .toolpanel#background-panel`).append(`
      <div class="canvas-size-setting">
        <p>Canvas Size</p>
        <input type="number" min="100" id="input-width" value="640"/>
        <span>X</span>
        <input type="number" min="100" id="input-height" value="480"/>
      </div>
    `);

    var setDimension = () => {
      try {
        let width = $(`${this.containerSelector} .toolpanel#background-panel #input-width`).val();
        let height = $(`${this.containerSelector} .toolpanel#background-panel #input-height`).val();
        _self.canvas.setWidth(width)
        _self.canvas.originalW = width
        _self.canvas.setHeight(height)
        _self.canvas.originalH = height
        _self.canvas.renderAll()
        _self.canvas.trigger('object:modified')
      } catch (_) {}
    }

    $(`${this.containerSelector} .toolpanel#background-panel #input-width`).change(setDimension)
    $(`${this.containerSelector} .toolpanel#background-panel #input-height`).change(setDimension)
    // end set dimension section

    // background color
    $(`${this.containerSelector} .toolpanel#background-panel`).append(`
      <div class="color-settings">
        <p>
        <input type="radio" id="color-fill" name="background" value="color-fill">
        <label for="color-fill" style="padding-bottom: 10px">Color Fill</label><br>
        </p>

        <input id="color-picker" value='black'/><br>

        <p>
        <input type="radio" id="gradient-fill" name="background" value="gradient-fill">
        <label for="gradient-fill" style="padding-bottom: 10px">Gradient Fill</label><br>
        </p>
        <div id="gradient-picker"></div>
      </div>
    `)

    $(`${this.containerSelector} .toolpanel#background-panel #color-picker`).spectrum({
      type: "color",
      showInput: "true",
      showInitial: "true",
      allowEmpty: "false"
    });

    $(`${this.containerSelector} .toolpanel#background-panel #color-picker`).change(function () {
      let enabled = $(`${_self.containerSelector} .toolpanel#background-panel #color-fill`).is(':checked')
      if (!enabled) return;
      let color = $(this).val();
      console.log(color);
      try {
        _self.canvas.backgroundColor = color;
        _self.canvas.renderAll();
      } catch (_) {
        console.error("can't change canvas background fill color");
      }
    })

    const gp = new Grapick({
      el: `${this.containerSelector} .toolpanel#background-panel #gradient-picker`,
      colorEl: '<input id="colorpicker"/>' // I'll use this for the custom color picker
    });

    gp.setColorPicker(handler => {

      const el = handler.getEl().querySelector('#colorpicker');

      $(el).spectrum({
        color: handler.getColor(),
        showAlpha: true,
        change(color) {
          handler.setColor(color.toRgbString());
        },
        move(color) {
          handler.setColor(color.toRgbString(), 0);
        }
      });
    });

    gp.addHandler(0, 'red');
    gp.addHandler(100, 'blue');

    // Do stuff on change of the gradient
    gp.on('change', complete => {
      let enabled = $(`${_self.containerSelector} .toolpanel#background-panel #gradient-fill`).is(':checked')
      if (!enabled) return;
      let gradient = generateFabricGradientFromColorStops(gp.getHandlers(), _self.canvas.width, _self.canvas.height);
      _self.canvas.setBackgroundColor(gradient)
      _self.canvas.renderAll()
    })
  }

  window.ImageEditor.prototype.initializeCanvasSettingPanel = canvasSettings;
})()