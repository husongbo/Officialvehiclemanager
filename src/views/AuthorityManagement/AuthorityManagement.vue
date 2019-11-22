<template>
    <div class="category">
        <el-button type="primary" style="margin: 10px;" @click="addDialogVisible=true">添加权限</el-button>
        <el-table
                v-loading="listLoading"
                :data="tableData"
                size="small"
                header-align="center"
                style="width: 100%"
        >
            <el-table-column
                    sortable
                    prop="id"
                    label="角色ID"
                    header-align="center"
                    align="center"
            />
            <el-table-column
                    sortable
                    prop="role_zh_name"
                    label="角色名称"
                    header-align="center"
                    align="center"
            />
            <!--<el-table-column-->
                    <!--:show-overflow-tooltip="true"-->
                    <!--prop="role_rules"-->
                    <!--label="角色标识"-->
                    <!--align="center"-->
                    <!--header-align="center"/>-->
            <el-table-column
                    :show-overflow-tooltip="true"
                    sortable
                    prop="role_state"
                    label="启用状态"
                    header-align="center"
                    align="center"
            >
                <template slot-scope="scope">
                    <i v-if="scope.row.role_state!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                    <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
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
                            <el-dropdown-item :command="{type:'menu',text:scope.row}">
                                分配权限
                            </el-dropdown-item>
                            <el-dropdown-item :command="{type:'user'}">
                                用户列表
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
                    :data="RoleList"
                    ref="tree"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[1,2,3,4]"
                    :default-checked-keys="chechedss"
                    :props="defaultProps"
                    >
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{scope.data.rule_zh_name}}</span>
          <span>
            <span  style="font-weight: bold">菜单权限 </span>
          </span>
        </span>
            </el-tree>
            <span slot="footer"  class="dialog-footer">
      <el-button @click="Abolitionclose">取 消</el-button>
      <el-button type="primary" @click="AbolitionOk">确 定</el-button>
      </span>
        </el-dialog>


        <el-dialog
                title="分配权限"
                :visible.sync="dialogsVisible"
                width="70%"
                :before-close="handleClose">
            <el-tree
                    :data="RoleList"
                    show-checkbox
                    node-key="id"
                    ref="trees"
                    :default-expanded-keys="[1,2,3,4]"
                    :default-checked-keys="checheds"
                    :props="defaultProps"
                    @current-change="abo"
                    @check-change="handleCheckChanges">
        <span slot-scope="scope" class="custom-tree-node">
          <span>{{scope.data.rule_zh_name}}</span>
          <span>
            <!--<span  style="font-weight: bold">菜单权限 </span>-->
          </span>
        </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
      <el-button @click="dialogsVisible=false">取 消</el-button>
      <el-button type="primary" @click="RoleOk">确 定</el-button>
      </span>
        </el-dialog>

        <!--新建用户-->
        <el-dialog
                :visible.sync="addDialogVisible"
                title="新建权限"
                width="40%">
            <el-form ref="addForm" :model="formData" size="small" label-width="80px">
                <el-form-item prop="ms_login_name" label="用户名">
                    <el-input
                            v-model="formData.role_zh_name"
                            maxlength="100"
                            placeholder="用户名"
                            auto-complete="off"
                            @blur="BlurzhName"
                            tabindex="2"
                            clearable
                            type="text"/>
                    <div v-if="!Verification[0].flag" style="color: red;">只能输入中文的用户名</div>
                </el-form-item>
                <el-form-item prop="ms_login_name" label="英文名">
                    <el-input
                            v-model="formData.role_en_name"
                            maxlength="100"
                            placeholder="用户名"
                            auto-complete="off"
                            tabindex="2"
                            @blur="BlurENName"
                            clearable
                            type="text"/>
                    <div v-if="!Verification[1].flag" style="color: red;">只能输入英文的用户名</div>
                </el-form-item>
                <el-form-item prop="ms_login_name" label="选择权限">
                    <el-input
                            v-model="formData.role_rules"
                            maxlength="100"
                            placeholder="请选择权限"
                            auto-complete="off"
                            style="width: 200px;"
                            disabled="disabled"
                            tabindex="2"
                            clearable
                            type="text"/>
                    <el-button style="margin-left: 20px;" @click="dialogsVisible=true">选择</el-button>
                </el-form-item>
                <el-form-item prop="ms_status" label="启用状态">
                    <el-switch
                            v-model="status_adds"
                            @change="addswitchadds"
                            active-value="close"
                            inactive-value="open"
                            active-color="#13ce66"
                            inactive-color="#ccc"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CreateRole">确 定</el-button>
      </span>
        </el-dialog>



        <!--分配用户到角色-->
        <el-dialog
                title="角色的用户列表"
                :visible.sync="userDialogVisible"
                append-to-body
                width="70%">
            <div class="block">
            </div>
            <el-table
                    :data="tableDatas"
                    size="small"
                    header-align="center"
                    style="width: 100%"
            >

                <el-table-column
                        sortable
                        prop="name"
                        label="用户名"
                        center
                        align="center"
                        header-align="center"/>
                <el-table-column
                        :show-overflow-tooltip="true"
                        sortable
                        prop="statess"
                        label="帐号状态"
                        header-align="center"
                        align="center"
                >
                    <template slot-scope="scope">
                        <i v-if="scope.row.statess!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                        <i v-if="scope.row.statess==1" class="fa fa-circle text-success ml5" style="color: #15db81"/>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :total="UserpageForm.totalCount"
                    :current-page="UserpageForm.pageNumber"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="UserpageForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="userPageSizeChange"
                    @current-change="userPageNumberChange"/>
            <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">关 闭</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import {GetRoleList,GetMeunList,SubMiRoleInfo} from '../../api/systemManage'
    import md5 from 'md5'
    import util from "../../utils/util";
    export default {
        data() {
            return {
                listLoading:true,
                tableKey: 0,
                checheds:[],
                chechedss:[],
                tableDatas:[],
                tableData:[
                    // {id:1,name:'阿波',statess:1},
                    // {id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},
                ],
                // 分页查询参数
                pageForm: {
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:0,
                },
                rolesOptions:[],
                UserpageForm:{
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:0,
                },
                Verification:[
                    {
                        id:1,
                        text:/[\u4e00-\u9fa5]/g,
                        flag:true
                    },
                    {
                        id:2,
                        text:/[A-Za-z]/g,
                        flag:true
                    }
                ],
                dialogVisible:false,
                userDialogVisible:false,
                addDialogVisible:false,
                dialogsVisible:false,
                formData: {
                    role_en_name:'',
                    role_rules:'',
                    role_state:0,
                    role_zh_name:'',
                },
                formDatas: {
                    role_en_name:'',
                    role_rules:'',
                    role_state:0,
                    role_zh_name:'',
                    role_id:'',
                },
                status_adds:'open',
                defaultProps: {
                    children: 'children',
                    label: 'rule_zh_name'
                },
                RoleList:[],
                RoleTextList:[],
                CheckText:'',
                CheckTexts:'',
                newchecklist:[],
            }
        },
        created(){

            this.getlist()

        }  ,
        methods: {
            addswitchadds(val){
                if(val=="open"){
                    this.formData.role_state=0
                    this.formData.company_balance_status=0
                }
                else{
                    this.formData.role_state=1
                }
                console.log(this.formData.role_state)
            },
            getlist(){

                var _this=this
                this.RoleList=[]
                _this.pageForm.totalCount=0
                var userid= sessionStorage.getItem(this.$Config.tokenKey);
                var data={
                    user_id:userid.replace("\"","").replace("\"","")
                }
                GetRoleList(data).then((res)=>{
                    console.log(res)
                    this.tableData=res.data.data
                    this.tableData.forEach(()=>{
                        _this.pageForm.totalCount++

                    })
                    console.log(this.tableData)
                })
                GetMeunList().then((ress)=>{
                    var _this=this
                    var list=ress.data.data
                    this.RoleTextList=list
                    list.forEach((item)=>{
                        if(item.pid==0){
                            _this.RoleList.push(item)
                        }
                        _this.RoleList.forEach((items)=>{
                            if(items.id==item.pid){
                                if(items.children==undefined){
                                    items.children=[]
                                }
                                items.children.push(item)
                            }
                            else{
                                if(items.children!=undefined) {
                                    items.children.forEach((its) => {
                                        if (its.id == item.pid) {
                                            console.log("aaa")
                                            if (its.children == undefined) {
                                                its.children = []
                                            }
                                            its.children.push(item)

                                        }
                                    })
                                }
                            }
                        })
                    })
                    console.log(list)
                    console.log(_this.RoleList)
                })
                setTimeout(()=>{
                    _this.listLoading=false
                },1000)
            },
            CreateRole(){
                var AesJson=util.encrypt(JSON.stringify(this.formData),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    method:'add',
                    post_params:AesJson
                }
                SubMiRoleInfo(datas).then((res)=>{
                    console.log(res)
                    if(res.data.result==0){
                        this.addDialogVisible=false
                        this.getlist()
                        this.$notify({
                            title: '成功',
                            message: '权限新增成功',
                            type: 'success'
                        });
                    }
                })

            },
            BlurzhName(){
                if(!this.Verification[0].text.test(this.formData.role_zh_name)){
                    this.Verification[0].flag=false
                }
                else{
                    this.Verification[0].flag=true
                }
            },
            BlurENName(){
                if(!this.Verification[1].text.test(this.formData.role_en_name)){
                    this.Verification[1].flag=false
                }
                else{
                    this.Verification[1].flag=true
                }
            },
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
                    this.CheckText=command.text
                    this.CheckTexts=command.text.role_rules.split(',')
                    // this.getlist()
                    // setTimeout(()=>{
                        this.chechedss=[]
                        this.dialogVisible=true
                        var rules=command.text.role_rules
                        console.log(this.chechedss)
                        // alert(rules)
                        if(rules=="*"){
                            this.getRules()
                        }
                        else{
                            console.log(command.text.role_rules)
                            if(command.text.role_rules==null){
                                this.chechedss=[]
                            }
                            else{
                                this.CheckTexts.forEach((item)=>{
                                    console.log(parseInt(item))
                                    if(parseInt(item)==1||parseInt(item)==2||parseInt(item)==3||parseInt(item)==4){

                                    }
                                    else{
                                        this.chechedss.push(parseInt(item))
                                    }
                                })
                                // this.chechedss=command.text.role_rules.split(',')
                                // this.chechedss.forEach((item,inx)=>{
                                //
                                //         this.chechedss[inx]=parseInt(item)
                                //     // }
                                //
                                // })
                            }

                        }
                        console.log(this.chechedss)
                        return
                    // },500)

                }
                if(command.type=='user'){
                    this.userDialogVisible=true
                    return
                }
            },
            getRules(){
                var _this=this
                console.log(this.RoleTextList)
              this.RoleTextList.forEach((item)=>{
                  if(item.children==undefined){

                      _this.chechedss.push(item.id)
                  }

              })
            },
            getCheckedKeys(val){
                console.log(val)
            },
            handleCheckChange(val){
                console.log(val)
                if(val.children==undefined){
                    var flag=false
                    this.chechedss.forEach((item,index)=>{
                        if(val.id==item) {
                            this.chechedss.splice(index, 1)
                            flag = true
                            return
                        }
                    })
                    if(!flag){
                        this.chechedss.push(val.id)
                    }

                }
                console.log(this.chechedss)
            },
            handleCheckChanges(val){
                if(!val.flag&&val.children==undefined){
                    val.flag=true
                    this.checheds.push(val.id)
                    console.log(this.checheds)
                    return
                }
                if(val.flag&&val.children==undefined){
                    val.flag=false
                    this.checheds.forEach((item,index)=>{
                        if(val.id==item){
                            console.log("haha")
                            this.checheds.splice(index,1)
                            return
                        }
                    })
                    console.log(this.checheds)
                }
            },
            RoleOk(){
                var _this=this
                var arr=''
                var checks=[]
                var flags=true
                var checknode=this.$refs.trees.getCheckedNodes()
                console.log(checknode)
                checknode.forEach((item)=>{
                    checks.push(item.id)
                    if(item.id==6||item.id==7||item.id==8){
                        checknode.forEach((items)=>{
                            if(items.id==5){
                                flags=false
                            }
                        })
                    }
                    if(arr==''){
                        arr=item.id
                    }
                    else{
                        arr+=","+item.id
                    }
                })
                if(flags){
                    this.$message.error("当你选择了增加，删除，修改菜单时，请务必选择查看")
                    return
                }
                if(flags){
                    this.$message.error("当你选择了增加，删除，修改菜单时，请务必选择查看")
                    return
                }
                _this.formData.role_rules=arr
                _this.dialogsVisible=false
            },
            //权限取消
            Abolitionclose(){
                // this.$router.go(0)
                this.$refs.tree.setCheckedKeys([]);
                this.chechedss=[]

                this.dialogVisible=false
            },
            //权限确定
            AbolitionOk(row){
                var checks=[]
                var flags=false
                let lens=0
                var checknode=this.$refs.tree.getCheckedNodes()
                console.log(checknode)
                checknode.forEach((item)=>{
                    checks.push(item.id)
                    if(item.pid!=0){
                        var flag=false
                        checks.forEach((items)=>{
                            if(items==item.pid){
                                flag=true
                            }
                        })
                        if(!flag){
                            checks.push(item.pid)
                        }

                    }
                    if(item.id==6||item.id==7||item.id==8){
                       flags=true
                    }
                    if(item.id==5){
                        lens++
                    }
                })
                if(flags&&lens==0){
                    this.$message.error("当你选择了增加，删除，修改菜单时，请务必选择查看")
                    return
                }
                console.log(checks)
                var len=checks.length
                var arr=''
                if(len==0){
                    this.$message.error("请至少选择一个菜单属性")
                    return
                }
                // if()
                checks.forEach((item)=>{
                    if(arr==''){
                        arr=item
                    }
                    else{
                        arr+=","+item
                    }
                })
                this.formDatas.role_en_name=this.CheckText.role_en_name
                this.formDatas.role_rules=arr
                this.formDatas.role_state=this.CheckText.role_state
                this.formDatas.role_zh_name=this.CheckText.role_zh_name
                this.formDatas.role_id=this.CheckText.role_id
                console.log(this.formDatas)

                var AesJson=util.encrypt(JSON.stringify(this.formDatas),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    method:'edit',
                    post_params:AesJson
                }
                SubMiRoleInfo(datas).then((res)=>{
                    console.log(res)
                    if(res.data.result==0){
                        this.dialogVisible=false
                        this.getlist()
                        this.$notify({
                            title: '修改',
                            message: '权限修改成功',
                            type: 'success'
                        });
                    }
                })



            },
            pageSizeChange(){

            },
            abo(){
                console.log("eeee")
            },
            userPageSizeChange(){

            },
            pageNumberChange(){

            },
            userPageNumberChange(){

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
