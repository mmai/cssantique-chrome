var cssantique = require('cssantique')

window.filterStyles = cssantique.filterStyles
window.resetStyles = cssantique.resetStyles

let popupDiv = document.createElement('div')
popupDiv.setAttribute('class', 'cssantique-modal cssantique-modal--closed')
document.body.appendChild(popupDiv)

window.showPopup = function (message) {
  popupDiv.innerHTML = `
    <div>	
      <h2>CSSAntique</h2>
      <div>${message}</div>
    </div>`
  popupDiv.setAttribute('class', 'cssantique-modal cssantique-modal--opened')
}

window.closePopup = function () {
  popupDiv.setAttribute('class', 'cssantique-modal cssantique-modal--closed')
}
