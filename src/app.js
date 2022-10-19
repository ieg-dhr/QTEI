// import './lib.js'

function linkify(data) {
  for (const element of data.content.querySelectorAll('.place')) {
    let geo = element.querySelector('geo')
    if (geo) {
      const latlon = geo.textContent
      const wrapped = QTei.utils.wrapInLink(element, `https://maps.google.com?q=${geo}`)
      element.replaceWith(wrapped)
    }
  }
}

function mappify(selector) {
  let map = null
  let dl = null

  return function() {
    let geoJSON = {
      type: "FeatureCollection",
      features: []
    }

    for (const element of document.querySelectorAll(selector)) {
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

function functionATFacsimile(data) {
  let pb = data.content.querySelector(`pb`)
  let facs = pb.getAttribute('facs')
  if (!facs) {return null}

  const url = `https://textgridlab.org/1.0/digilib/rest/IIIF/${facs}/full/max/0/default.jpg`

  let img = document.querySelector('[qtei-id=facsimile]')
  img.setAttribute('src', url)
}

new QTei.Viewer('[is=qtei-viewer]', {
  src: 'data/content.xml',
  processors: [
    // QTei.processors.toggleWWhiteSpace(false),
    QTei.processors.wrapAll('persName', 'person-fill', 'person'),
    QTei.processors.wrapAll("rs[type='person']", 'person-fill', 'person'),
    QTei.processors.wrapAll('placeName', 'geo-alt-fill', 'place'),
    QTei.processors.wrapAll("rs[type='artwork']", 'palette-fill', 'artwork'),
    QTei.processors.renderXmlTo('[qtei-id=raw]'),
    QTei.processors.highlightXml('[qtei-id=raw]'),
    QTei.processors.renderContentTo('[qtei-id=content]'),
    // QTei.processors.indexW,
    // linkify,
    loadBBFacsimile,
    // functionATFacsimile,
    mappify("placeName")
  ]
})
