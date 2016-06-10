var cssantique = require('cssantique')

window.filterStyles = cssantique.filterStyles
window.resetStyles = cssantique.resetStyles

let popupInserted = false
let popupDiv = document.createElement('div')
popupDiv.setAttribute('class', 'cssantique-modal cssantique-modal--closed')

function insertPopupDiv () {
  if (!popupInserted && document.body) {
    document.body.appendChild(popupDiv)
    popupInserted = true
  }
}

window.showPopup = function (message) {
  popupDiv.innerHTML = `
    <div>	
      <h2>CSSAntique</h2>
      <div>${message}</div>
    </div>`
  popupDiv.setAttribute('class', 'cssantique-modal cssantique-modal--opened')
  insertPopupDiv()
}

window.closePopup = function () {
  popupDiv.setAttribute('class', 'cssantique-modal cssantique-modal--closed')
}
