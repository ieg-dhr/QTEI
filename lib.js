import './app.scss'

import { component } from 'riot'
import Viewer from './components/viewer.riot'

class TeiViewer {
  constructor(selector, opts = {}) {
    this.element = document.querySelector(selector)
    const cmp = component(Viewer)(this.element, opts)
  }
}

window.TeiViewer = TeiViewer
