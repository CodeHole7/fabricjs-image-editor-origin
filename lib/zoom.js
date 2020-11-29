/**
 * Define action to zoom in/out by mouse+key events
 */
// keyboard shortcuts and zoom calculations
const minZoom = 0.05
const maxZoom = 3

// zoom with key
const zoomWithKeys = (e, canvas, applyZoom) => {
  const key = e.which || e.keyCode

  // ctr -: zoom out
  if (key === 189 && e.ctrlKey) {
    e.preventDefault()
    if (canvas.getZoom() === minZoom) return

    let updatedZoom = parseInt(canvas.getZoom() * 100)

    // 25% jumps
    if ((updatedZoom % 25) !== 0) {
      while ((updatedZoom % 25) !== 0) {
        updatedZoom = updatedZoom - 1
      }
    } else {
      updatedZoom = updatedZoom - 25
    }

    updatedZoom = updatedZoom / 100
    updatedZoom = (updatedZoom <= 0) ? minZoom : updatedZoom

    applyZoom(updatedZoom)
  }


  // ctr +: zoom in
  if (key === 187 && e.ctrlKey) {
    e.preventDefault()
    if (canvas.getZoom() === maxZoom) return

    let updatedZoom = parseInt(canvas.getZoom() * 100)

    // 25% jumps
    if ((updatedZoom % 25) !== 0) {
      while ((updatedZoom % 25) !== 0) {
        updatedZoom = updatedZoom + 1
      }
    } else {
      updatedZoom = updatedZoom + 25
    }

    updatedZoom = updatedZoom / 100
    updatedZoom = (updatedZoom > maxZoom) ? maxZoom : updatedZoom

    applyZoom(updatedZoom)
  }


  // ctr 0: reset
  if ((key === 96 || key === 48 || key === 192) && e.ctrlKey) {
    e.preventDefault()
    applyZoom(1)
  }
}

// zoom with mouse
const zoomWithMouse = (e, canvas, applyZoom) => {
  if (!e.ctrlKey) return
  e.preventDefault()

  let updatedZoom = canvas.getZoom().toFixed(2)
  let zoomAmount = (e.deltaY > 0) ? -5 : 5
  updatedZoom = ((updatedZoom * 100) + zoomAmount) / 100
  if (updatedZoom < minZoom || updatedZoom > maxZoom) return

  applyZoom(updatedZoom)
}