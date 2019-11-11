export default (value: any, msg?: string, ErrorClass?: any) => {
  if (value) {
    return
  }

  let message = typeof msg === 'string' ? msg : `Expected value to be truthy, but got: ${value}`

  if (ErrorClass) {
    throw new ErrorClass(message)
  } else {
    throw new Error(message)
  }
}
