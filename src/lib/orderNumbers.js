
const randomChar = _ => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2)

const createOrderNumber = () => {
  const init = 'RA'
  const date = new Date()
  const yr = date.getFullYear().toString().substr(-2)
  const mth = date.getMonth()
  const d = ("0" + date.getDate()).slice(-2).toString().split('')
  const rand1 = randomChar()
  const rand2 = randomChar()

  return init + yr + '-' + mth + rand1 + d[1] + rand2 + d[0]
}

module.exports = createOrderNumber
