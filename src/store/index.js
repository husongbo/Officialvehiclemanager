import Vue from 'vue'
import Vuex from 'vuex'
import {GetRuleList} from '@/api/user'
import menu from '@/menu/menus';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    RoleArr:[]
  },
  mutations: {
      FilterMenu(state,id){
          let datalist=[]
          let RoleList=[]
          RoleList.push({
              rule_zh_name: '首页',
              path: '/',
              icon: 'fa fa-tachometer',
          })
          var userid=id;
          var data={
              userid
          }
          console.log(menu)
          GetRuleList(userid).then((res)=>{
              datalist=res.data.data

              datalist.forEach((item)=>{
                  menu.forEach((menutext)=>{
                      if(item.rule_en_name==menutext.text){
                          if(menutext.path!=undefined){
                              item.path=menutext.path
                          }
                          item.icon=menutext.icon
                      }
                      else{
                          if(menutext.children!=undefined){
                            menutext.children.forEach((child)=>{
                              if(child.text==item.rule_en_name){
                                  item.path=child.path
                              }
                            })
                          }
                      }
                  })
              })
              datalist.forEach((item)=>{
                  menu.forEach((menutext)=>{
                      if(item.rule_en_name==menutext.text){
                          RoleList.push(item)
                      }
                  })
              })
              datalist.forEach((item)=>{
                  if(RoleList.length!=0){
                      RoleList.forEach((Role)=>{
                          if(Role.id==item.pid){
                              if(Role.children==undefined){
                                  Role.children=[]
                                  Role.children.push(item)
                              }
                              else{
                                  Role.children.push(item)
                              }
                          }
                      })
                  }
              })
              state.RoleArr=RoleList
          })
      }
  },
    actions:{
      aa({commit},id){
        commit('FilterMenu',id)
      }
    }
})


