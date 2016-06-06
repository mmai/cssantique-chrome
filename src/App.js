import React from 'react'

const App = ({ state, browsers, onProcess, onSelectBrowser, onSelectVersion, onReset }) => (
  <div id="content">
    <div id='form'>
      <input type='hidden' id='browserName' />
      <div id="form-browsers">
        <div className="browsersList">
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
                 <br/>
                 {name}
               </label>
             </div>)
           )}
        </div>
      </div>
      {state.browser !== '' &&
       <div id="form-version">
         <div>
           <div>
             {state.browser} <span className='version'>{state.version}</span>
           </div>
           <BrowserVersions version={state.version} versions={state.versions} onChange={onSelectVersion} />
         </div>
       </div>}
      {state.version !== '' &&
       <div id="form-submit">
         <div className='validate-buttons'>
           <button className='btn-submit' name="process" onClick={onProcess}>
             Submit
           </button>
           {state.processed && <button className='btn-reset' name="reset" onClick={onReset}>
                                 Reset
                               </button>}
         </div>
       </div>}
    </div>
    <div id="infos">
      <div className='helptxt'>
        {state.browser === '' && 'Select a browser'}
        {state.browser !== '' && (!state.processed) && 'Slide to the desired version and submit'}
        {state.pending.indexOf('STYLING') !== -1 && 'Processing...'}
      </div>
      {state.discarded.length > 0 &&
       <div>
         <h2>Disabled attributes for this <em>{state.browser} {state.version}</em> emulation</h2>
         <Discarded discarded={state.discarded} />
       </div>}
      <TxtError errors={state.errors} />
    </div>
  </div>
)

const BrowserVersions = ({version, versions, onChange}) => {
  const max = versions.length - 1
  const curentIndex = versions.indexOf(version)
  return (
  <input
    name='browserVersion'
    id="browserVersion"
    type="range"
    min="0"
    max={max}
    value={curentIndex}
    onChange={onChange} />
  )}

const Discarded = ({discarded}) => (
  <div id="discarded">
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
