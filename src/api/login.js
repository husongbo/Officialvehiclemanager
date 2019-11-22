import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}
export function loginByUsernameCode(username, password, validateCode) {
  debugger
  const data = {
    user_name: username,
    user_pwd: password,
    validate_code: validateCode

  }
  return request({
    url: '/Public/Login',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 获取用户权限信息
export function getUserInfoPower(userid) {
  return request({
    url: '/Public/GetUserPowerList',
    method: 'get',
    params: { user_id: userid }
  })
}

export function ChangePwd(data){
  return request({
    url:'/Public/ChangePwd',
    method:'get',
    params:data
  })
}

//注册企业用户
export function RegisterCompanyUser(data){
    return request({
        url:'/Manage/RegisterCompanyUser',
        method:'get',
        params:data
    })
}

//更新用户信息
export function UpdateCompanyUser(data){
    return request({
        url:'/Manage/UpdateCompanyUser',
        method:'get',
        params:data
    })
}

//注册企业信息
export function RegisterCompany(data){
    return request({
        url:'/Manage/RegisterCompany',
        method:'get',
        params:data
    })
}

//更新企业信息
export function UpdateCompanyInfo(data){
    return request({
        url:'/Manage/UpdateCompanyInfo',
        method:'get',
        params:data
    })
}

//检查信用代码是否存在
export function CheckYYDM(data){
    return request({
        url:'/Manage/CheckYYDM',
        method:'get',
        params:data
    })
}
