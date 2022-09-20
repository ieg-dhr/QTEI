/*
 url persistence (page)
 column toggles
 sessionStorage persistence (column visibility)
 more beautiful
 github repo: https://github.com/ieg-dhr/QTEI
 fix xml linting!
 */

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

new TeiViewer('[is=viewer]', {
  src: 'data/bombers_baedeker.xml',
  processors: [
    toggleWWhiteSpace(false),
    wrapAll('persName', 'person-fill', 'person'),
    wrapAll("rs[type='person']", 'person-fill', 'person'),
    wrapAll('placeName', 'geo-alt-fill', 'place'),
    wrapAll("rs[type='artwork']", 'palette-fill', 'artwork'),
    linkify,
    indexW
  ]
})
