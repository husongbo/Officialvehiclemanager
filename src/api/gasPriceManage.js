import request from '@/utils/request'

// export function fetchList(query) {
//   return request({
//     url: '/gasPriceManage/list',
//     method: 'get',
//     params: query
//   })
// }

export function fetchList(query) {
  debugger
  return request({
    url: '/OilInfoManage/GetOilInfoList',
    method: 'get',
    params: query
  })
}

export function createUnifiedPrice(query) {
  return request({
    url: '/OilInfoManage/SubMitOilInfo',
    method: 'get',
    params: query
  })
}

// export function createUnifiedPrice(data) {
//   // data = JSON.stringify(data)
//   return request({
//     url: '/OilInfoManage/SubMitOilInfo',
//     method: 'post',
//     data
//   })
// }

// http://192.168.10.23:9100/OilInfoManage/GetStationList?dataType=3&province_id=1&city_id=2
export function fetchStations(query) {
  return request({
    url: '/OilInfoManage/GetStationList',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
