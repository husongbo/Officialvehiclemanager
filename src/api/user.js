import request from '../utils/request.js'

export function login(params) {
  return request({
    url: '/Manage/Login',
    method: 'post',
    data: params
  })
}

export function sendSMS(params) {
  return request({
    url: '/pc/sendsms',
    method: 'get',
    params: params
  })
}

export function GetRuleList(params) {
    return request({
        url: '/Manage/GetRuleList',
        method: 'get',
        params: params
    })
}

//用户管理列表
export function GetUserList(params) {
    return request({
        url: '/Manage/GetUserList',
        method: 'get',
        params: params
    })
}

//企业信息列表
export function GetCompanyList(params) {
    return request({
        url: '/manage/GetCompanyList',
        method: 'get',
        params: params
    })
}

//企业信息管理
export function SubMitCompanyInfo(params) {
    return request({
        url: '/manage/SubMitCompanyInfo',
        method: 'get',
        params: params
    })
}


//退出当前企业
export function ExitCompany(params) {
    return request({
        url: '/manage/ExitCompany',
        method: 'get',
        params: params
    })
}