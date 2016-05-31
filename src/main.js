import { browsersDb } from 'cssantique'

document.getElementById('browserNameOptions').innerHTML = Object.keys(browsersDb).reduce((html, name) => {
  var image = chrome.extension.getURL(`images/${name}.png`)
  return html + `<input class='browserRadio' type="radio" name="browserName" value="${name}" id='browserRadio-${name}' /><label for='browserRadio-${name}' class='browserNameLabel'><img class="browserLogo" src="${image}"> ${name} </label><br>`
}, '')

const cssantiqueForm = document.getElementById('cssantiqueForm')
const browserElem = document.getElementById('browserName')
const versionElem = document.getElementById('browserVersion')
const discardedElem = document.getElementById('cssDiscarded')

var bnameElemLabels = document.querySelectorAll('.browserNameLabel')
var bnameElems = document.querySelectorAll('.browserRadio')
Array.prototype.forEach.call(bnameElems, (radio) => {
  radio.addEventListener('change', updateVersions)
})

cssantiqueForm.addEventListener('submit', function (e) {
  e.preventDefault()

  chrome.devtools.inspectedWindow.eval(`
    resetStyles()
    filterStyles({
      browser: {name: "${browserElem.value}", version: "${versionElem.value}"}
    })
      `,
    {useContentScriptContext: true},
    function (result, isException) {
      if (isException) {
        showError(isException.value)
      } else {
        showDiscarded(result.discarded)
      }
    })
},
  false
)

function updateVersions () {
  versionElem.innerHTML = ''
  var browser = document.querySelector('input[name="browserName"]:checked').value
  browserName.value = browser
  const browserVersions = browsersDb[browser]
  Object.keys(browserVersions).map((version) => {
    let opt = document.createElement('option')
    opt.text = version
    opt.value = version
    versionElem.appendChild(opt)
  })
}

function showDiscarded (discarded) {
  discardedElem.innerHTML = discarded.join('<br/>')
}

function showError (error) {
  discardedElem.innerHTML = error
}
