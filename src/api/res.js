import request from '@/utils/req'

// export function fetchList(query) {
//   return request({
//     url: '/gasPriceManage/list',
//     method: 'get',
//     params: query
//   })
// }
// 商户备付金信息列表
export function getLists(query) {
  return request({
    url: '/hdptlog/info.log',
    method: 'get',
    param: query
  })
}

