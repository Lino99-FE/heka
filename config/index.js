const productURL = 'https://heka.saasphp.cn'
const devURL = 'https://heka.saasphp.cn'
const env = 'dev'
// const env = 'product'
const baseURL = env === 'product' ? productURL : devURL
export {
  baseURL,
  env
}