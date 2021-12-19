module.exports = (func) => {
  return new Promise(resolve => {
    func(resolve);
  })
}