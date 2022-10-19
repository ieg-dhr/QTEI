import xmlFormat from 'xml-formatter'

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
  const href = `bootstrap-icons.svg#${name}`
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

export {
  formatXml,
  wrapInLink,
  wrapWithIcon
}
