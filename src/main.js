import { filterStyles, resetStyles, browsersDb } from 'cssantique'

const browserNameOptions = Object.keys(browsersDb).map((name) => `<option>${name}</option>`)

let cssantiqueForm = document.createElement('form')
cssantiqueForm.id = 'cssantiqueForm'
cssantiqueForm.innerHTML = `
  <label for='browserName'>Browser</label>
  <select name='browserName' id='browserName'>
  ${browserNameOptions}
  </select><br />
  <label for='browserVersion'>version</label>
  <select name='browserVersion' id='browserVersion'>
  </select><br />
  <input type='submit' />
  `
window.document.body.appendChild(cssantiqueForm)

const browserElem = document.getElementById('browserName')
const versionElem = document.getElementById('browserVersion')

updateVersions()
browserElem.addEventListener('change', updateVersions)

cssantiqueForm.addEventListener('submit',
  function (e) {
    e.preventDefault()
    resetStyles()
    filterStyles({
      ignore: ['cssantique.css'],
      browser: {name: browserElem.value, version: versionElem.value}
    })
  },
  false
)

function updateVersions () {
  versionElem.innerHTML = ''
  const browserVersions = browsersDb[browserElem.value]
  Object.keys(browserVersions).map((version) => {
    let opt = document.createElement('option')
    opt.text = version
    versionElem.appendChild(opt)
  })
}
