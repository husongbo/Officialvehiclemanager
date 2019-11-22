import Vue from 'vue'
import Router from 'vue-router'
import Personal from './personal'

Vue.use(Router)



let RouteList = [
  {
    path: '/',
    component: resolve => require(['@/views/layout/App.vue'], resolve),
    meta: {
      title: '首页',
      keepAlive: false,
    },
    children: [
      {
        path: '/',
        name: 'Dashboard',
        meta: {
          title: '首页',
          keepAlive: true
        },
        component: resolve => require(['@/views/home/Index.vue'], resolve),
      },
      {
          path: '/Consumption_data',
          name: 'Consumptiondata',
          meta: {
              title: '消费数据',
              keepAlive: false
          },
          component: resolve => require(['@/views/Consumption/Consumptiondata.vue'], resolve),
      },
        {
            path: '/Employees_System',
            name: 'User_Information',
            meta: {
                title: '企业员工管理',
                keepAlive: false
            },
            component: resolve => require(['@/views/Businessmanagement/Employees_System.vue'], resolve),
        },
        {
            path: '/Recharge_System',
            name: 'Recharge',
            meta: {
                title: '企业资金管理',
                keepAlive: false
            },
            component: resolve => require(['@/views/fundmanagement/fundmanagement.vue'], resolve),
        },
        {
            path: '/Examine_System',
            name: 'Examine_System',
            meta: {
                title: '企业资金审核',
                keepAlive: false
            },
            component: resolve => require(['@/views/fundmanagement/fundmanagementexamine.vue'], resolve),
        },
        {
            path: '/EnterpriseCenter',
            name: 'EnterpriseCenter',
            meta: {
                title: '企业中心',
                keepAlive: false
            },
            component: resolve => require(['@/views/EnterpriseCenter/EnterpriseCenter.vue'], resolve),
        },
        {
            path: '/Enterprise_System',
            name: 'Enterprise_System',
            meta: {
                title: '企业车辆管理',
                keepAlive: false
            },
            component: resolve => require(['@/views/Businessmanagement/Enterprise_System.vue'], resolve),
        },
        {
            path: '/Registration_Audit',
            name: 'Registration_Audit',
            meta: {
                title: '企业注册审核',
                keepAlive: false
            },
            component: resolve => require(['@/views/RegistrationAudit/RegistrationAudit.vue'], resolve),
        },
      {
        path: '/font_awesome',
        name: 'FontAwesome',
        meta: {
          title: 'FontAwesome 图标',
          keepAlive: false
        },
        component: resolve => require(['@/views/icon/FontAwesome.vue'], resolve),
      },
      {
        path: '/element_icon',
        name: 'ElementIcon',
        meta: {
          title: 'Element 图标',
          keepAlive: false
        },
        component: resolve => require(['@/views/icon/ElementIcon.vue'], resolve),
      },
      {
        path: '/post_manage',
        name: 'PostManage',
        meta: {
          title: '文章管理',
          keepAlive: false
        },
        component: resolve => require(['@/views/contentManage/Index.vue'], resolve),
      },
      {
        path: '/user_manage',
        name: 'UserManage',
        meta: {
          title: '用户列表',
          keepAlive: true
        },
        component: resolve => require(['@/views/userManage/Index.vue'], resolve),
      },
      {
        path: '/category_manage',
        name: 'CategoryManage',
        meta: {
          title: '分类列表',
          keepAlive: true
        },
        component: resolve => require(['@/views/categoryManage/Index.vue'], resolve),
      },
      {
        path: '/role_manage',
        name: 'RoleManage',
        meta: {
          title: '角色列表',
          keepAlive: true
        },
        component: resolve => require(['@/views/permissionManage/role/Role.vue'], resolve),
      },
      {
        path: '/permission_list',
        name: 'PermissionList',
        meta: {
          title: '权限列表',
          keepAlive: true
        },
        component: resolve => require(['@/views/permissionManage/permission/Index.vue'], resolve),
      },
        //菜单管理
        {
            path: '/menu_management',
            name: 'Menumanagement',
            meta: {
                title: '菜单管理',
                keepAlive: true
            },
            component: resolve => require(['@/views/Menumanagement/Menumanagement.vue'], resolve),
        },
        //权限管理
        {
            path: '/Authority_Management',
            name: 'AuthorityManagement',
            meta: {
                title: '权限管理',
                keepAlive: true
            },
            component: resolve => require(['@/views/AuthorityManagement/AuthorityManagement.vue'], resolve),
        },
      //个人中心，可能有修改密码，头像修改等路由
      Personal.index,
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: false
    },
    components: {
      blank: resolve => require(['@/views/login/Login.vue'], resolve),
    }
  },
    {
        path: '/register',
        name: 'Register',
        meta: {
            title: '注册',
            keepAlive: false
        },
        components: {
            blank: resolve => require(['@/views/register/register.vue'], resolve),
        }
    },

]


RouteList[0].children.push({
  path: '/build_code',
  name: 'BuildCode',
  meta: {
    title: '构建代码',
    keepAlive: true
  },
  component: resolve => require(['@/views/developmentTool/Build.vue'], resolve),
});

export default new Router({routes: RouteList})


