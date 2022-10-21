const ancestorsFor = (node) => {
  if (node === null) {return []}
  if (node.parentNode === null) {return [node]}

  return ancestorsFor(node.parentNode).concat([node])
}

const commonAncestor = (a, b) => {
  const ancestorsA = ancestorsFor(a)
  const ancestorsB = ancestorsFor(b)

  let candidate = null
  for (let i = 0; i < ancestorsA.length; i++) {
    if (ancestorsA[i] === ancestorsB[i]) {
      candidate = ancestorsA[i]
    } else {
      return candidate
    }
  }

  return candidate
}

const stripBefore = (node) => {
  if (node === null) {return}
  while (node.previousSibling) {
    node.previousSibling.remove()
  }
  stripBefore(node.parentNode)
}

const stripAfter = (node) => {
  if (node === null) {return}
  while (node.nextSibling) {
    node.nextSibling.remove()
  }
  stripAfter(node.parentNode)
}

const stripNode = (node) => {
  const parent = node.parentNode
  node.remove()

  if (!parent.hasChildNodes()) {
    stripNode(parent)
  }
}

export default class TeiDoc {
  static load(url) {
    return fetch(url).
      then(response => response.text()).
      then(text => {
        const parser = new DOMParser()
        console.log('parsing XML ...')
        const now = new Date()
        const result = parser.parseFromString(text, "application/xml")
        console.log('... done', (new Date()) - now)
        return new TeiDoc(result)
      })
  }

  constructor(doc) {
    this.doc = doc
    this.cache = {}
  }

  pbs(){
    if (!this.cache['pbs']) {
      this.cache['pbs'] = [...this.doc.querySelectorAll('pb')]
    }

    return this.cache['pbs']
  }

  pageIds() {
    return this.pbs().map(e => e.getAttribute('n'))
  }

  firstPage() {
    return this.pageIds()[0]
  }

  extractPage(id) {
    const pbs = this.pbs()

    const pb = this.doc.querySelector(`pb[n='${id}']`)
    const nextPb = pbs[pbs.indexOf(pb) + 1]

    const ancestor = commonAncestor(pb, nextPb)
    const clone = ancestor.cloneNode(true)
    const a = clone.querySelector(`pb[n='${pb.getAttribute('n')}']`)
    const b = clone.querySelector(`pb[n='${nextPb.getAttribute('n')}']`)

    stripBefore(a)
    stripAfter(b)
    stripNode(b)

    return clone
  }

  pageData(page) {
    const content = this.extractPage(page)
    const data = {
      page,
      content,
      doc: this.doc
    }

    return data
  }
}
