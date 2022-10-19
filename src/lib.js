import { component } from 'riot'
import Renderer from './lib/Renderer'
import Viewer from './components/viewer.riot'
import * as processors from './lib/processors'
import * as utils from './lib/util'

function wrap(ComponentType) {
  return function(selector, opts = {}) {
    const element = document.querySelector(selector)
    component(ComponentType)(element, opts)
  }
}

class QTei {
  static Viewer = wrap(Viewer)
  static Renderer = Renderer

  static processors = processors
  static utils = utils
}

window.QTei = QTei
