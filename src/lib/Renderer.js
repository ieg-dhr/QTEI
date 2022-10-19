export default class Renderer {
  constructor(doc, processors = []) {
    this.doc = doc
    this.processors = processors
  }

  render(page) {
    if (!page) return

    const data = this.doc.pageData(page)
    for (const processor of this.processors) {
      processor(data)
    }
  }
}
