import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { browsersDb } from 'cssantique'

var fp = require('lodash/fp')
import { createStore } from 'redux'

const defaultState = {
      browser: '',
      version: '',
      versions: [],
      discarded: [],
      pending: [],
      errors: []
    }

const cssAntiqueReducer = (state = defaultState, action) => {
  let pending = state.pending
  switch (action.type){
  case 'SELECT_BROWSER':
    const versions = Object.keys(browsersDb[action.browser])
    return {...state, browser: action.browser, versions, discarded: [], errors: []}
  case 'PROCESS_STYLING':
    return {...state, version: action.version, pending: [...(state.pending), "STYLING"]}
  case 'STYLING_SHOW_ERROR':
    pending = fp.remove((e) => e === 'STYLING', pending)
    return {...state, pending, errors:[action.error]}
  case 'STYLING_SHOW_RESULT':
    pending = fp.remove((e) => e === 'STYLING', pending)
    return {...state, pending, discarded:[action.discarded]}
  default:
    return state
  }
}

const store = createStore(cssAntiqueReducer)

const render = () => {
  ReactDOM.render(
    <App
      state={store.getState()}
      onSelectBrowser={() => {
        store.dispatch({
            type:'SELECT_BROWSER',
            browser:document.querySelector('input[name="browserName"]:checked').value
          })
        }}
      onFormSubmit={(e) => {
        e.preventDefault()
        store.dispatch({
            type:'PROCESS_STYLING',
            version: document.getElementById('browserVersion').value
          })
        }}

      />,
    document.getElementById('root')
  )
}
store.subscribe(render)

/**
 * applyStyles
 * Update client document stylesheets and dispatch results to the redux store 
 *
 * @return {undefined}
 */
const applyStyles = () => {
  const state = store.getState()
  if (fp.includes('STYLING', state.pending)){
    // console.log('applying new styles', state.pending)
    chrome.devtools.inspectedWindow.eval(`
      resetStyles()
      filterStyles({
        browser: {name: "${state.browser}", version: "${state.version}"}
      })
        `,
      {useContentScriptContext: true},
      (result, isException) => {
        console.log("result received")
        if (isException) {
          store.dispatch({type:'STYLING_SHOW_ERROR', error: isException.value})
        } else {
          store.dispatch({type:'STYLING_SHOW_RESULT', discarded: result.discarded})
        }
      })
  }
}

store.subscribe(applyStyles)

render()

