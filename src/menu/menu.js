let menu = {};

/**
 * 首页
 * @type {{name: string, path: string, icon: string}}
 */
menu.home = {
  name: '首页',
  path: '/',
  icon: 'fa fa-tachometer',
};

/**
 * 消费数据
 * @type {{name: string, icon: string, children: {}}}
 */
menu.Consumption = {
    name: '消费数据',
    icon: 'fa fa-th',
    path:'/Consumption_data',
    text:'Consumption'
};
menu.company_manage = {
    name: '企业管理',
    icon: 'fa fa-sitemap',
    text:'company_manage',
    children:{}
};
let Businesschild = menu.company_manage.children;
Businesschild.Employees = {
    name: '企业用户信息',
    path: '/Employees_System',
    flag:false,
    text:'User_Information'
};
Businesschild.Enterprise = {
    name: '企业车辆管理',
    path: '/Enterprise_System',
    flag:false,
    text:'Enterprise'
};
Businesschild.Management = {
    name: '用车制度管理',
    path: '/Management_System',
    flag:false,
    text:'Management'
};
Businesschild.Recharge = {
    name: '充值',
    path: '/Recharge_System',
    flag:false,
    text:'Recharge'
};
Businesschild.EnterpriseCenter = {
    name: '企业中心',
    path: '/EnterpriseCenter_System',
    flag:false,
    text:'EnterpriseCenter'
};
// let icon = menu.font_icon.children;
//
// icon.font_awesome = {
//     name: 'FontAwesome 4.7',
//     path: '/font_awesome',
//
// };
// icon.element_icon = {
//     name: 'ElementIcon',
//     path: '/element_icon',
// };




/**
 * 字体图标
 * @type {{name: string, icon: string, children: {}}}
 */
// menu.font_icon = {
//   name: '字体图标',
//   icon: 'fa fa-th',
//   children: {}
// };
// let icon = menu.font_icon.children;
//
// icon.font_awesome = {
//   name: 'FontAwesome 4.7',
//   path: '/font_awesome',
//
// };
// icon.element_icon = {
//   name: 'ElementIcon',
//   path: '/element_icon',
// };

/**
 * 内容管理
 * @type {{name: string, icon: string, children: {}}}
 */
// menu.content_manage = {
//   name: '内容管理',
//   icon: 'fa fa-file-text-o',
//   children: {}
// };
//
// let ContentManage = menu.content_manage.children;
//
// ContentManage.post = {
//   name: '文章管理',
//   path: '/post_manage',
// };

/**
 * 用户管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.user_manage = {
  name: '用户管理',
  icon: 'fa fa-user-circle-o',
    text:'user_manage',
    children: {}
};
let UserManage = menu.user_manage.children;
//
UserManage.Usermanger = {
  name: '用户信息',
  path: '/user_manage',
    text:'Usermanger',
    flag:false
};


/**
 * 分类管理
 * @type {{name: string, icon: string, children: {}}}
 */
// menu.category_manage = {
//   name: '分类管理',
//   icon: 'fa fa-sitemap',
//   children: {}
// };
// let CategoryManage = menu.category_manage.children;
//
// CategoryManage.category = {
//   name: '分类列表',
//   path: '/category_manage',
// };



menu.system_manage = {
  name: '系统管理',
  icon: 'fa fa-qrcode',
    text:'system_manage',
  children: {}
};
let PermissionManage = menu.system_manage.children;

PermissionManage.meun_manager = {
  name: '菜单管理',
  path: '/menu_management',
    text:'meun_manager',
    flag:false,
};
PermissionManage.Authority_Management = {
    name: '权限管理',
    path: '/Authority_Management',
    text:'Authority_Management',
    flag:false,
};

PermissionManage.permission = {
  name: '权限列表',
  path: '/permission_list',
    text:'permission',
    flag:false,
};
// menu.aa=function(){
//     alert("aa")
// }
export default menu;
//
// if(process.env.NODE_ENV=='development'){
//
//   menu.development_tools = {
//     name: '开发工具',
//     icon: 'fa fa-wrench',
//     children: {}
//   };
//
//   let DevelopmentTools = menu.development_tools.children;
//
//   DevelopmentTools.code = {
//     name: '构建代码',
//     path: '/build_code',
//   };
//
// }
