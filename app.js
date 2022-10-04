import './lib.js'

import {wrapAll, toggleWWhiteSpace, indexW} from './lib/processors.js'
import {wrapInLink} from './lib/util.js'

function linkify(content) {
  for (const element of content.querySelectorAll('.place')) {
    let geo = element.querySelector('geo').textContent
    console.log(geo)

    const wrapped = wrapInLink(element, `https://maps.google.com?q=${geo}`)
    element.replaceWith(wrapped)
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
      const lat = element.querySelector('geo').textContent.split(',')[1]
      const lon = element.querySelector('geo').textContent.split(',')[0]

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
      const target = document.querySelector('#map')
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
      map.flyToBounds(dl.getBounds(), {maxZoom: 7})
    } else {
      map.setView([50, 10], 4)
    }
  }
}

new TeiViewer('[is=viewer]', {
  src: 'data/content.xml',
  processors: [
    toggleWWhiteSpace(false),
    wrapAll('persName', 'person-fill', 'person'),
    wrapAll("rs[type='person']", 'person-fill', 'person'),
    wrapAll('placeName', 'geo-alt-fill', 'place'),
    wrapAll("rs[type='artwork']", 'palette-fill', 'artwork'),
    linkify,
    indexW
  ],
  postProcessors: [
    mappify("placeName")
  ]
})
