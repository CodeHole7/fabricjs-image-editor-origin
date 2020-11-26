(function () {
  var upload = function (canvas) {
    this.containerEl.append(`<input id="btn-image-upload" type="file" accept="image/*" hidden>`);
    document.querySelector(`${this.containerSelector} #btn-image-upload`).addEventListener('change', function (e) {
      if (e.target.files.length === 0) return;

      let file = e.target.files[0];
      let reader = new FileReader()

      // handle svg
      if (file.type === 'image/svg+xml') {
        reader.onload = (f) => {
          fabric.loadSVGFromString(f.target.result, (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options)
            obj.set({
              left: 0,
              top: 0
            }).setCoords()
            canvas.add(obj)

            canvas.renderAll()
            canvas.trigger('object:modified')
          })
        }
        reader.readAsText(file)
      } else {
        // handle image, read file, add to canvas
        reader.onload = (f) => {
          fabric.Image.fromURL(f.target.result, (img) => {
            img.set({
              left: 0,
              top: 0
            })
            img.scaleToHeight(300)
            img.scaleToWidth(300)
            canvas.add(img)

            canvas.renderAll()
            canvas.trigger('object:modified')
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }

  window.ImageEditor.prototype.initializeUpload = upload;
})()