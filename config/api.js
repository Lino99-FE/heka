

const api = {
  views: {
    url: '/api/views',
    type: 'get'
  },
  viewDetail: {
    url: '/api/view/{queryString}',
    type: 'get'
  },
  keyWords: {
    url: '/api/keywords',
    type: 'get'
  },
  wishes: {
    url: '/api/wishes',
    type: 'get'
  },
  categories: {
    url: '/api/categories',
    type: 'get'
  },
  informations: {
    url: '/api/informations',
    type: 'get'
  }

  
}

export default api