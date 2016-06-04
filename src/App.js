import React from 'react'

const App = ({ state, browsers, onProcess, onSelectBrowser, onSelectVersion, onReset }) => (
  <div id="content">
    <div id='form'>
      <input type='hidden' id='browserName' />
      <div id="form-browsers">
        {browsers.map((name, i) => (
           <div key={name} className='form-browsers-item'>
             <input
               onChange={onSelectBrowser}
               className='form-browsers-radio'
               type="radio"
               name="browserName"
               checked={state.browser === name}
               value={name}
               id={'browserRadio-' + name} />
             <label htmlFor={'browserRadio-' + name}>
               <img className="form-browsers-logo" src={chrome.extension.getURL(`images/${name}.png`)} />
               {name}
             </label>
           </div>)
         )}
      </div>
      {state.browser !== '' && <BrowserVersions version={state.version} versions={state.versions} onChange={onSelectVersion} />}
      {state.version !== '' && <div id="form-submit">
                                 <div>
                                   {state.browser}
                                   {state.version}
                                 </div>
                                 <button name="process" onClick={onProcess}>
                                   Submit
                                 </button>
                               </div>}
      {state.browser !== '' && <button name="reset" onClick={onReset}>
                                 Reset
                               </button>}
    </div>
    <div id="infos">
      <Discarded discarded={state.discarded} />
      <TxtError errors={state.errors} />
    </div>
  </div>
)

const BrowserVersions = ({version, versions, onChange}) => {
  const max = versions.length - 1
  const curentIndex = versions.indexOf(version)
  return (
  <div id="form-version">
    <div>
      Version:
      {version}
    </div>
    <input
      name='browserVersion'
      id="browserVersion"
      type="range"
      min="0"
      max={max}
      value={curentIndex}
      onChange={onChange} />
  </div>
  )}

const Discarded = ({discarded}) => (
  <div id="discarded">
    <h2>{discarded.length > 0 ? 'Attributes not supported on the selected browser' : ''}</h2>
    {discarded.map((d, i) => (
       <span key={i} className="discarded-item">{d}</span>
     ))}
  </div>
)

const TxtError = ({errors}) => (
  <div id="errors">
    {errors.map(function (error, i) {
       return <div key={i}>
                {error}
              </div>
     })}
  </div>
)

export default App
