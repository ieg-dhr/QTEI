import {wrapWithIcon, wrapInLink} from './util.js'

function wrapAll(selector, icon, wrapperClass) {
  return function(content) {
    for (const element of content.querySelectorAll(selector)) {
      let wrapped = wrapWithIcon(element, icon)
      wrapped.classList.add(wrapperClass)
      element.replaceWith(wrapped)
    }
  }
}

// add (or remove) white space around <w> elements so that they appear
// joined or separated
function toggleWWhiteSpace(join = false) {
  return function(content) {
    for (const w of content.querySelectorAll('w[join=right], w[join=both]')) {
      const n = w.nextSibling
      if (n.nodeType == 3) { // text node
        if (join) {
          n.textContent = ''
        }
      }
    }

    for (const w of content.querySelectorAll('w[join=both], w[join=left]')) {
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
function indexW(content) {
  let pack = []
  for (const w of content.querySelectorAll('w')) {
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
  indexW,
  toggleWWhiteSpace,
  wrapAll
}