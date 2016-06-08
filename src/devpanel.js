var fp = require('lodash/fp')

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

import App from './App'
import { browsers } from 'cssantique'

// Create a connection to the background page
// (cf. https://developer.chrome.com/extensions/devtools#content-script-to-devtools)
var backgroundPageConnection = chrome.runtime.connect({ name: "devpanel" })
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
})

const defaultState = {
      browser: '',
      version: '',
      processed: false,
      versions: [],
      discarded: [],
      pending: [],
      errors: []
    }

const cssAntiqueReducer = (state = defaultState, action) => {
  let pending = state.pending
  let newState = {...state}
  switch (action.type){
  case 'SELECT_BROWSER':
    const versions = browsers[action.browser].versions
    const version = versions[versions.length - 1]
    return {...state, browser: action.browser, versions, version, discarded: [], errors: []}
  case 'SELECT_VERSION':
    return {...state, version: action.version, discarded: [], errors: []}
  case 'PROCESS_STYLING':
    newState = {...state, processed: true, pending: [...(state.pending), "STYLING"]}
    return newState
  case 'STYLING_SHOW_ERROR':
    pending = fp.remove((e) => e === 'STYLING', pending)
    newState = {...state, pending:pending, errors:[action.error]}
    return newState
  case 'STYLING_SHOW_RESULT':
    pending = fp.remove((e) => e === 'STYLING', pending)
    newState = {...state, pending:pending, discarded:action.discarded.sort()}
    return newState
  case 'RESET':
    return {...state, processed: false, pending: [...(state.pending), "RESET"]}
  case 'RESET_SHOW_ERROR':
    pending = fp.remove((e) => e === 'RESET', pending)
    return {...state, pending:pending, errors:[action.error]}
  case 'RESET_DONE':
    pending = fp.remove((e) => e === 'RESET', pending)
    return {...defaultState, pending:pending}
  default:
    return state
  }
}
const store = createStore( cssAntiqueReducer)

const render = () => {
  ReactDOM.render(
    <App
      state={store.getState()}
      browsers={Object.keys(browsers)}
      onSelectBrowser={() => {
        store.dispatch({
            type:'SELECT_BROWSER',
            browser:document.querySelector('input[name="browserName"]:checked').value
          })
        }}
      onSelectVersion={() => {
        const versions = store.getState().versions
        const versionId = document.getElementById('browserVersion').value
        store.dispatch({
            type:'SELECT_VERSION',
            version: versions[versionId]
          })
        }}
      onProcess={() => {
        store.dispatch({
            type:'PROCESS_STYLING',
          })
        }}
      onReset={() => {
        store.dispatch({
            type:'RESET',
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
      showPopup('Disabling CSS properties not supported by ${state.browser} ${state.version}...')
      filterStyles({
        browser: {name: "${state.browser}", version: "${state.version}"}
      }, function(res){
        closePopup()
        chrome.runtime.sendMessage({filterStyles: res})
      })
        `,
      {useContentScriptContext: true},
      (result, isException) => {
        if (isException) {
          store.dispatch({type:'STYLING_SHOW_ERROR', error: isException.value})
        }
        // Done on the backgroundPageConnection listener :
        // store.dispatch({type:'STYLING_SHOW_RESULT', discarded: result.discarded})
      })

  }
}

store.subscribe(applyStyles)

/**
 * reset
 * Reset original client document stylesheets and dispatch results to the redux store 
 *
 * @return {undefined}
 */
const resetStyles = () => {
  const state = store.getState()
  if (fp.includes('RESET', state.pending)){
    chrome.devtools.inspectedWindow.eval(`
      resetStyles()
      chrome.runtime.sendMessage({resetStyles: true})
      `,
      {useContentScriptContext: true},
      (result, isException) => {
        if (isException) {
          store.dispatch({type:'RESET_SHOW_ERROR', error: isException.value})
        } 
        // Done on the backgroundPageConnection listener: 
        // store.dispatch({type:'RESET_DONE'}) 
      })
  }
}

store.subscribe(resetStyles)

// Process messages from content script
backgroundPageConnection.onMessage.addListener((msg) => {
    if ("filterStyles" in msg){
      store.dispatch({type:'STYLING_SHOW_RESULT', discarded: msg.filterStyles.discarded})
    } else if ("resetStyles" in msg){
      console.log('reset done')
      store.dispatch({type:'RESET_DONE'})
    }
  })

render()

