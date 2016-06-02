import React, { Component } from 'react'
import { browsersDb } from 'cssantique'

const App = ({ state, onFormSubmit, onSelectBrowser }) => (
  <div id="cssantiqueContent">
    <form id='cssantiqueForm' onSubmit={onFormSubmit}>
      <input type='hidden' id='browserName' />
      <div id="browserNameOptions">
        {Object.keys(browsersDb).map((name, i) => {
           var image = chrome.extension.getURL(`images/${name}.png`)
           return (<div key={name}>
                     <input
                       onChange={onSelectBrowser}
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
      <BrowserVersions versions={state.versions} />
      <input type='submit' />
    </form>
    <Discarded discarded={state.discarded} />
    <TxtError errors={state.errors} />
  </div>
)

class BrowserVersions extends React.Component {
  constructor (props) { super(props) }
  render () {
    return (
    <div>
      <label htmlFor='browserVersion'>
        version
      </label>
      <select name='browserVersion' id='browserVersion'>
        {this.props.versions.map((v, i) => (
           <option key={i}>
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
      {this.props.discarded.map(function (d, i) {
         return ( <span key={i}>{d}</span> )
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
      {this.props.errors.map(function (error, i) {
         return <div key={i}>
                  {error}
                </div>
       })}
    </div>
    )
  }
}

export default App
