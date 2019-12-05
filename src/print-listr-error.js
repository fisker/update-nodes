import signale from 'signale'

function print(error) {
  const {errors} = error
  if (errors && errors.length !== 0) {
    for (const error of errors) {
      const message =
        (error.detail && error.detail.stdout) || error.message || error.stack
      const printError = new Error()
      printError.stack = `Node.js v${error.version}\n${message}`
      console.log()
      signale.fatal(printError)
    }
  } else {
    signale.fatal(error)
  }
}

export default print
