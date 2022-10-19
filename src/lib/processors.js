import {wrapWithIcon, wrapInLink} from './util.js'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('xml', xml);

function renderXmlTo(selector) {
  return function(data) {
    const element = document.querySelector(selector)
    element.innerHTML = ''
    element.append(data.code)
  }
}

function highlightXml(selector) {
  return function(data) {
    const element = document.querySelector(selector)
    hljs.highlightElement(element)
  }
}

function renderContentTo(selector) {
  return function(data) {
    const element = document.querySelector(selector)
    element.innerHTML = ''
    element.append(data.content)
  }
}

function wrapAll(selector, icon, wrapperClass) {
  return function(data) {
    for (const element of data.content.querySelectorAll(selector)) {
      let wrapped = wrapWithIcon(element, icon)
      wrapped.classList.add(wrapperClass)
      element.replaceWith(wrapped)
    }
  }
}

// add (or remove) white space around <w> elements so that they appear
// joined or separated
function toggleWWhiteSpace(join = false) {
  return function(data) {
    for (const w of data.content.querySelectorAll('w[join=right], w[join=both]')) {
      const n = w.nextSibling
      if (n.nodeType == 3) { // text node
        if (join) {
          n.textContent = ''
        }
      }
    }

    for (const w of data.content.querySelectorAll('w[join=both], w[join=left]')) {
      const p = w.previousSibling
      if (p.nodeType == 3) { // text node
        if (join) {
          p.textContent = ''
        }
      }
    }
  }
}

// add an attribute "sequence" to all <w> elements, referencing all 
// neighboring <w> elements (for mouseover/mouseout handlers)
function indexW(data) {
  let pack = []
  for (const w of data.content.querySelectorAll('w')) {
    if (w.getAttribute('join') == 'left') {
      pack.push(w)

      for (const e of pack) {
        e.sequence = pack
      }

      pack = []
    } else {
      pack.push(w)
    }
  }
}

export {
  renderXmlTo,
  highlightXml,
  renderContentTo,
  wrapAll,
  toggleWWhiteSpace,
  indexW
}
