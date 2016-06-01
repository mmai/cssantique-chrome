import React, { Component } from 'react'
import { browsersDb } from 'cssantique'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.updateStyle = this.updateStyle.bind(this)
    this.updateVersions = this.updateVersions.bind(this)
    this.render = this.render.bind(this)
    this.state = {
      browser: '',
      versions: ['toto', 'titi'],
      discarded: ['ini0', 'ini1'],
      errors: []
    }
  }

  updateVersions (e) {
    var browser = document.querySelector('input[name="browserName"]:checked').value
    var versions = Object.keys(browsersDb[browser])
    var discarded = []
    this.setState({ browser, versions, discarded})
  }

  updateStyle (e) {
    e.preventDefault()
    let version = document.getElementById('browserVersion').value
    let browser = this.state.browser
    chrome.devtools.inspectedWindow.eval(`
      resetStyles()
      filterStyles({
        browser: {name: "${browser}", version: "${version}"}
      })
        `,
      {useContentScriptContext: true},
      (result, isException) => {
        if (isException) {
          this.setState(Object.assign({}, this.state, {errors: [isException.value]}))
        } else {
          this.setState(Object.assign({}, this.state, {discarded: result.discarded}))
        }
      })
  }

  render () {
    return (
    <div id="cssantiqueContent">
      <form id='cssantiqueForm' onSubmit={this.updateStyle}>
        <input type='hidden' id='browserName' />
        <div id="browserNameOptions">
          {Object.keys(browsersDb).map((name, i) => {
             var image = chrome.extension.getURL(`images/${name}.png`)
             return (<div key={name}>
                       <input
                         onChange={this.updateVersions}
                         className='browserRadio'
                         type="radio"
                         name="browserName"
                         value={name}
                         id={'browserRadio-' + name} />
                       <label htmlFor={'browserRadio-' + name} className='browserNameLabel'>
                         <img className="browserLogo" src={image} />
                         {name}
                       </label>
                     </div>)
           })}
        </div>
        <BrowserVersions versions={this.state.versions} />
        <input type='submit' />
      </form>
      <Discarded discarded={this.state.discarded} />
      <TxtError errors={this.state.errors} />
    </div>

    )
  }
}

class BrowserVersions extends React.Component {
  constructor (props) { super(props) }
  render () {
    return (
    <div>
      <label htmlFor='browserVersion'>
        version
      </label>
      <select name='browserVersion' id='browserVersion'>
        {this.props.versions.map((v) => (
           <option>
             {v}
           </option>
         ))}
      </select>
    </div>
    )
  }
}

class Discarded extends React.Component {
  constructor (props) { super(props) }
  render () {
    return (
    <div id="cssDiscarded">
      {this.props.discarded.map(function (d) {
         return ( <span>{d}</span> )
       })}
    </div>
    )
  }

}

class TxtError extends React.Component {
  constructor (props) { super(props) }
  render () {
    return (
    <div id="errors">
      {this.props.errors.map(function (error) {
         return <div>
                  {error}
                </div>
       })}
    </div>
    )
  }
}
