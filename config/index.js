const productURL = 'https://portal.pinfire.cn'
const devURL = 'https://saas.dev.pinquest.cn'
const env = 'dev'
// const env = 'product'
const baseURL = env === 'product' ? productURL : devURL
export {
  baseURL,
  env
}
