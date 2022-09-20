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

function wrapWithIcon(content, iconName, type = 'span') {
  const result = document.createElement(type)
  result.append(content.cloneNode(true))

  const icon = document.createElement('i')
  icon.classList.add(`bi-${iconName}`)
  result.append(icon)

  return result
}

export {
  formatXml,
  wrapInLink,
  wrapWithIcon
}
