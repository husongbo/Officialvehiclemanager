import request from '@/utils/request'

// export function fetchList(query) {
//   return request({
//     url: '/gasPriceManage/list',
//     method: 'get',
//     params: query
//   })
// }
// http://192.168.10.23:9100/Public/GetRolePowerMeun
export function fetchRolePower(query) {
  debugger
  return request({
    url: '/Public/GetRolePowerMeun',
    method: 'get',
    params: query
  })
}

// 查看角色列表 http://192.168.10.23:9100/Public/GetRoleList
export function getRoleList(query) {
  debugger
  return request({
    url: '/Public/GetRoleList',
    method: 'get',
    params: query
  })
}
// 查看角色权限列表 http://192.168.10.23:9100/Public/GetRolePowerList
export function fetchRolePowerById(query) {
  debugger
  return request({
    url: '/Public/GetRolePowerList',
    method: 'get',
    params: query
  })
}
// http://192.168.10.23:9100/Public/GetUserListByRoleId
export function getUserListByRoleId(query) {
  debugger
  return request({
    url: '/Public/GetUserListByRoleId',
    method: 'get',
    params: query
  })
}

export function SubMitRolePower(query) {
  return request({
    url: '/Public/SubMitRolePower',
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

// userManage
export function fetchUserList(query) {
  return request({
    url: '/Public/GetUserList',
    method: 'get',
    params: query
  })
}

// edit user infomation SubMitUserInfo
export function SubMitUserInfo(query) {
  return request({
    url: '/Manage/SubMitUserInfo',
    method: 'get',
    params: query
  })
}


//添加菜单
export function SubMitAuthInfo(query) {
    return request({
        url: '/Manage/SubMitAuthInfo',
        method: 'get',
        params: query
    })
}


//权限管理列表
//添加菜单
export function GetRoleList(query) {
    return request({
        url: '/Manage/GetRoleList',
        method: 'get',
        params: query
    })
}
//菜单列表
    export function GetMeunList(query) {
        return request({
            url: '/Manage/GetMeunList',
            method: 'get',
            params: query
        })
}

//添加权限
export function SubMiRoleInfo(query) {
    return request({
        url: '/Manage/SubMiRoleInfo',
        method: 'get',
        params: query
    })
}
