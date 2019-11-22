<template>
  <div class="main" v-loading="listLoading">
    <div class="header">
      <div class="logo" style="height: 200px;">
        <div style="">
          <div class="big" style="margin-right: 10px;">公务用车平台</div>
          <div style="display: flex;justify-content: center;"><img width="40" class="mins" style="margin-top: 5px" src="../../assets/images/logo.png" alt=""></div>

        </div>

        <span class="min">
          <img width="40" style="margin-top: 5px" src="../../assets/images/logo.png" alt="">
        </span>
      </div>
      <span class="header-btn" @click="hiddenSidebar">
        <i class="el-icon-menu"></i>
      </span>
      <div class="right">
        <span class="header-btn" @click="screenfullToggle">
            <i class="fa fa-arrows-alt"></i>
        </span>

        <el-dropdown>
          <span class="header-btn">
               <i class="el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div style="padding: 10px;text-align: center;width: 420px">
              <div class="setting-category">
                <el-switch
                    @change="saveSwitchTabBarVal"
                    v-model="switchTabBar"
                    active-text="开启TabBar"
                    inactive-text="关闭TabBar">
                </el-switch>
                <el-switch
                    @change="saveFixedTabBar"
                    v-if="switchTabBar"
                    v-model="fixedTabBar"
                    style="margin-top: 10px"
                    active-text="固定在顶部"
                    inactive-text="随页面滚动">
                </el-switch>
                <!--<el-alert-->
                    <!--v-if="switchTabBar"-->
                    <!--style="margin-top: 10px"-->
                    <!--title="导航标签超过容器时,可在导航上滚动鼠标来移动标签"-->
                    <!--type="info"-->
                    <!--show-icon>-->
                <!--</el-alert>-->
              </div>
              <!--<div class="setting-category" style="display: flex;height: 80px;align-items: center">-->
                <!--<div style="width: 80px">-->
                  <!--<el-button  type="primary" icon="el-icon-sort" circle @click="ToggleGrayMode" style="transform: rotate(90deg)"></el-button>-->
                <!--</div>-->
                <!--<div style="flex: 1;margin-top: -8px">-->
                  <!--<el-alert-->
                          <!--style="margin-top: 10px"-->
                          <!--title="切换灰度模式!"-->
                          <!--type="info"-->
                          <!--show-icon>-->
                  <!--</el-alert>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="setting-category">-->
                <!--下个设置块-->
              <!--</div>-->

            </div>
          </el-dropdown-menu>
        </el-dropdown>

        <!--<span class="header-btn">-->
            <!--<el-badge :value="3" class="badge">-->
                    <!--<i class="el-icon-bell"></i>-->
            <!--</el-badge>-->
        <!--</span>-->
        <el-dropdown>
          <span class="header-btn">
              {{Real_Name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/')"><i style="padding-right: 8px" class="fa fa-cog"></i>首页</el-dropdown-item>
            <el-dropdown-item @click.native="logout"><i style="padding-right: 8px" class="fa fa-key"></i>退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="app">
      <div class="aside">
        <div class="menu">
          <el-menu
              router
              background-color="rgb(48, 65, 86)"
              text-color="#fff"
              :default-active="$route.path" class="menu" @open="handleOpen" @close="handleClose"
              :collapse="isCollapse">
            <template v-for="(menu_v,menu_k) in MenuList">
              <el-submenu v-if="menu_v.children" :index="menu_k+''">
                <template slot="title">
                  <i :class="menu_v.icon"></i>
                  <span slot="title">{{ menu_v.rule_zh_name }}</span>
                </template>
                <el-menu-item v-for="(menuChildren_v,menuChildren_k) in menu_v.children"
                              :key="menuChildren_k"
                              :index="menuChildren_v.path+''">
                  <i class="is-children fa fa-circle-o"></i>
                  <span slot="title">{{ menuChildren_v.rule_zh_name }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="menu_v.path+''">
                <i :class="menu_v.icon"></i>
                <span slot="title">{{ menu_v.rule_zh_name }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="sidebar-toggle" @click="sidebarToggle">
          <div class="icon-left">
            <i class="el-icon-back"></i>
          </div>
        </div>
      </div>
      <div class="app-body">
        <NavBar id="nav-bar" v-if="switchTabBar" :style="fixedTabBar && switchTabBar?'position: fixed;top: 0;':''"></NavBar>
        <div v-else style="margin-top: 50px;"></div>
        <div id="mainContainer" :style="fixedTabBar && switchTabBar?'margin-top: 88px;':''" class="main-container">
          <transition name="fade-transform" mode="out-in">
            <router-view @changemenulist="getmenulist"></router-view>
          </transition>
        </div>
        <EuiFooter></EuiFooter>
      </div>
    </div>
  </div>
</template>

<script>
  import Screenfull from 'screenfull'
  import EuiFooter from './Footer.vue';
  import NavBar from './NavBar.vue'
  import Menu from '@/menu/index';
  import {GetRuleList,ExitCompany} from '../../api/user'
  import {mapState,mapMutations} from 'vuex'
  import menu from "../../menu/menu";
  import util from "../../utils/util";
  export default {
    data() {
      return {
        fixedTabBar:false,
        switchTabBar: false,
        siteName: this.$Config.siteName,
        isCollapse: false,
        menu: Menu,
          MeunList:[],
          menarr:'',
          Menus:{},
          listLoading:true,
          MenuList:[],
          Real_Name:'',
      };
    },
      computed: mapState(['RoleArr']),
      watch:{
          RoleArr(news,olds){
              // console.log(news)
              this.MenuList=news
          }
      },
      mounted(){

          var userid= sessionStorage.getItem(this.$Config.tokenKey);

          var data={
              user_id:userid.replace("\"","").replace("\"","")
          }
          this.$store.dispatch('aa',data)
      },
      created(){
          var User=JSON.parse(localStorage.getItem('UserInfo'))
          this.Real_Name=User.real_name
          // console.log(User)
      },
    methods: {
      NavBarWidth(){
        let navBar = document.getElementById('nav-bar');
        if(!navBar)return;
        if(!(this.fixedTabBar && this.switchTabBar)){navBar.style.width = '100%';return;}
        let sidebarClose =  document.body.classList.contains('sidebar-close')
        if(sidebarClose) {navBar.style.width = '100%';return;}
        if(this.isCollapse) navBar.style.width = 'calc(100% - 64px)';
        else navBar.style.width = 'calc(100% - 230px)';

      },
      ToggleGrayMode(){
        document.body.classList.toggle("gray-mode")
      },
      screenfullToggle(){
        if (!Screenfull.enabled) {
          this.$message({
            message: '你的浏览器不支持全屏！',
            type: 'warning'
          })
          return false
        }
        Screenfull.toggle();
      },
      saveFixedTabBar(v){
        v ? localStorage.setItem('fixedTabBar', v) : localStorage.removeItem('fixedTabBar');
        this.NavBarWidth();
      },
      saveSwitchTabBarVal(v) {
        let containerDom = document.getElementById('mainContainer');
        v ? containerDom.style.minHeight = 'calc(100vh - 139px)' : containerDom.style.minHeight = 'calc(100vh - 101px)';
        v ? localStorage.setItem('switchTabBar', v) : localStorage.removeItem('switchTabBar');
        this.NavBarWidth();
      },
      sidebarToggle(e) {
        e.preventDefault();
        if (this.isCollapse) {

          document.body.classList.remove('sidebar-hidden')
          this.siteName = this.$Config.siteName
          this.isCollapse = false;
        } else {
          document.body.classList.add('sidebar-hidden')
          this.isCollapse = true;
        }
        this.NavBarWidth();

      },
      hiddenSidebar(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-close');
        this.NavBarWidth();
      },
      logout() {
          this.listLoading=true
          sessionStorage.removeItem(this.$Config.tokenKey);
          this.$notify({
              title: '退出成功',
              message: '',
              type: 'success',
              duration: 2000
          });
          setTimeout(()=>{
              this.listLoading=false
              this.$router.push({path: '/login'});
          },1000)
      },
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //关闭菜单
      },
        getmenulist(){

          console.log("执行")
            var flag=false
            var _this=this
            // console.log(this.menu)
            var userid= sessionStorage.getItem(this.$Config.tokenKey);

            var data={
                user_id:userid.replace("\"","").replace("\"","")
            }
            this.$store.dispatch('aa',data)
            GetRuleList(data).then((res)=>{
                _this.menarr=res.data.data
                console.log(_this.menarr)
                _this.menarr.forEach((item)=>{
                    if(item.pid==0){
                        _this.MeunList.push(item)
                    }
                    _this.MeunList.forEach((it)=>{
                        if(it.id==item.pid){
                            if(it.children==undefined){
                                it.children=[]
                            }
                            it.children.push(item)
                        }
                    })
                })
            console.log(_this.MeunList)
            _this.Menus.home=_this.menu.home
            _this.MeunList.forEach((val)=>{
                if(val.rule_en_name==_this.menu.system_manage.text){//系统管理
                    _this.Menus.system_manage=_this.menu.system_manage
                    _this.Menus.system_manage.name=val.rule_zh_name
                    if(val.children!=undefined){
                        val.children.forEach((child)=>{
                            if(child.rule_en_name==_this.menu.system_manage.children.meun_manager.text){//菜单管理
                                _this.Menus.system_manage.children.meun_manager.name=child.rule_zh_name
                                _this.Menus.system_manage.children.meun_manager=_this.menu.system_manage.children.meun_manager
                                _this.Menus.system_manage.children.meun_manager.flag=true
                            }
                            else if(child.rule_en_name==_this.menu.system_manage.children.permission.text){
                                _this.Menus.system_manage.children.permission.name=child.rule_zh_name
                                _this.Menus.system_manage.children.permission=_this.menu.system_manage.children.permission
                                _this.Menus.system_manage.children.permission.flag=true
                            }
                            else if(child.rule_en_name==_this.menu.system_manage.children.Authority_Management.text){
                                _this.Menus.system_manage.children.Authority_Management.name=child.rule_zh_name
                                _this.Menus.system_manage.children.Authority_Management=_this.menu.system_manage.children.Authority_Management
                                _this.Menus.system_manage.children.Authority_Management.flag=true
                            }
                        })
                    }
                }
                else if(val.rule_en_name==_this.menu.user_manage.text){//用户管理
                    _this.Menus.user_manage=_this.menu.user_manage
                    _this.Menus.user_manage.name=val.rule_zh_name
                    if(val.children!=undefined){
                        val.children.forEach((child)=>{
                            if(child.rule_en_name==_this.menu.user_manage.children.Usermanger.text){
                                _this.Menus.user_manage.children.Usermanger.name=child.rule_zh_name
                                _this.Menus.user_manage.children.Usermanger=_this.menu.user_manage.children.Usermanger
                                _this.Menus.user_manage.children.Usermanger.flag=true
                            }
                        })
                    }
                }
                else if(val.rule_en_name==_this.menu.company_manage.text) {//企业管理
                    // console.log(_this.menu.company_manage.children.Employees.text)
                    _this.Menus.company_manage = _this.menu.company_manage
                    _this.Menus.company_manage.name=val.rule_zh_name
                    // console.log(val)
                    if (val.children != undefined) {
                        val.children.forEach((child) => {

                            if(child.rule_en_name==_this.menu.company_manage.children.Employees.text){
                                _this.Menus.company_manage.children.Employees.name=child.rule_zh_name
                                _this.Menus.company_manage.children.Employees=_this.menu.company_manage.children.Employees
                                _this.Menus.company_manage.children.Employees.flag=true
                            }
                            else if(child.rule_en_name==_this.menu.company_manage.children.Enterprise.text){
                                _this.Menus.company_manage.children.Enterprise.name=child.rule_zh_name
                                _this.Menus.company_manage.children.Enterprise=_this.menu.company_manage.children.Enterprise
                                _this.Menus.company_manage.children.Enterprise.flag=true
                            }
                            else if(child.rule_en_name==_this.menu.company_manage.children.Management.text){
                                _this.Menus.company_manage.children.Management.name=child.rule_zh_name
                                _this.Menus.company_manage.children.Management=_this.menu.company_manage.children.Management
                                _this.Menus.company_manage.children.Management.flag=true
                            }else if(child.rule_en_name==_this.menu.company_manage.children.Recharge.text){
                                _this.Menus.company_manage.children.Recharge.name=child.rule_zh_name
                                _this.Menus.company_manage.children.Recharge=_this.menu.company_manage.children.Recharge
                                _this.Menus.company_manage.children.Recharge.flag=true
                            }
                            else if(child.rule_en_name==_this.menu.company_manage.children.EnterpriseCenter.text){
                                _this.Menus.company_manage.children.EnterpriseCenter.name=child.rule_zh_name
                                _this.Menus.company_manage.children.EnterpriseCenter=_this.menu.company_manage.children.EnterpriseCenter
                                _this.Menus.company_manage.children.EnterpriseCenter.flag=true
                            }

                        })
                    }
                }
                else if(val.rule_en_name==_this.menu.Consumption.text){
                    this.Menus.Consumption = _this.menu.Consumption
                    _this.Menus.Consumption.name=val.rule_zh_name
                }
            })
                setTimeout(()=>{
                    _this.listLoading=false
                },1000)
                // console.log(_this.Menus)
            })
        }
    },
    mounted: function () {

      this.getmenulist()
      this.switchTabBar = localStorage.getItem('switchTabBar') ? true : false;
      this.fixedTabBar = localStorage.getItem('fixedTabBar') ? true : false;
      if(this.switchTabBar)document.getElementById('mainContainer').style.minHeight = 'calc(100vh - 139px)';



      if (!this.isCollapse) {

        document.body.classList.remove('sidebar-hidden')
        this.siteName = this.$Config.siteName
      } else {
        document.body.classList.add('sidebar-hidden')
      }

      setTimeout(()=>{this.NavBarWidth();},1000)
    },
    components: {
      EuiFooter, NavBar
    },
  }
</script>
<style lang="scss">
  @import "../../assets/css/variables.scss";
  .sidebar-hidden {
    .header {
      .logo {
        background:rgb(48, 65, 86)!important;
        .big {
          display: none;
        }
        .min {
          display: block;
          margin-top: 20px;
        }
        .mins{
          display: none;
        }
        width: 64px;
      }

    }
    .aside{
      .sidebar-toggle{
        .icon-left{
          transform: rotate(180deg);
        }
      }
    }
    .main {
      .app-body {
        margin-left: 64px;
      }
    }
  }
  .sidebar-close{
    .header {
      .logo {
        width: 0;
        overflow: hidden;
      }
    }
    .aside{
     margin-left: -230px;
    }
    .main {
      .app-body {
        margin-left: 0;
      }
    }
  }
  .sidebar-hidden.sidebar-close{
    .aside{
      margin-left: -64px;
    }
  }


  .main {
    display: flex;
    .el-menu:not(.el-menu--collapse) {
      width: 230px;
    }
    .app {
      width: 100%;
      background-color: #ecf0f5;
    }
    .aside {
      position: fixed;
      margin-top: 100px;
      z-index: 10;
      /*background-color: #222d32;*/
      background-color:#3c8dbc;
      transition: all 0.3s ease-in-out;
      .menu{
        overflow-y: auto;
        height: calc(100vh - 150px);
      }
      .sidebar-toggle{
        position: relative;
        width: 100%;
        height: 50px;

        background-color: mix(#000,$--color-primary,10%);;
        color: #fff;
        cursor: pointer;
        .icon-left{
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 0;
          width: 64px;
          height: 100%;
          font-size: 20px;
          transition: all 0.3s ease-in-out;
        }
      }
    }
    .app-body {
      margin-left: 230px;
      -webkit-transition: margin-left 0.3s ease-in-out;
      transition: margin-left 0.3s ease-in-out;
    }
    .main-container {
      //margin-top: 50px;
      padding: 6px;
      min-height: calc(100vh - 101px);
      background: white;
    }
  }

  .header {
    width: 100%;
    position: fixed;
    display: flex;
    height: 50px;
    background-color:rgb(48, 65, 86);
    z-index: 10;
    .logo {
      .min {
        display: none;
      }
      .mins{
        display: block;
      }
      width: 230px;
      height: 50px;
      text-align: center;
      overflow: hidden;
      line-height: 50px;
      color: #fff;
      background-color:rgb(48, 65, 86);
      -webkit-transition: width 0.35s;
      transition: all 0.3s ease-in-out;
    }
    .right {
      position: absolute;
      right: 0;
    }
    .header-btn {
      .el-badge__content {
        top: 14px;
        right: 7px;
        text-align: center;
        font-size: 9px;
        padding: 0 3px;
        background-color: #00a65a;
        color: #fff;
        border: none;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25em;
      }
      overflow: hidden;
      height: 50px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      padding: 0 14px;
      color: #fff;
      &:hover {
        background-color: mix(#000,$--color-primary,10%);
      }
    }

  }

  .menu {
    border-right: none;
  }

  .el-menu--vertical {
    min-width: 190px;
  }
  .setting-category{
    padding:10px 0;
    border-bottom: 1px solid #eee;
  }
</style>
