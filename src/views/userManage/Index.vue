<template>
  <div class="user-list" v-loading="listLoadings">
    <div style="width: 100%;margin:20px 0;display: flex;justify-content: space-between">
      <div class="filter-container">
      <el-date-picker
              v-model="modifyDate"
              :picker-options="pickerOptions2"
              type="daterange"
              align="right"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator=""
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleFilterDate"/>
      <el-select v-if="roleId==1" v-model="zttype" clearable placeholder="选择公司"
                 style="width: 150px;margin-left: 20px;"
                 @change="ChangeCompany">
        <el-option v-for="item in companylist" :key="item.key" :label="item.company_name"
                   :value="item.company_id"/>
      </el-select>
        <el-select  v-model="zttypesss"  clearable placeholder="选择状态"
                   style="width: 150px;margin-left: 20px;"
                   @change="ChangeState">
          <el-option v-for="item in StateList" :key="item.key" :label="item.name"
                     :value="item.state"/>
        </el-select>
      <!--<el-button type="primary" icon="el-icon-plus" size="small" @click="addDialogVisible=true">添加</el-button>-->
    </div>
      <div class="coopon-right">
        <el-button icon="el-icon-circle-plus" type="primary"
                   @click="addDialogVisible=true">添加用户</el-button>
        <el-button icon="el-icon-download" v-waves :loading="downloadLoading" type="primary"
                   @click="handleDownload">导出</el-button>
        <el-select v-if="roleId!=6" v-model="ascdesctxt" clearable placeholder="默认升序"
                   style="width: 160px;margin-left: 20px;"
                   @change="clickdescType">
          <el-option v-for="items in ascdesc" :key="items.id" :label="items.names"
                     :value="items.names"/>
        </el-select>
      </div>
    </div>
    <el-table
            v-loading="listLoadings"
            :data="UserList"
            :key="tableKey"
            fit
            highlight-current-row
        border
        ref="table"
        style="width: 100%">
      <el-table-column
          prop="loginname"
          width="250px" align="center"
          label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="nickname"
          width="150px" align="center"
          label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="cellphone"
          width="200px" align="center"
          label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
              prop="cellphone"
              width="200px" align="center"
              label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="active"
          width="150px" align="center"

          label="状态">
        <template slot-scope="scope" style="text-align: center;">
          <!--<span>{{ scope.row.gw_data_state}}</span>-->
          <i v-if="scope.row.state!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          :render-header="tableAction"
          width="80">
        <template slot-scope="scope" style="display: flex;justify-content: center;">
            <!--<el-button @click="resetting(scope.row.id)" type="warning" style="transition: .4s;"  :ref="scope.row.id"  icon="el-icon-refresh" size="small" circle></el-button>-->
            <el-button @click="editUser(scope.row)" type="primary" icon="el-icon-edit" size="small" circle></el-button>
            <!--<el-button @click="deleteUser(scope.row.id)" v-if="scope.row.active != '0'" type="danger" icon="el-icon-delete" circle size="small"></el-button>-->
            <!--<el-button @click="deleteUser(scope.row.id)" v-else icon="el-icon-check" circle size="small"></el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination style=" margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.page_num"
                :limit.sync="listQuery.page_size"
                @pagination="getList"/>

    <!--新建用户-->
    <el-dialog
            :visible.sync="addDialogVisible"
            title="新建用户"
            width="40%">
      <el-form ref="addForm" :model="formData" size="small" label-width="80px">
        <el-form-item prop="ms_login_name" label="登录账号">
          <el-input
                  v-model="formData.user_name"
                  maxlength="100"
                  placeholder="用户名"
                  auto-complete="off"
                  tabindex="2"
                  @blur="BlurName"
                  clearable
                  type="text"/>
          <div v-if="!Verification[0].flag" style="color: red;">只能输入中文的用户名</div>
        </el-form-item>
        <el-form-item prop="ms_login_name" label="昵称">
          <el-input
                  v-model="formData.real_name"
                  maxlength="100"
                  placeholder="用户名"
                  auto-complete="off"
                  tabindex="2"
                  clearable
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_login_password" label="登录密码">
          <el-input
                  v-model="formData.auth_password"
                  maxlength="20"
                  clearable
                  placeholder="登录密码"
                  auto-complete="off"
                  @blur="BlurPsd"
                  tabindex="4"
                  type="password"/>
          <div v-if="!Verification[1].flag" style="color: red;">只能输入6-16位的字母或数字</div>
        </el-form-item>

        <el-form-item prop="passwordAgain" label="确认密码">
          <el-input maxlength="20" placeholder="再输一次密码"
                    v-model="auth_passwords"
                    @blur="BlurPsds"
                    auto-complete="off" tabindex="5" type="password"></el-input>
          <div v-if="!flagss" style="color: red;">俩次密码不一致</div>
        </el-form-item>
        <el-form-item prop="ms_phone" label="手机号码">
          <el-input
                  v-model="formData.phone"
                  maxlength="20"
                  placeholder="手机号码"
                  auto-complete="off"
                  tabindex="6"
                  @blur="BlurPhone"
                  clearable
                  type="text"/>
          <div v-if="!Verification[2].flag"  style="color: red;">请正确输入11位的手机号码</div>
        </el-form-item>
        <el-form-item label="选择权限" prop="oil_id">
          <el-select v-model="Jurisdictions" class="filter-item" placeholder="选择类型" @change="addclickJurisdictions">
            <el-option v-for="item in Jurisdictionoptions" :key="item.role_id" :label="item.role_zh_name" :value="item.role_id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="ms_status" label="启用状态">
          <el-switch
                  v-model="formData.state"
                  active-value=1
                  inactive-value=0
                  active-color="#13ce66"
                  inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog
            :visible.sync="editDialogVisible"
            title="编辑员工"
            width="40%">
      <el-form ref="addForm"  size="small" label-width="90px">
        <el-form-item prop="ms_role_id" label="登录账号">
          <el-input
                  v-model="formDataes.user_name"
                  maxlength="20"
                  clearable
                  disabled
                  auto-complete="off"
                  style="max-width: 300px;margin-right: 20px;"
                  tabindex="4"
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_login_password" label="昵称">
          <el-input
                  v-model="formDataes.real_name"
                  maxlength="20"
                  clearable
                  disabled
                  auto-complete="off"
                  style="max-width: 300px;margin-right: 20px;"
                  tabindex="4"
                  type="text"/>
        </el-form-item>
        <el-form-item prop="ms_email" label="电话号码">
          <el-input
                  v-model="formDataes.phone"
                  maxlength="100"
                  auto-complete="off"
                  tabindex="7"
                  disabled
                  style="max-width: 300px;margin-right: 20px;"
                  type="text"/>
        </el-form-item>
        <el-form-item label="选择权限" prop="oil_id">
          <el-select v-model="Jurisdiction" class="filter-item" placeholder="选择类型" @change="clickJurisdiction">
            <el-option v-for="item in Jurisdictionoptions" :key="item.role_id" :label="item.role_zh_name" :value="item.role_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="oil_change_date">
          <el-switch
                  v-model="status_addss"
                  @change="addswitchaddss"
                  active-value="close"
                  inactive-value="open"
                  active-color="#13ce66"
                  inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="EditOk">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
    import waves from '@/directive/waves'
    import Pagination from '@/components/Pagination'
  import ToolBar from '@/components/ToolBar.vue';
  import HelpHint from '@/components/HelpHint.vue';
  import {GetUserList} from '../../api/user'
  import {GetECompanyList} from '@/api/balanceManage'
    import {GetRoleList,SubMitUserInfo} from '../../api/systemManage'
  import util from "../../utils/util";
  export default {
    data() {
      return {
        params: {
          name: '',
        },
        usersData: [
          {id:1,loginname:'Admin',nickname:'管理员',email:'Admin@.admin.com',cellphone:'151178xxxx',sex:'male',active:1},
          {id:2,loginname:'SenLin',nickname:'森林',email:'SenLin@.admin.com',cellphone:'151178xxxx',sex:'unknown',active:0},
          {id:4,loginname:'Admin1',nickname:'赵晓',email:'Admin@.admin.com',cellphone:'151178xxxx',sex:'male',active:1},
          {id:5,loginname:'Wujun',nickname:'吴军',email:'Admin@.admin.com',cellphone:'151178xxxx',sex:'male',active:1},
          {id:5,loginname:'Huang',nickname:'黄家',email:'Admin@.admin.com',cellphone:'151178xxxx',sex:'male',active:1},
        ],
          ascdesctxt:'',
          Jurisdictions:2,
          ascdesc:[
              {id:1,names:'升序'},
              {id:2,names:'降序'}
          ],
          UserList:[],
          editDialogVisible:false,
          status_addss:'open',
          // 分页查询参数
          listQuery: {
              page_num: 1,
              page_size: 10,
              user_id:'',
              begin_date:'',
              end_date:'',
              company_id:'',
              state:-1,
          },
          Jurisdictionoptions:[],
          Jurisdiction:'',
          downloadLoading: false,
          totalCount:0,
          rolesOptions:[],
          addDialogVisible:false,
          formData: {
              user_name:'',
              phone:'',
              company_id:'',
              auth_password:'',
              role_id:2,
              real_name:'',
              state:0
          },
          formDataes: {
              id:'',
              phone:'',
              real_name:'',
              role_id:'',
              state:'',
              user_name:'',
              user_id:'',
              auth_password:'',
          },
          auth_passwords:'',
          Verification:[
              {
                  id:1,
                  text:/[\u4e00-\u9fa5]/g,
                  flag:true
              },
              {
                  id:2,
                  text:/^[A-Za-z0-9]{6,12}$/,
                  flag:true
              },
              {
                  id:3,
                  text:/^1[3|4|5|8][0-9]\d{4,8}$/,
                  flag:true
              }
          ],
          zttype:'',
          flagss:true,
          modifyDate:'',
          total:0,
          pickerOptions2: {
              shortcuts: [
                  {
                      text: '最近一天',
                      onClick(picker) {
                          const end = new Date()
                          const start = new Date()
                          picker.$emit('pick', [start, end])
                      }
                  },
                  {
                      text: '最近一周',
                      onClick(picker) {
                          const end = new Date()
                          const start = new Date()
                          end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
                          picker.$emit('pick', [start, end])
                      }
                  }, {
                      text: '最近一个月',
                      onClick(picker) {
                          const end = new Date()
                          const start = new Date()
                          end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
                          picker.$emit('pick', [start, end])
                      }
                  }, {
                      text: '最近三个月',
                      onClick(picker) {
                          const end = new Date()
                          const start = new Date()
                          end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
                          picker.$emit('pick', [start, end])
                      }
                  },
                  {
                      text: '全部',
                      onClick(picker) {
                          const end = ""
                          const start = ""
                          picker.$emit('pick', [start, end])
                      }
                  }]
          },
          companylist:[],
          roleId:'',
          listLoadings:true,
          tableKey:0,
          zttypesss:'',
          StateList:[
              {
                  name:'未审核',
                  state:'no'
              },
              {
                  name:'已审核',
                  state:'ok'
              }
          ],
      }
    },
      created(){
          this.roleId=localStorage.getItem('Role')
          var userinfo=JSON.parse(localStorage.getItem('UserInfo'))
          this.formData.company_id=userinfo.company_id
          if(this.roleId!=1){
              this.listQuery.company_id=userinfo.company_id
          }
          this.getJurisdiction()
        this.GetCompanylist()
        this.getList()
      },
    methods: {
        getJurisdiction(){
            var userid= sessionStorage.getItem(this.$Config.tokenKey);
            var data={
                user_id:userid.replace("\"","").replace("\"","")
            }
            GetRoleList(data).then((res)=> {
                console.log(res.data.data)
                if(res.data.data==undefined){
                    this.Jurisdictionoptions=[]
                }
                else{
                    this.Jurisdictionoptions=res.data.data
                }
            })
        },
        AddUser(){
          console.log(this.formData)
            var AesJson=util.encrypt(JSON.stringify(this.formData),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
            var data={
                method:'add',
                post_params:AesJson
            }
            console.log(data)
            SubMitUserInfo(data).then((res)=> {

                console.log(res)
                if(res.data.result==0){
                    this.$notify({
                        title: '成功',
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.addDialogVisible = false
                    this.formData.user_name='',
                    this.formData.phone='',
                    this.formData.auth_password='',
                    this.formData.role_id=2,
                    this.auth_passwords=''
                    this.formData.real_name='',
                    this.formData.state=0
                    this.getList()
                }
                else{
                    this.$notify({
                        title: '错误',
                        message: '添加失败',
                        type: 'error',
                        duration: 2000
                    })
                }

            })

        },
        ChangeState(val){
            if(val==''){
                this.listQuery.state=-1
            }
            else{
                if(val=="ok"){
                    this.listQuery.state=1
                }
                else{
                    this.listQuery.state=0
                }

            }
            this.getList()
        },
        EditOk(){
          console.log(this.formDataes)
            var AesJson=util.encrypt(JSON.stringify(this.formDataes),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
            var data={
                method:'edit',
                post_params:AesJson
            }
            console.log(data)
            SubMitUserInfo(data).then((res)=> {
                console.log(res)
                if(res.data.result==0){
                    this.$notify({
                        title: '成功',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                      this.editDialogVisible=false
                    this.getList()
                }
                else{
                    this.$notify({
                        title: '错误',
                        message: '修改失败',
                        type: 'error',
                        duration: 2000
                    })
                }
            })
        },
        clickJurisdiction(val){
          this.formDataes.role_id=val
        },
        addclickJurisdictions(val){
          console.log(val)
            this.formData.role_id=val
        },
        addswitchaddss(val){
            if(val=="open"){
                this.formDataes.state=0
            }
            else{
                this.formDataes.state=1
            }
        },
        GetCompanylist(){
            var datas={
                company_id:''
            }
            GetECompanyList(datas).then(response => {
                this.companylist=response.data.data
                // console.log(this.companylists)
            })
        },
        clickdescType(val){

        },
        ChangeCompany(val){
            this.listQuery.company_id=val
            if(val==''){
                this.zttype=''
            }
            this.getList()
        },
        handleFilterDate(item) {
            // this.listQuery.pageNum = 1
            if(item==null){
                this.listQuery.begin_date = ''
                this.listQuery.end_date = ''
            }
            else{
                this.listQuery.begin_date = item[0]
                this.listQuery.end_date = item[1]
            }
            this.getList()
        },
      searchUser(){
        let tableRow = this.$refs.table.$el.querySelectorAll('tbody tr');
        let tableRowHeight = tableRow[1].offsetHeight;
        let isjump = false;
        for (let i = 0;i < this.usersData.length; i ++){
          if(this.params.name && this.usersData[i].nickname.indexOf(this.params.name) != -1){
            tableRow[i].style.backgroundColor = '#85ce61';
            if(! isjump){
              scrollTo(0,i*tableRowHeight + 66 );isjump = true;
            }
          }else {
            tableRow[i].style.backgroundColor = '#fff';
          }
        }
      },
        BlurName(){
          if(!this.Verification[0].text.test(this.formData.user_name)){
              this.Verification[0].flag=false
          }
          else{
              this.Verification[0].flag=true
          }
        },
        BlurPsd(){
            if(!this.Verification[1].text.test(this.formData.auth_password)){
                this.Verification[1].flag=false
            }
            else{
                this.Verification[1].flag=true
            }
        },
        BlurPsds(){
          if(this.formData.auth_password!=this.auth_passwords){
              this.flagss=false
          }
          else{
              this.flagss=true
          }
        },
        BlurPhone(){
            if(!this.Verification[2].text.test(this.formData.phone)){
                this.Verification[2].flag=false
            }
            else{
                this.Verification[2].flag=true
            }
        },
        ChangeDateFormat(val) {
            if (val != null) {
                var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
                //月份为0-11，所以+1，月份小于10时补个0
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                var hours = date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours();
                var minutes = date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes();
                var secounds = date.getSeconds() < 10 ? "0" + (date.getSeconds()) : date.getSeconds();
                return date.getFullYear() + "-" + month + "-" + currentDate+" "+hours+":"+minutes+":"+secounds;
            }
            return "";
        },
        getList(){
            // this.total=0
            this.listLoadings=true
            setTimeout(()=>{
                this.listLoadings=false
            },1000)
          var _this=this
          // this.UserList=[]
            var userid= sessionStorage.getItem(this.$Config.tokenKey).replace("\"","").replace("\"","");
            this.listQuery.user_id=userid
            console.log(this.listQuery)
            var AesJson=util.encrypt(JSON.stringify(this.listQuery),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
            var data={
                post_params:AesJson
            }
            GetUserList(data).then((res)=>{
                console.log(res)
                if(res.data.result==0){
                    _this.UserList=res.data.data
                    _this.UserList.forEach((item)=>{
                        item.create_time=this.ChangeDateFormat(item.create_time)
                    })
                    this.total=res.data.total_count
                }
                else{
                    _this.UserList=[]
                }
                console.log(_this.UserList)
            })


        },
      tableAction(){
        return this.$createElement('HelpHint',{
            props:{
              content:'重置密码为123456 / 编辑用户 / 删除或恢复用户'
            }
          },'操作');
      },
      editUser(data) {
        this.editDialogVisible=true
         this.formDataes.phone=data.phone
          this.formDataes.real_name=data.real_name
          if(data.role_id==null){
              this.formDataes.role_id=2
          }
          else{
              this.formDataes.role_id=data.role_id
          }
          this.formDataes.id=data.id
          this.formDataes.state=data.state
          if(this.formDataes.state==1){
            this.status_addss='close'
          }
          else{
              this.status_addss='open'
          }
          this.formDataes.user_name=data.user_name
          this.Jurisdiction=data.role_id
          this.formDataes.user_id=data.user_id
          // this.formDataes.auth_password=data.auth_password
      },
      UploadUser(data) {

      },
        pageSizeChange(){

        },
        pageNumberChange(){

        },
        handleDownload(){
            this.downloadLoading = true
            this.UserList.forEach((item)=>{
                if(item.state==1){
                    item.statestext='审核通过'
                }
                else{
                    item.statestext='未审核'
                }
            })
            var Lists=this.UserList
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['登陆账号', '昵称', '联系电话', '状态','创建时间']
                const filterVal = ['user_name', 'real_name', 'phone','statestext', 'create_time']
                const data = this.formatJson(filterVal,Lists)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: '用户信息'
                })
                this.downloadLoading = false
            })
            this.getList();
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                if (j === 'timestamp') {
                    return parseTime(v[j])
                } else {
                    return v[j]
                }
            }))
        },
      deleteUser(id) {

          this.$message({
            message: '这里请求api删除或者恢复用户之后刷新分页组件，列表自动更新',
            type: 'success'
          });

      },
      resetting(id) {

      let dom = this.$refs[id].$el;
      dom.style.transform = 'rotate(180deg)';
      setTimeout(()=>{dom.style.transform = 'rotate(0deg)'},600)
      this.$message({
        message: '已经成功重置密码',
        type: 'success'
      });
      this.$router.push({path:'/Recharge_System'})
      },


    },
    components: {
      ToolBar,HelpHint,Pagination
    },
      directives: {waves},
  }
</script>
<style lang="scss">

</style>
