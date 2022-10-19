import xmlFormat from 'xml-formatter'

let iconsLoaded = false

function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
  return xmlFormat(xml, {
    indentation: tab,
    collapseContent: true,
    lineSeparator: '\n'
  })
}

function wrapInLink(content, href) {
  const a = document.createElement('a')
  a.setAttribute('target', '_blank')
  a.setAttribute('href', href)
  a.append(content.cloneNode(true))

  return a
}

function icon(name, width=18, height=18) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('bi')
  svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('fill', 'currentColor')

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  // we are using namespaced and unnamespaced href for browser compatibility
  const href = `#${name}`
  use.setAttribute('href', href)
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href)
  svg.appendChild(use)

  return svg
}

function wrapWithIcon(content, iconName, type = 'span') {
  const result = document.createElement(type)
  result.append(content.cloneNode(true))
  result.append(icon(iconName))

  return result
}

function loadIcons() {
  if (iconsLoaded) return

  const url = `https://unpkg.com/@wendig/qtei/dist/bootstrap-icons.svg`
  fetch(url).then(r => r.text()).then(text => {
    const div = document.createElement('div')
    div.setAttribute('style', 'display: none')
    div.innerHTML = text
    document.body.insertBefore(div, document.body.childNodes[0]);
  })

  iconsLoaded = true
}

export {
  loadIcons,
  formatXml,
  wrapInLink,
  wrapWithIcon
}
