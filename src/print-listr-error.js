import signale from 'signale'

function print(error) {
  const {errors} = error
  if (errors && errors.length !== 0) {
    for (const error of errors) {
      console.log()
      const printError = new Error()
      printError.stack = `Node.js v${error.version}\n${error.detail ||
        error.message ||
        error.stack}`
      signale.fatal(printError)
    }
  } else {
    signale.fatal(error)
  }
}

export default print
