<template>
    <div class="category">
        <el-button type="primary" @click="addsDialogVisible=true" style="margin: 20px 0;">添加菜单</el-button>
        <el-table
                v-loading="listLoading"
                :data="rolesOptions"
                size="small"
                header-align="center"
                style="width: 100%"
        >
            <el-table-column label="ID"  align="center" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="标题"  align="center" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.rule_zh_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="规则"  align="center" width="200">
                <template slot-scope="scope">
                    <span>/{{ scope.row.rule_en_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="英文名"  align="center" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.rule_en_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否激活"  align="center" width="200">
                <div slot-scope="scope" style="width: 100%;text-align: center">
                    <el-tag v-if="scope.row.state==1">正常</el-tag>
                    <el-tag v-else type="danger">被删除</el-tag>
                </div>
            </el-table-column>
            <el-table-column
                    :show-overflow-tooltip="true"
                    label="操作"
                    header-align="center"
                    align="center"
            >
                <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle @click="MenuEdit(scope.row)" size="small"></el-button>
                <!--<el-button type="info" icon="el-icon-circle-plus-outline" circle @click="addsDialogVisible=true" size="small"></el-button>-->
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
        <!--修改菜单-->
        <!--新建用户-->
        <el-dialog
                :visible.sync="addDialogVisible"
                title="编辑菜单"
                width="40%">
            <el-form ref="addForm" :model="formData" size="small" label-width="80px">
                <el-form-item prop="ms_login_name" label="父级菜单">
                    <el-select v-model="formData.ms_role_id" :disabled="ParentMenu" clearable placeholder="请选择">
                        <el-option
                                v-for="item in rolesOptions"
                                :key="item.id"
                                :label="item.rule_zh_name"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ms_real_name" label="标题">
                    <el-input
                            v-model="formData.ms_real_name"
                            maxlength="20"
                            auto-complete="off"
                            tabindex="3"
                            clearable
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="规则">
                    <el-input
                            v-model="formData.ms_router"
                            maxlength="20"
                            clearable
                            :disabled="ChildFlag"
                            auto-complete="off"
                            tabindex="4"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_phone" label="英文名">
                    <el-input
                            v-model="formData.ms_ywname"
                            maxlength="20"
                            :disabled="ChildFlag"
                            auto-complete="off"
                            tabindex="6"
                            clearable
                            type="text"/>
                </el-form-item>
                <el-form-item label="状态" prop="oil_change_date">
                    <el-switch
                            v-model="status_add"
                            @change="switchadds"
                            active-value="close"
                            inactive-value="open"
                            active-color="#13ce66"
                            inactive-color="#ccc"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="MenuEdits">确 定</el-button>
            </span>
        </el-dialog>

        <!--新建用户-->
        <el-dialog
                :visible.sync="addsDialogVisible"
                title="增加菜单"
                width="40%">
            <el-form ref="addForm" :model="formData" size="small" label-width="80px">
                <el-form-item prop="ms_login_name" label="父级菜单">
                    <el-select v-model="formData.ms_role_id" clearable placeholder="请选择" @change="ChangeMenu">
                        <el-option
                                v-for="item in roles"
                                :key="item.id"
                                :label="item.rule_zh_name"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ms_real_name" label="标题">
                    <el-input
                            v-model="AddMenu.model_info.rule_zh_name"
                            maxlength="20"
                            auto-complete="off"
                            tabindex="3"
                            clearable
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_phone" label="英文名">
                    <el-input
                            v-model="AddMenu.model_info.rule_en_name"
                            maxlength="20"
                            auto-complete="off"
                            tabindex="6"
                            clearable
                            type="text"/>
                </el-form-item>
                <el-form-item label="状态" prop="oil_change_date">
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
            <el-button @click="addsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="MenuAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {GetRuleList} from '../../api/user'
    import {SubMitAuthInfo} from '../../api/systemManage'
    export default {
        data() {
            return {
                listLoading:true,
                tableKey: 0,
                checheds:[],
                status_add:"open",
                status_adds:'open',
                tableData:[
                    {id:1,name:'阿波',statess:1},
                    {id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},
                ],
                // 分页查询参数
                pageForm: {
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:0,
                },
                UserpageForm:{
                    pageNum: 1,
                    pageSize: 10,
                    dataType: 1,
                    totalCount:4,
                },
                dialogVisible:false,
                userDialogVisible:false,
                addDialogVisible:false,
                addsDialogVisible:false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                menarr:[],
                formData: {
                    ms_real_name: '',
                    ms_router:'',
                    ms_ywname:'',
                    ms_role_id:'',
                    pid:'',
                    id:'',

                },
                rolesOptions:[],
                ParentMenu:true,
                ChildFlag:false,
                AddMenu:{
                    method:'add',
                    model_info:{
                        pid:'',
                        rule_zh_name:'',
                        rule_en_name:'',
                        is_meun:1,
                        state:1
                    }
                },
                AddMenus:{
                    method:'edit',
                    model_info:{
                        pid:'',
                        rule_zh_name:'',
                        rule_en_name:'',
                        is_meun:1,
                        state:1,
                        id:'',
                    }
                },
                roles:[],

            }
        },
        created(){

            var _this=this
            this.Getlist()
            setTimeout(()=>{
                _this.listLoading=false
            },1000)
        } ,
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            //增加菜单确定
            MenuAdd(){
                var _this=this
                this.AddMenu.method='add'
                alert(this.AddMenu.model_info.pid)
                if(this.AddMenu.model_info.rule_zh_name==''||this.AddMenu.model_info.rule_en_name==''){
                    this.$message.error('请正确填写菜单信息');
                    return
                }
                this.addsDialogVisible=false
                this.AddMenu.pid=''
                this.AddMenu.rule_zh_name=''
                this.AddMenu.rule_en_name=''
                console.log(this.AddMenu)
                SubMitAuthInfo(this.AddMenu).then((res)=>{
                    console.log(res)
                    if(res.data.result==0){
                        _this.Getlist()
                        _this.$emit("changemenulist")
                        this.$notify({
                            title: '成功',
                            message: '添加菜单完成',
                            type: 'success'
                        });
                    }
                })
            },
            //编辑下的确定
            MenuEdits(){
                var _this=this
                this.AddMenus.model_info.rule_zh_name=this.formData.ms_real_name
                this.AddMenus.model_info.rule_en_name=this.formData.ms_ywname
                this.AddMenus.model_info.pid=this.formData.pid
                this.AddMenus.model_info.id=this.formData.id
                this.listLoading=true
                console.log(this.AddMenus)
                SubMitAuthInfo(this.AddMenus).then((res)=>{
                    this.addDialogVisible=false
                    console.log(res)
                    if(res.data.result==0){
                        _this.$emit("changemenulist")
                        _this.Getlist()
                        setTimeout(()=>{
                            _this.listLoading=false
                        },1500)
                        this.$notify({
                            title: '成功',
                            message: '修改菜单完成',
                            type: 'success'
                        });
                    }
                })
              console.log(this.AddMenu)
            },
            switchadds(val){
                if(val=="open"){
                    this.AddMenus.model_info.state=0
                }
                else{
                    this.AddMenus.model_info.state=1
                }
                console.log(this.AddMenus.model_info.state)
            },
            addswitchadds(val){
                if(val=="open"){
                    this.AddMenu.model_info.state=0
                }
                else{
                    this.AddMenu.model_info.state=1
                }
                console.log(this.AddMenu.model_info.state)
            },
            //编辑菜单
            MenuEdit(val){
                console.log(val)
                var _this=this
                var flag=false
                this.formData.ms_real_name=val.rule_zh_name
                this.formData.ms_ywname=val.rule_en_name
                this.formData.ms_router="/"+val.rule_en_name
                this.formData.pid=val.pid
                this.formData.id=val.id
                if(val.state==1){
                    this.status_add='close'
                }
                else{
                    this.status_add='open'
                }
                var id=val.pid
                console.log(id)
                this.menarr.forEach((item)=>{
                    if(item.id==id){
                        flag=true
                        _this.formData.ms_role_id=item.rule_zh_name
                        return
                    }
                })
                if(!flag){
                    _this.formData.ms_role_id=val.rule_zh_name
                    this.ParentMenu=true
                }
                this.ChildFlag=true
                console.log(val)
              this.addDialogVisible=true
            },
            ChangeMenu(inx){
                this.AddMenu.model_info.pid=inx
            },
            Getlist(){
                this.listLoading=true
                this.menarr=[]
                this.roles=[]
                this.rolesOptions=[]
                var _this=this
                var userid= sessionStorage.getItem(this.$Config.tokenKey);
                var data={
                    user_id:userid.replace("\"","").replace("\"","")
                }
                GetRuleList(data).then((res)=>{
                    _this.menarr=res.data.data
                    _this.menarr.forEach((item)=>{
                        if(item.is_meun==1){
                            _this.pageForm.totalCount++
                            _this.rolesOptions.push(item)
                        }
                        if(item.is_meun==1&&item.pid==0){
                            _this.roles.push(item)
                        }
                    })
                    _this.roles.push({
                        pid:0,
                        id:0,
                        rule_zh_name:'无'
                    })
                    console.log(_this.roles)

                });
                setTimeout(()=>{
                    _this.listLoading=false
                },1000)
            },
            dropdownCommand(command){
                console.log(command)
                if(command.type=='menu'){
                    this.dialogVisible=true
                    return
                }
                if(command.type=='user'){
                    this.userDialogVisible=true
                    return
                }
            },
            handleCheckChange(val){
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
            //权限取消
            Abolitionclose(){
                this.checheds=[]
                this.dialogVisible=false
            },
            //权限确定
            AbolitionOk(){
                this.dialogVisible=false
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

            },


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
