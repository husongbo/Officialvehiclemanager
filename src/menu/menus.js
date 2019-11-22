let menu = [];

/**
 * 首页
 * @type {{name: string, path: string, icon: string}}
 */
menu.push({//0
    name: '首页',
    path: '/',
    icon: 'fa fa-tachometer',
    text:'home'
});

/**
 * 消费数据
 * @type {{name: string, icon: string, children: {}}}
 */
menu.push({//1
    name: '消费数据',
    icon: 'fa fa-th',
    path:'/Consumption_data',
    text:'Consumption'
});
menu.push({//2
    name: '企业管理',
    icon: 'fa fa-sitemap',
    text:'company_manage',
    children:[
        {
            name: '企业员工管理',
            path: '/Employees_System',
            flag:false,
            text:'User_Information'
        },
        {
            name: '企业车辆管理',
            path: '/Enterprise_System',
            flag:false,
            text:'Enterprise'
        },
        {
            name: '企业注册审核',
            path: '/Registration_Audit',
            flag:false,
            text:'Registration_Audit'
        },
        {
            name: '用车制度管理',
            path: '/Enterprise_System',
            flag:false,
            text:'Management'
        },
        {
            name: '企业资金管理',
            path: '/Examine_System',
            flag:false,
            text:'Examine_System'
        },
        {
            name: '企业资金审核',
            path: '/Recharge_System',
            flag:false,
            text:'Recharge'
        },
        {
            name: '企业中心',
            path: '/EnterpriseCenter',
            flag:false,
            text:'EnterpriseCenter'
        }
    ]
});
menu.push({
    name: '用户管理',
    icon: 'fa fa-user-circle-o',
    text:'user_manage',
    children: [
        {
            name: '用户信息',
            path: '/user_manage',
            text:'Usermanger',
            flag:false
        },

    ]
});
menu.push({
    name: '系统管理',
    icon: 'fa fa-qrcode',
    text:'system_manage',
    children: [
        {
            name: '菜单管理',
            path: '/menu_management',
            text:'meun_manager',
            flag:false,
        },
        {
            name: '权限管理',
            path: '/Authority_Management',
            text:'Authority_Management',
            flag:false,
        },
        {
            name: '权限列表',
            path: '/permission_list',
            text:'permission',
            flag:false,
        }

    ]
});
export default menu;

