import {icon} from './lib/utils.js'

function linkify(data) {
  // for (const element of data.content.querySelectorAll('.place')) {
  //   let geo = element.querySelector('geo')
  //   if (geo) {
  //     const latlon = geo.textContent
  //     const wrapped = QTei.utils.wrapInLink(element, `https://maps.google.com?q=${geo}`)
  //     element.replaceWith(wrapped)
  //   }
  // }

  window.doc = data

  for (const element of data.content.querySelectorAll('.person rs')) {
    const ref = element.getAttribute('ref').replace('#', '')
    const persName = data.doc.querySelector(`person[id='${ref}'] persName`)
    if (!persName) continue

    const url = persName.getAttribute('ref')
    if (!url) continue

    console.log(element).textContent

    element.addEventListener('click', event => {
      window.open(url, '_blank').focus()
    })
  }
}

function mappify(selector) {
  let map = null
  let dl = null

  return function(data) {
    let geoJSON = {
      type: "FeatureCollection",
      features: []
    }

    window.data = data.content
    for (const element of data.content.querySelectorAll(selector)) {
      const geo = element.querySelector('geo')
      if (!geo) {continue}

      const lat = geo.textContent.split(',')[1]
      const lon = geo.textContent.split(',')[0]

      if (!lat || !lon) {continue}

      geoJSON['features'].push({
        type: 'Feature',
        properties: {
          name: element.querySelector('settlement').textContent
        },
        geometry: {
          type: 'Point',
          coordinates: [lat, lon]
        }
      })
    }

    if (!map) {
      const target = document.querySelector('[qtei-id=map]')
      map = L.map(target).setView([50, 10], 4)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map)
    }

    if (dl) {
      dl.remove()
    }

    if (geoJSON['features'].length > 0) {
      dl = L.geoJSON(geoJSON).addTo(map)
      map.flyToBounds(dl.getBounds(), {maxZoom: 7, padding: [30, 30]})
    } else {
      map.setView([50, 10], 4)
    }
  }
}

function loadBBFacsimile(data) {
  let pb = data.content.querySelector(`pb`)
  let url = pb.getAttribute('facs')
  if (!url) {return null}

  url = url.replaceAll(
    /\/content\/pageview\/(\d+)$/g,
    "/download/webcache/2000/$1"
  )

  let img = document.querySelector('[qtei-id=facsimile]')
  img.setAttribute('src', url)
}

function loadATFacsimile(data) {
  let pb = data.content.querySelector(`pb`)
  let facs = pb.getAttribute('facs')
  if (!facs) {return null}

  const url = `https://textgridlab.org/1.0/digilib/rest/IIIF/${facs}/full/max/0/default.jpg`

  let img = document.querySelector('[qtei-id=facsimile]')
  img.setAttribute('src', url)
}

function loadDTAFacsimile() {
  let docName = null

  return function run(data) {
    if (!docName) {
      const idno = data.doc.querySelector("idno[type='DTADirName']")
      docName = idno.textContent
    }

    let pb = data.content.querySelector(`pb`)
    let facs = pb.getAttribute('facs')
    if (!facs) {return null}

    const ref = facs.replace('#f', '')
    const url = `https://media.dwds.de/dta/images/${docName}/${docName}_${ref}_800px.jpg`

    let img = document.querySelector('[qtei-id=facsimile]')
    img.setAttribute('src', url)
  }
}

function toNamespace(from, to, replacements) {
  function changeNS(node, to){
    if (node.namespaceURI != from) return

    const r = replacements[node.nodeName.toLowerCase()]
    let dup = (r ?
      document.createElementNS(to, r) :
      document.createElementNS(to, node.nodeName)
    )

    if (node.hasAttributes()) {
      for (const a of node.attributes) {
        dup.setAttribute(a.nodeName, a.value)
      }
    }

    if (node.hasChildNodes()) {
      for (const a of node.childNodes) {
        if (a.nodeType == 1) { // element node
          dup.appendChild(changeNS(a, to))
        } else {
          dup.appendChild(a.cloneNode(false))
        }
      }
    }

    return dup
  }

  return function run(data) {
    data.htmlDOM = changeNS(data.content, to)
  }
}

function poppifyNotes(data) {
  for (const note of data.content.querySelectorAll('note')) {
    // console.log(note)

    const a = document.createElement('a')
    a.append(icon('info-circle'))
    a.classList.add('note')

    const popover = new bootstrap.Popover(a, {
      title: `Note ${note.getAttribute('type')}`,
      content: note.textContent,
      trigger: 'hover'
    })


    a.note = note
    note.replaceWith(a)
  }
}

function applyCSSRendition() {
  let styleMap = null

  return function run(data) {
    if (!styleMap) {
      styleMap = {}
      for (const e of data.doc.querySelectorAll("rendition[scheme=css]")) {
        styleMap[e.getAttribute('xml:id')] = e.textContent
      }
    }

    for (const e of data.htmlDOM.querySelectorAll('[rendition]')) {
      const ref = e.getAttribute('rendition').replace('#', '')
      e.setAttribute('style', styleMap[ref])
    }
  }
}

function teiUrl() {
  // const d = 'data/dta/chamisso_schlemihl_1814.TEI-P5.xml'
  // const d = 'data/fv/8.xml'
  const d = 'data/fv/103.xml'
  // const d = 'data/bombers_baedeker.xml'

  const search = document.location.search.replace('?', '')
  if (search == '') return d

  for (const pair of search.split('&')) {
    const [k, v] = pair.split('=')
    if (k == 'tei') return v
  }

  return d
}

function renderHTMLTo(selector) {
  return function(data) {
    const element = document.querySelector(selector)
    element.innerHTML = ''
    element.append(data.htmlDOM)
  }
}

new QTei.SimpleViewer('[is=qtei-viewer]', {
// new QTei.PaginatedViewer('[is=qtei-viewer]', {
  src: teiUrl(),
  processors: [
    // QTei.processors.toggleWWhiteSpace(false),
    QTei.processors.highlightXml('[qtei-id=raw]'),
    QTei.processors.wrapAll('persName', 'person-fill', 'person'),
    QTei.processors.wrapAll("rs", 'person-fill', 'person'),
    QTei.processors.wrapAll('placeName', 'geo-alt-fill', 'place'),
    QTei.processors.wrapAll("rs[type='artwork']", 'palette-fill', 'artwork'),
    linkify,
    poppifyNotes,
    QTei.processors.renderXmlTo('[qtei-id=raw]'),
    // loadBBFacsimile,
    mappify('placeName'),
    toNamespace(
      'http://www.tei-c.org/ns/1.0',
      'http://www.w3.org/1999/xhtml',
      {head: 'tei-head'}
    ),
    applyCSSRendition(),
    renderHTMLTo('[qtei-id=content]')
    // QTei.processors.indexW,
    // linkify,
    // loadATFacsimile,
    // loadDTAFacsimile(),
  ]
})
