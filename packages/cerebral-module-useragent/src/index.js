import assign from '101/assign'
import matchMedia from './services/matchMedia'
import parser from './services/parser'
import window from './services/window'

import windowChanged from './signals/windowChanged'
import moduleRegistered from './signals/moduleRegistered'

const defaultOptions = {
  parse: {
    browser: true,
    device: true,
    os: true
  },
  window: true
}

export default (userOptions = {}) => {
  const options = {}
  assign(options, defaultOptions, userOptions)
  console.log(options)
  return (module, controller) => {
    module.alias('cerebral-module-useragent')

    module.addState({
      browser: undefined,
      device: undefined,
      features: {},
      os: undefined,
      window: {
        width: undefined,
        height: undefined,
        orientation: undefined
      }
    })

    module.addSignals({
      moduleRegistered,
      windowChanged
    })

    module.addServices({
      matchMedia,
      parser,
      window
    })

    controller.once('modulesLoaded', event => {
      if (options.window !== false) {
        window.onChange(
          module.getSignals().windowChanged
        )
      }

      module.getSignals().moduleRegistered()
    })

    return {
      options
    }
  }
}