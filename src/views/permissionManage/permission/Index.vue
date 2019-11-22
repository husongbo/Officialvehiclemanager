<template>
  <div class="category">
    <div class="pull-right offscreen-right mt5" style="margin: 50px 0;margin-right: 100px;">
      <el-button size="medium" icon="el-icon-circle-plus" @click="openAdd"> 新建用户</el-button>
    </div>
    <el-table
            v-loading="listLoading"
            :data="tableData"
            size="small"
            header-align="center"
            style="width: 100%"
    >
      <el-table-column
              sortable
              prop="name"
              label="用户名"
              header-align="center"
              align="center"
      />
      <el-table-column
              sortable
              prop="names"
              label="姓名"
              header-align="center"
              align="center"
      />
      <el-table-column
              sortable
              prop="email"
              label="用户邮箱"
              header-align="center"
              align="center"
      />
      <el-table-column
              sortable
              prop="phone"
              label="手机号"
              header-align="center"
              align="center"
      />
      <el-table-column
              sortable
              prop="role"
              label="角色"
              header-align="center"
              align="center"
      />
      <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="statess"
              label="账号状态"
              header-align="center"
              align="center"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.statess!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-if="scope.row.statess==1" class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column
              prop="userOnline"
              label="操作"
              width="120">
        <template slot-scope="scope">
          <el-dropdown @command="dropdownCommand">
            <el-button size="mini">
              <i class="el-icon-setting"/>
              <span class="el-icon-arrow-down"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type:'menu'}">
                分配权限
              </el-dropdown-item>
              <el-dropdown-item :command="{type:'edituser'}">
                修改
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
            :current-page="pageForm.pageNumber"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageForm.pageSize"
            :total="pageForm.totalCount"
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChange"
            @current-change="pageNumberChange"/>
    <!--权限列表分页-->

    <el-dialog
            title="分配权限"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose">
      <el-tree
              :data="data2"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[1]"
              :props="defaultProps"
              @check-change="handleCheckChange">
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{scope.data.label}}</span>
          <span>
            <span  style="font-weight: bold">菜单权限 </span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


    <!--编辑用户-->
    <el-dialog
            :visible.sync="editDialogVisible"
            title="编辑用户"
            width="40%">
      <el-form ref="editForm" :model="Data" :rules="editRules" size="small" label-width="80px">

        <el-form-item prop="name" label="用户名">
          {{ Data.name }}
        </el-form-item>

        <el-form-item prop="names" label="姓名">
          <el-input
                  v-model="Data.names"
                  maxlength="20"
                  placeholder="姓名"
                  auto-complete="off"
                  tabindex="3"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input
                  v-model="Data.phone"
                  maxlength="20"
                  placeholder="手机号码"
                  auto-complete="off"
                  tabindex="6"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select v-model="Data.role" placeholder="请选择" filterable clearable @change="changeRole">
            <el-option
                    v-for="item in rolesOptions"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showRoleSelect" prop="addstore_name" label="商户平台">
          <el-select v-model="formData.ms_merchant_id" clearable placeholder="选择商户平台">
            <el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"
                       :value="item.balance_id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="emial" label="单位邮箱">
          <el-input
                  v-model="Data.email"
                  maxlength="100"
                  placeholder="单位邮箱"
                  auto-complete="off"
                  tabindex="7"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="statess" label="启用状态">
          <el-switch
                  v-model="Data.statess"
                  active-value="1"
                  inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


    <!--新建用户-->
    <el-dialog
            :visible.sync="addDialogVisible"
            title="新建用户"
            width="40%">
      <el-form ref="addForm" :model="formData" size="small" label-width="80px">
        <el-form-item prop="ms_login_name" label="用户名">
          <el-input
                  v-model="formData.ms_login_name"
                  maxlength="100"
                  placeholder="用户名"
                  auto-complete="off"
                  tabindex="2"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_real_name" label="姓名">
          <el-input
                  v-model="formData.ms_real_name"
                  maxlength="20"
                  placeholder="姓名"
                  auto-complete="off"
                  tabindex="3"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_login_password" label="登录密码">
          <el-input
                  v-model="formData.ms_login_password"
                  maxlength="20"
                  clearable
                  placeholder="登录密码"
                  auto-complete="off"
                  tabindex="4"
                  type="password"/>
        </el-form-item>
        <el-form-item prop="passwordAgain" label="确认密码">
          <el-input maxlength="20" placeholder="再输一次密码"
                    v-model="formData.passwordAgain"
                    auto-complete="off" tabindex="5" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="ms_phone" label="手机号码">
          <el-input
                  v-model="formData.ms_phone"
                  maxlength="20"
                  placeholder="手机号码"
                  auto-complete="off"
                  tabindex="6"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_role_id" label="角色">
          <el-select v-model="formData.ms_role_id" clearable placeholder="请选择">
            <el-option
                    v-for="item in rolesOptions"
                    :key="item.id"
                    :label="item.role_zh_name"
                    :value="item.id"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item v-if="showRoleSelect" prop="addstore_name" label="商户平台">-->
          <!--<el-select v-model="formData.ms_merchant_id" clearable placeholder="选择商户平台">-->
            <!--<el-option v-for="item in merchantList" :key="item.balance_id" :label="item.balance_merchant"-->
                       <!--:value="item.balance_id"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item prop="ms_email" label="单位邮箱">
          <el-input
                  v-model="formData.ms_email"
                  maxlength="100"
                  placeholder="单位邮箱"
                  auto-complete="off"
                  tabindex="7"
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_status" label="启用状态">
          <el-switch
                  v-model="formData.ms_status"
                  active-value="1"
                  inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

    export default {
        data() {
            return {
                listLoading:true,
                tableKey: 0,
                tableData:[
                    {id:1,name:'阿波',statess:1,phone:'13881387003',email:'478650289@qq.com',role:'商户',names:'胡松波'},
                ],
                Data:{id:1,name:'阿波',statess:1,phone:'13881387003',email:'478650289@qq.com',role:'商户',names:'胡松波'},
                rolesOptions:[
                    {id:1,text:'管理员'},{id:2,text:'用户'}
                ],
                showRoleSelect:false,
                // 分页查询参数
                pageForm: {
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:1,
                },
                UserpageForm:{
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:1,
                },
                formData: {
                    ms_id: '',
                    ms_status: '',
                    ms_login_password: '',
                    passwordAgain:'',
                    ms_login_name: '',
                    ms_real_name: '',
                    ms_phone: '',
                    ms_email: '',
                    ms_role_id: '',
                    ms_merchant_id: ''
                },
                editRules: {
                    ms_real_name: [
                        { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
                    ],
                    ms_email: [
                        { required: false, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    ms_phone: [
                        { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
                        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
                    ]
                },
                dialogVisible:false,
                editDialogVisible:false,
                addDialogVisible:false,
                data2: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }

            }
        },
        created(){
            var _this=this
            setTimeout(()=>{
                _this.listLoading=false
            },1000)
        }  ,
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            dropdownCommand(command){
                console.log(command)
                if(command.type=='menu'){
                    this.dialogVisible=true
                    return
                }
                if(command.type=='edituser'){
                    this.editDialogVisible=true
                    return
                }
            },
            openAdd(){
                this.addDialogVisible=true
            },
            handleCheckChange(val){
                console.log(val)
            },
            pageNumberChange(){

            },
            pageSizeChange(){

            },
            changeRole(){

            }


        },
        components: {

        },
        mounted: function () {

        }
    }
</script>
<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
