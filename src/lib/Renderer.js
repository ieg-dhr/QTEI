export default class Renderer {
  constructor(processors = []) {
    this.processors = processors
  }

  render(doc) {
    for (const processor of this.processors) {
      processor(doc)
    }
  }
}
