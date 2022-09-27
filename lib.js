import './app.scss'

import { component } from 'riot'
import Viewer from './components/viewer.riot'
import * as processors from './lib/processors'

class TeiViewer {
  constructor(selector, opts = {}) {
    this.element = document.querySelector(selector)
    const cmp = component(Viewer)(this.element, opts)
  }
}

TeiViewer.processors = processors

window.TeiViewer = TeiViewer
