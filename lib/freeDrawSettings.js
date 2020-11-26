(function () {
  'use strict';

  var freeDrawSettings = function () {
    let width = 1;
    let style = 'pencil';
    let color = 'black';

    const _self = this;
    $(`${this.containerSelector} .main-panel`).append(`<div class="toolpanel" id="draw-panel"><p class="title">Free Draw</p></div>`);

    // set dimension section
    $(`${this.containerSelector} .toolpanel#draw-panel`).append(`
      <div>
        <p>
          <label>Brush Width</label>
          <input type="number" min="1" value="1" id="input-brush-width"/>
        </p>
        <p>
          <label>Brush Type</label>
          <select id="input-brush-type">
            <option value="pencil" selected>Pencil</option>
            <option value="circle">Circle</option>
            <option value="spray">Spray</option>
          </select>
        </p>
        <p>
          <label>Brush Color</label>
          <input id="color-picker" value='black'/>
        </p>
      </div>
    `);

    let updateBrush = () => {
      try {
        switch (style) {
          case 'circle':
            _self.canvas.freeDrawingBrush = new fabric.CircleBrush(_self.canvas)
            break

          case 'spray':
            _self.canvas.freeDrawingBrush = new fabric.SprayBrush(_self.canvas)
            break

          default:
            _self.canvas.freeDrawingBrush = new fabric.PencilBrush(_self.canvas)
            break
        }

        _self.canvas.freeDrawingBrush.width = width;
        _self.canvas.freeDrawingBrush.color = color;

      } catch (_) {}
    }

    $(`${this.containerSelector} .toolpanel#draw-panel #input-brush-width`).change(function () {
      try {
        width = parseInt($(this).val());
        updateBrush();
      } catch (_) {}
    })

    $(`${this.containerSelector} .toolpanel#draw-panel #input-brush-type`).change(function () {
      style = $(this).val();
      updateBrush();
    })

    $(`${this.containerSelector} .toolpanel#draw-panel #color-picker`).spectrum({
      type: "color",
      showInput: "true",
      showInitial: "true",
      allowEmpty: "false"
    });

    $(`${this.containerSelector} .toolpanel#draw-panel #color-picker`).change(function () {
      try {
        color = $(this).val();
        updateBrush();
      } catch (_) {}
    })
  }

  window.ImageEditor.prototype.initializeFreeDrawSettings = freeDrawSettings;
})();