<template>
    <div class="app-container">
        <div style="margin:20px 0;display: flex;justify-content: space-between;">
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

                <el-select v-if="roleId!=6" v-model="states" clearable placeholder="状态"
                           style="width: 150px;margin-left: 20px;"
                           @change="Cahngestates">
                    <el-option v-for="item in Typezt" :key="item.key" :label="item.name"
                               :value="item.ifs"/>
                </el-select>
                <!--<el-button icon="el-icon-search" v-waves :loading="downloadLoading" type="info"-->
                           <!--@click="handleDownload" style="margin-left: 20px">搜索</el-button>-->
            </div>
            <div class="coopon-right">
                <el-button icon="el-icon-circle-plus" v-if="Role==1"  type="primary"
                           @click="addDialogVisible = true">新增</el-button>
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
        <!---->
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="CompanyList"
                border
                fit
                highlight-current-row
                style="width: 100%;position: relative;margin-top: 20px;"
                @sort-change="sortChange"
                @selection-change="SelectionChange">
            <el-table-column label="ID"  align="center" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司名称"  align="center" width="250">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司联络人" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_contacts }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司电话" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司地址" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司余额" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_balance }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="200px" align="center">
                <template slot-scope="scope">
                    <!--<span>{{ scope.row.gw_data_state}}</span>-->
                    <i v-if="scope.row.company_balance_status!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                    <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_balance_create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="dialogedits(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination style=" margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.page_num"
                    :limit.sync="listQuery.page_size"
                    @pagination="getList"/>

        <!--<el-card class="box-card" style="margin-top: 40px;float: left;clear: both;">-->
        <!--<div class="text item">-->
        <!--总记录数: {{total}}-->
        <!--</div>-->
        <!--<div class="text item">-->
        <!--总交易金额: {{bussinessTotalMoney}}-->
        <!--</div>-->
        <!--</el-card>-->

        <!--增加-->
        <el-dialog title="新增企业车辆"  :visible.sync="dialogaddVisible">
            <el-form ref="dataForm" :rules="rules" :model="model_infos" label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
                <el-form-item label="车牌号码" prop="oil_id">
                    <el-select v-model="list_query.types" class="filter-item" placeholder="选择类型" @change="DateTypeitem">
                        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name" :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="行驶证号码" prop="oil_coupon_price">
                    <el-input style="width:200px;height: 36px;" size="small"  placeholder="" v-model="model_infos.model_info.coupon_amount"></el-input>
                </el-form-item>
                <el-form-item label="选择文件" prop="oil_coupon_price">
                    <el-input style="width:200px;height: 36px;" size="small"  placeholder="" v-model="model_infos.model_info.coupon_requestCode" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogaddVisible = false">取消</el-button>
                <el-button type="primary" @click="createAdd">确定</el-button>
            </div>
        </el-dialog>

        <!--编辑-->
        <el-dialog
                :visible.sync="editDialogVisible"
                title="企业注册审核"
                width="40%">
            <el-form ref="addForm"  size="small" label-width="90px">
                <el-form-item prop="ms_role_id" label="公司名称">
                    <el-input
                            v-model="formDataes.company_name"
                            maxlength="20"
                            clearable
                            disabled
                            auto-complete="off"
                            style="max-width: 300px;margin-right: 20px;"
                            tabindex="4"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="公司地址">
                    <el-input
                            v-model="formDataes.company_address"
                            maxlength="20"
                            clearable
                            auto-complete="off"
                            style="max-width: 300px;margin-right: 20px;"
                            tabindex="4"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="公司联络人">
                    <el-input
                            v-model="formDataes.company_contacts"
                            maxlength="100"
                            auto-complete="off"
                            tabindex="7"
                            style="max-width: 300px;margin-right: 20px;"
                            type="text"/>
                </el-form-item>
                <el-form-item label="公司状态" prop="oil_change_date">
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

        <!--新建用户-->
        <el-dialog
                :visible.sync="addDialogVisible"
                title="新建用户"
                width="40%">
            <el-form ref="addForm" :model="formData" size="small" label-width="90px">
                <el-form-item prop="ms_login_name" label="公司名称">
                    <el-input
                            v-model="formData.company_name"
                            maxlength="100"
                            placeholder="请输入公司名称"
                            auto-complete="off"
                            tabindex="2"
                            clearable
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_real_name" label="公司负责人">
                    <el-input
                            v-model="formData.company_contacts"
                            maxlength="20"
                            placeholder="请输入公司负责人"
                            auto-complete="off"
                            tabindex="3"
                            clearable
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="公司电话">
                    <el-input
                            v-model="formData.company_phone"
                            maxlength="20"
                            clearable
                            placeholder="请输入公司电话"
                            auto-complete="off"
                            tabindex="4"
                            @blur="blurCompanyPhone"
                            type="text"/>
                    <div v-if="!Verification[0].flag" style="color:red;">请输入正确的电话号码</div>
                </el-form-item>
                <el-form-item prop="ms_phone" label="公司地址">
                    <el-input
                            v-model="formData.company_address"
                            maxlength="20"
                            placeholder="请输入公司地址"
                            auto-complete="off"
                            tabindex="6"
                            @blur="blurCompanyAddress"
                            clearable
                            type="text"/>
                    <div v-if="!Verification[1].flag" style="color:red;">公司地址只包含中文</div>
                </el-form-item>
                <el-form-item prop="ms_email" label="公司余额">
                    <el-input
                            v-model="formData.company_balance"
                            maxlength="100"
                            placeholder="请输入公司余额"
                            auto-complete="off"
                            tabindex="7"
                            type="number"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="预警值">
                    <el-input
                            v-model="formData.company_early_warning_line"
                            maxlength="100"
                            placeholder="请输入预警值"
                            auto-complete="off"
                            tabindex="7"
                            type="number"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="警线值">
                    <el-input
                            v-model="formData.company_stop_line"
                            maxlength="100"
                            placeholder="请输入警线值"
                            auto-complete="off"
                            tabindex="7"
                            type="number"/>
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCompany">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import waves from '@/directive/waves' // Waves directive
    import {GetCompanyList,SubMitCompanyInfo} from '../../api/user'
    import util from "../../utils/util";
    const calendarTypeOptions = [
        {key: '1', name: '实时不定额'},
        {key: '2', name: '实时定额'}
    ]

    const invoiceTypeOptions=[
        {key:'1',name:'预警'},
        {key:'0',name:'未预警'}
    ]

    // arr to obj ,such as { CN : "China", US : "USA" }
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'ComplexTable',
        components: {Pagination},
        directives: {waves},

        filters: {
            parseDateTime(str) {
                return parseDateTime(str)
            },
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'info',
                    deleted: 'danger'
                }
                return statusMap[status]
            },
            // parseDateTime(str) {
            //   return parseDateTime(str)
            // },
            typeFilter(type) {
                return calendarTypeKeyValue[type]
            },
            parseStatus(status) {
                if (status.balance_finance_xamine_state == 0) {
                    return '未审核'
                } else if (status.balance_finance_xamine_state == 1 && status.balance_operate_xamine_state == 0) {
                    return '财务已审核'
                } else if (status.balance_finance_xamine_state == 1 && status.balance_operate_xamine_state == 1) {
                    return '审核通过'
                }
            }
        },
        data() {
            return {
                //判断是否选中
                states:'',
                checkedinvoices:[],
                list_query:{
                    coupon_list:'',//选中的id
                    types:''
                },
                editDialogVisible:false,
                addDialogVisible:false,
                checkedprice:0,//选中的价格
                model_infos:{
                    model_info:{
                        id:0,
                        coupon_type:0,//类型
                        coupon_amount:'',//总金额
                        coupon_requestCode:'',//请求码
                        coupon_effectiveTime:'',
                        coupon_expirdDate:'',
                        coupon_early_warning_line:'',//预警值
                        coupon_data_status:1,//状态
                        coupon_warning_status:0,//变更状态
                        coupon_bancle:''
                    },
                    method:''
                },
                Verification:[
                    {
                        id:1,
                        text:/^1[3|4|5|8][0-9]\d{4,8}$/,
                        flag:true
                    },
                    {
                        id:2,
                        text:/[\u4e00-\u9fa5]/g,
                        flag:true
                    },

                ],
                status_adds:'open',
                formData: {
                    company_address: '',//地址
                    company_balance: '',//公司金额
                    company_contacts: '',//负责人
                    company_early_warning_line:'',//预警值
                    company_name: '',//名称
                    company_phone: '',
                    company_stop_line: '',//警告线
                    company_balance_status:0,
                },
                formDataes: {
                    company_address: '',//地址
                    company_balance: '',//公司金额
                    company_contacts: '',//负责人
                    company_early_warning_line:'',//预警值
                    company_name: '',//名称
                    company_phone: '',
                    company_stop_line: '',//警告线
                    company_balance_status:0,
                    id:'',
                },
                rolesOptions:[],
                status_model:'bb',
                status_add:'open',
                model_infotwos:{
                    model_info:{
                        id:0,
                        coupon_early_warning_line:'',//预警值
                        coupon_data_status:0,//变更状态
                    },
                    method:''
                },
                model_edit:{
                    id:'',
                    status:''
                },
                edit_conpon:'',
                Typezt:[
                    {key:0,name:'未审核',ifs:'no'},
                    {key:1,name:'审核已通过',ifs:'ok'},
                    {key:2,name:'审核未通过',ifs:'nook'}
                ],
                closeopen:0,
                checkedlen:0,//条数
                dialogokVisible:false,
                dialogoutVisible:false,
                dialogeditVisible:false,//编辑
                dialogaddVisible:false,//增加
                switchadd:'true',
                switchedit:'true',
                exchange_type:'',
                merchant_id:0,
                status_addss:'open',
                ascdesctxt:'',
                names:'',
                oiltype:'',
                zttype:'',
                switchdis:false,
                addstoreList: [
                    {store_id: 12, store_name:92},
                    {store_id: 13, store_name: 95},
                    // {store_id: 14, store_name: '油信宝'},
                    // {store_id: 15, store_name: '翼支付'},
                    {store_id: 5, store_name: 98}
                ],
                ascdesc:[
                    {id:1,names:'升序'},
                    {id:2,names:'降序'}
                ],
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
                bussinessTotalDeal: 100,
                bussinessTotalMoney: 0,
                roleId: '',
                inputMinMas: {min: 1, max: 100},
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                disabledNow: false,
                nowBalance: 0,
                nowUsername: '',
                balance_apply: '',
                balance_merchant_id: '',
                merchantList: [],
                listQuery: {
                    begin_date: '',
                    end_date: '',
                    user_id:'',
                    page_num: 1,
                    page_size: 10,
                    company_id:'',
                    state:-1,
                },
                pagestatus:'',
                stationQuery: {
                    dataType: 1, // 1 province, 2 city, 3 station
                    province_id: '',
                    city_id: ''
                },
                provinceOptions: [
                    {key: '1', display_name: '四川'},
                    {key: '2', display_name: '广东'}
                ],
                cityOptions: [
                    {key: '1', display_name: '成都'},
                    {key: '2', display_name: '绵阳'}
                ],
                gasStationOptions: [
                    {key: '1', display_name: '高薪加油站'},
                    {key: '2', display_name: '飞云加油站'}
                ],
                importanceOptions: [1, 2, 3],
                calendarTypeOptions,
                invoiceTypeOptions,
                sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
                statusOptions: ['published', 'draft', 'deleted'],
                showReviewer: false,
                temp: { // 提交变更油价信息
                    id: '',
                    oil_id: '',
                    oil_name: '',
                    oil_base_price: '',
                    oil_change_date: '',
                    oil_change_no: ''
                },
                tempAllData: {
                    dataType: 1,
                    method: 'add'
                },
                deleteRowData: {},
                tempDate: { // 提交
                    id: '',
                    merchant: '',
                    merchant_id: '',
                    balance_apply_user: '',
                    balance_paying_bank: '',
                    balance_remittance_bank: '',
                    balance_remittance_flow: '',
                    balance_charge_money: '',
                    balance_memo: ''
                },
                dialogFormVisible: false,
                dialogDeleteVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '添加'
                },
                dialogPvVisible: false,
                pvData: [],
                rules: {
                    type: [{required: true, message: 'type is required', trigger: 'change'}],
                    timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
                    title: [{required: true, message: 'title is required', trigger: 'blur'}]
                },
                downloadLoading: false,
                CompanyList:[],
                Role:'',
                modifyDate:'',
                infos:{
                    company_id:'',
                    status:0,
                    real_name:'',
                    email:'',
                    user_id:'',
                    company_balance:0,
                    personal_balance:0,
                    phone:'',
                },
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
            }
        },
        created() {
            this.Role=localStorage.getItem('Role')
            var userinfo=JSON.parse(localStorage.getItem('UserInfo'))
            if(this.Role!=1){
                this.listQuery.company_id=userinfo.company_id
            }
            this.getList()

        },
        methods: {
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
            insertdata(item){
                this.model_infos.model_info.coupon_effectiveTime=item[0];
                this.model_infos.model_info.coupon_expirdDate=item[1];
            },
            blurCompanyPhone(){
                if(!this.Verification[0].text.test(this.formData.company_phone)){
                    this.Verification[0].flag=false
                }
                else{
                    this.Verification[0].flag=true
                }
            },
            blurCompanyAddress(){
                if(!this.Verification[1].text.test(this.formData.company_address)){
                    this.Verification[1].flag=false
                }
                else{
                    this.Verification[1].flag=true
                }
            },
            addswitchadds(val){
                if(val=="open"){
                    this.formData.company_balance_status=0
                    this.formData.company_balance_status=0
                }
                else{
                    this.formData.company_balance_status=1
                }
                console.log(this.formData.company_balance_status)
            },

            //添加公司
            AddCompany(){
                console.log(this.Verification)
                var _this=this
                //判断
                if(this.formData.company_address==''||this.formData.company_phone==''||this.formData.company_balance==''||this.formData.company_stop_line==''||this.formData.company_early_warning_line==''||this.formData.company_contacts==''||this.formData.company_name==''){
                    this.$message.error('文本框不能为空');
                    return
                }
                if(!this.Verification[0].flag||!this.Verification[1].flag){
                    this.$message.error('请正确输入所在文本框的值');
                    return
                }
                this.addDialogVisible=false
                console.log(this.formData)
                var data={
                    method:'add',
                    model_info:this.formData
                }
                SubMitCompanyInfo(data).then((res)=>{
                    console.log(res)
                    if(res.data.result==0){
                        this.getList()
                        setTimeout(()=>{
                            _this.formData.company_name=''
                            _this.formData.company_contacts=''
                            _this.formData.company_early_warning_line=''
                            _this.formData.company_stop_line=''
                            _this.formData.company_balance=''
                            _this.formData.company_phone=''
                            _this.formData.company_address=''
                            _this.formData.company_balance_status=0
                            _this.ClearFormData()
                            _this.$notify({
                                title: '成功',
                                message: '企业新增成功',
                                type: 'success'
                            });
                        },1000)
                    }
                })
            },
            Cahngestates(val){
                console.log(val)
                if(val==''){
                    this.listQuery.state=-1
                }
                else{
                    if(val=='no'){
                        this.listQuery.state=-1
                    }
                    else if(val=='ok'){
                        this.listQuery.state=1
                    }
                    else{
                        this.listQuery.state=0
                    }
                }
                this.getList()
            },
            ClearFormData(){
                this.formData.company_address=''
                this.formData.company_phone=''
                this.formData.company_balance=''
                this.formData.company_stop_line=''
                this.formData.company_balance=''
                this.formData.company_early_warning_line=''
                this.formData.company_name=''



            },
            //选择分类
            DateTypeitem(val){
                this.model_infos.model_info.coupon_type=val
                console.log(val)
            },
            //日期转换
            DateTime(date){
                var d = eval('new ' + date.substr(1, date.length - 2));

                var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
                var ar_time = [d.getHours(), d.getMinutes(), d.getSeconds()];

                for (var i = 0; i < ar_date.length; i++) ar_date[i] = this.dFormat(ar_date[i]);
                for (var i = 0; i < ar_time.length; i++) ar_time[i] = this.dFormat(ar_time[i]);

                return ar_date.join('-')+' '+ar_time.join(':');
            },
            dFormat(i){
                return i < 10 ? "0" + i.toString() : i;
            },
            //编辑
            dialogedits(row){
                // company_address: '',//地址
                //     company_balance: '',//公司金额
                //     company_contacts: '',//负责人
                //     company_early_warning_line:'',//预警值
                //     company_name: '',//名称
                //     company_phone: '',
                //     company_stop_line: '',//警告线
                //     company_balance_status:0,
                console.log(row)
                this.formDataes.company_name=row.company_name
                this.formDataes.company_id=row.company_id
                this.formDataes.company_address=row.company_address
                this.formDataes.company_contacts=row.company_contacts
                this.formDataes.company_early_warning_line=row.company_early_warning_line
                this.formDataes.company_phone=row.company_phone
                this.formDataes.company_stop_line=row.company_stop_line
                this.formDataes.company_balance_status=row.company_balance_status
                this.formDataes.id=row.id
                if(this.formDataes.company_balance_status==1){
                    this.status_addss='close'
                }
                else{
                    this.status_addss='open'
                }
                this.editDialogVisible=true
            },
            EditOk(){
                console.log(this.formDataes)
                var data={
                    method:'edit',
                    model_info:this.formDataes
                }
                SubMitCompanyInfo(data).then((res)=>{
                    console.log(res)
                    if(res.data.result==0){
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        })
                    }
                    else{
                        this.$notify({
                            title: '失败',
                            message: '修改失败',
                            type: 'error',
                            duration: 2000
                        })
                    }
                    this.getList()
                    this.editDialogVisible=false
                })
            },
            addswitchaddss(val){
                if(val=="open"){
                    this.formDataes.company_balance_status=0
                }
                else{
                    this.formDataes.company_balance_status=1
                }
            },
            //编辑下的确定
            editvisable(){
                this.listLoading = true
                this.dialogeditVisible=false;
                // if(this.model_edit.status==1){
                //   this.model_edit.status='未处理'
                // }
                // else{
                //   this.model_edit.status='已处理'
                // }
                // var id=this.model_infos.model_info.id
                // var txt=this.model_infos.model_info.coupon_early_warning_line
                // console.log("aaaaaaaaaaaaaaaaaaaaaa")
                // alert(this.model_edit.status)
                console.log(this.model_edit)
                // if(this.closeopen===1){
                //   console.log("aaa")
                SubMitCouponException(this.model_edit).then(response => {
                    console.log(response);
                    // if(response.status==200){
                    this.getList();
                    //
                    this.listLoading = true
                    this.switchedit='true'
                    // }
                })
                // }
                // console.log(id)
                // console.log(txt)
                // console.log(this.closeopen)
            },
            //增加下的确定
            createAdd(){
                this.listLoading = true
                this.model_infos.method='add'
                this.model_infos.model_info.coupon_bancle=this.model_infos.model_info.coupon_amount

                console.log(this.model_infos)
                if(this.model_infos.model_info.coupon_effectiveTime==""||this.model_infos.model_info.coupon_expirdDate==""){
                    this.$message('请选择日期');
                }
                else {
                    SubMitCouponApplyInfo(this.model_infos).then(response => {
                        console.log(response);
                        if (response.status == 200) {
                            this.getList();

                        }
                        this.dialogaddVisible=false;
                        this.listLoading = true
                    })
                }
            },
            switchadds(val){
                if(val=="open"){
                    this.model_infos.model_info.coupon_data_status=0
                    // alert(this.model_infos.model_info.coupon_data_status)
                }
                else{
                    this.model_infos.model_info.coupon_data_status=1
                    // alert(this.model_infos.model_info.coupon_data_status)
                }
            },
            switchedits(val){
                if (val == "aa") {
                    this.model_edit.status = 1
                    // this.pagestatus="未处理"
                    // alert(this.model_infotwos.model_info.coupon_data_status)
                }
                else {
                    // return;
                    this.model_edit.status = 0
                    // this.pagestatus="已处理"
                    // alert(this.model_infotwos.model_info.coupon_data_status)
                }


                // this.closeopen=val
                // console.log(val);
            },
            getDateTime(date) {
                date=new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hh = date.getHours();
                var mm = date.getMinutes();
                var ss = date.getSeconds();
                return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
            },
            SubmitInvoice(){
                // this.downloadLoading = true
                this.listLoading = true
                console.log(this.list_query.coupon_list)
                SubMitCouponTicketApplyInfo(this.list_query).then(response => {
                    console.log(response);
                    if (response.statusText==="OK"&&response.status==200) {
                        console.log("ok");
                        this.getList();
                    } else {
                        console.log("no");
                    }
                    this.listLoading = false
                })
                this.dialogokVisible=false
            },
            SelectionChange:function(val){
                this.checkedid=0;
                // this.list_query.coupon_list=''
                // this.checkedprice=0
                // this.checkedlen=0
                this.checkedinvoices=val[0]
                this.checkedid=this.checkedinvoices.id
                console.log(this.checkedid)

                // for(var i=0;i<this.checkedinvoices.length;i++){
                //   if(this.list_query.coupon_list==''||this.list_query.coupon_list==null){
                //     this.list_query.coupon_list+=this.checkedinvoices[i].id
                //   }
                //   else{
                //     this.list_query.coupon_list+=","+this.checkedinvoices[i].id
                //   }
                //   this.checkedprice+=parseInt(this.checkedinvoices[i].unit_price);
                // }
                // this.checkedlen=this.checkedinvoices.length;
                // console.log(this.checkedinvoices)
                // console.log(this.checkedlen)
            },
            dialogoutVisibles(){
                console.log(this.checkedlen)
                if(this.checkedlen<=0){
                    this.$message('您还没有选中任何一条记录')
                }
                else{
                    this.dialogokVisible=true
                }
            },
            dialogokVisibles(){
                if(this.checkedlen<=0){
                    this.$message('您还没有选中任何一条记录')
                }
                else{
                    this.dialogoutVisible=true
                }
            },
            handleCloses(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            chooseProvince() {
                this.getStationList()
            },
            //升序
            sortId(a,b){
                // return a.-b.id;
            },
            //判断是否是升序降序
            clickdescType(item){
                // this.listLoading = true
                if(item==''){
                    return
                }
                this.ascdesctxt=item;
                if(this.ascdesctxt=="升序"){
                    var sortArr = this.CompanyList.sort(this.sortDownDate);
                    this.CompanyList =sortArr;
                    console.log(this.CompanyList);
                }
                else{
                    var sortArr = this.CompanyList.sort(this.sortUpDate);
                    this.CompanyList =sortArr;
                    console.log(this.CompanyList);
                }
                // this.list=this.list.sort(compare('apply_tradeId'));
                // console.log(item);
            },
            sortDownDate(a, b) {
                return Date.parse(a.company_balance_create_time) - Date.parse(b.company_balance_create_time);
            },
            sortUpDate(a, b) {
                return Date.parse(b.company_balance_create_time) - Date.parse(a.company_balance_create_time);
            },
            getProvinceList() {
                this.listLoading = true
                // this.cityOptions.length = 0
                // this.gasStationOptions.length = 0
                // fetchStations(this.stationQuery).then(response => {
                //     this.provinceOptions = response.data.data
                //     // Just to simulate the time of the request
                //     this.listLoading = false
                // })
            },
            getCityList(provinceId) {
                this.tempDate.city_id = ''
                this.tempDate.oil_station_id = ''
                if (provinceId) {
                    this.stationQuery.dataType = 2
                    this.stationQuery.province_id = provinceId
                }
                this.listLoading = true
                // fetchStations(this.stationQuery).then(response => {
                //     this.cityOptions = response.data.data
                //     // Just to simulate the time of the request
                //     this.listLoading = false
                // })
            },
            getStationList(cityId) {
                this.tempDate.oil_station_id = ''
                if (cityId) {
                    this.stationQuery.dataType = 3
                    this.stationQuery.province_id = this.tempDate.province_id
                    this.stationQuery.city_id = cityId
                }
                this.listLoading = true
                // fetchStations(this.stationQuery).then(response => {
                //     this.gasStationOptions = response.data.data
                //     // Just to simulate the time of the request
                //     this.listLoading = false
                // })
            },
            compare(obj1,obj2){
                var val1 = parseInt(obj1.sum_balance_amount);
                var val2 = parseInt(obj2.sum_balance_amount);
                if(val1 < val2){
                    return 1;
                }else if(val1 > val2){
                    return -1;
                }else{
                    return 0;
                }
            },
            //状态
            zttypees(val){
                // console.log(val)
                // if(val==0||val==1){
                //   alert("aa")
                //   if(val!=0||val!=1){
                //     val=-1
                //   }
                // alert(val)
                if(val=="no"){
                    this.listQuery.status=0
                }
                else if(val=="ok"){
                    this.listQuery.status=1
                }
                else{
                    this.listQuery.status=-1
                }
                // alert(this.listQuery.status)
                console.log(this.listQuery.status)
                this.getList()
                //   return;
                // }
                //
                // this.getList()

            },
            getList() {
                // this.total=0

                var userid= sessionStorage.getItem(this.$Config.tokenKey).replace("\"","").replace("\"","");
                this.listQuery.user_id=userid
                var AesJson=util.encrypt(JSON.stringify(this.listQuery),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    post_params:AesJson
                }
                console.log(this.listQuery)
                this.listLoading = true
                GetCompanyList(datas).then((res)=>{
                    console.log(res)
                    if(res.data.result==0){
                        this.CompanyList=res.data.data
                        this.total=res.data.total_count
                        this.CompanyList.forEach((item)=>{
                            item.company_balance_create_time= this.DateTime(item.company_balance_create_time)
                        })
                    }
                    else{
                        this.CompanyList=[]
                    }
                    setTimeout(()=>{
                        this.listLoading = false
                    },1000)
                })


            },
            getMerchantList() {
                this.listLoading = true
                getMerchantList({}).then(response => {
                    this.merchantList = response.data.data
                    console.log(response.data.data);
                    // Just to simulate the time of the request
                })
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
            handleFilterDates(item) {
                this.model_infos.model_info.coupon_effectiveTime=item[0]
                this.model_infos.model_info.coupon_expirdDate=item[1]
            },
            handleFilterProvince(item) {
                this.listQuery.pageNum = 1
                this.listQuery.privice_id = item

                this.getList()
            },
            handleFilterCity(item) {
                this.listQuery.pageNum = 1
                this.listQuery.city_id = item

                this.getList()
            },
            handleFilterExchangeType(name) {
                this.listQuery.pageNum = 1
                // alert(name)
                this.listQuery.coupon_type =name
                this.getList()
            },
            handleFilterPayType(a) {
                this.listQuery.pageNum = 1
                this.listQuery.coupon_warning_status =a
                console.log(a)
                // console.log(this.listQuery.ticket_type);
                // this.oiltype=a
                this.getList()
            },
            gotodata(){
                this.getList()
            },
            handleModifyStatus(row, status) {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                row.status = status
            },
            sortChange(data) {
                const {prop, order} = data
                if (prop === 'id') {
                    this.sortByID(order)
                }
            },
            sortByID(order) {
                if (order === 'ascending') {
                    this.listQuery.sort = '+id'
                } else {
                    this.listQuery.sort = '-id'
                }
                this.handleFilter()
            },
            resetTemp() {
                this.tempDate = {
                    id: '',
                    merchant: '',
                    merchant_id: '',
                    balance_apply_user: '',
                    balance_paying_bank: '',
                    balance_remittance_bank: '',
                    balance_remittance_flow: '',
                    balance_charge_money: '',
                    balance_memo: ''
                }
            },
            handleClose() {
            },
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.tempAllData.method = 'add'
                this.dialogFormVisible = true
                this.disabledNow = false
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    console.log(this.tempAllData.method)
                    if (valid) {
                        // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
                        // this.tempData.author = 'vue-element-admin'
                        // this.tempDate
                        if (this.tempAllData.method == 'edit') {
                            this.tempAllData.username = this.balance_apply
                        }

                        this.tempAllData.model_info = {
                            data_create_user: this.balance_apply,
                            m0007_id: this.balance_merchant_id,
                            m0011_reserve_gold_id: new Number(this.tempDate.id),
                            m0011_paying_bank: this.tempDate.balance_paying_bank,
                            m0011_remittance_bank: this.tempDate.balance_remittance_bank,
                            m0011_remittance_flow: this.tempDate.balance_remittance_flow,
                            m0011_reserve_gold_balance: this.tempDate.balance_charge_money,
                            m0011_memo: this.tempDate.balance_memo
                        }
                        console.log(this.tempAllData.model_info)
                        // 提交数据
                        subMitBalanceApplyInfo(this.tempAllData).then((res) => {
                            if (res.data.result === '0') {
                                this.dialogFormVisible = false
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.getList()
                            } else {
                                this.$notify({
                                    title: '提示',
                                    message: '提交失败',
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                            // this.list.unshift(this.tempAllData)
                            // this.dialogFormVisible = false
                            // this.$notify({
                            //   title: '成功',
                            //   message: '创建成功',
                            //   type: 'success',
                            //   duration: 2000
                            // })
                        })
                    }
                })
            },
            handleUpdate(row) {
                this.tempDate = Object.assign({}, row) // copy obj
                console.log(this.tempDate)
                this.disabledNow = true
                this.dialogStatus = 'update'
                this.tempAllData.method = 'edit'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
                console.log(this.tempAllData.method)
            },
            handleDelete(row, method) {
                this.deleteRowData = {dataType: 1, method: 'delete', model_info: {m0011_reserve_gold_id: row.id}}
                this.dialogDeleteVisible = true
            },
            removeRow() {
                // let tempData = { dataType: 1, method: 'delete', model_info: { id: row.id }}
                subMitBalanceApplyInfo(this.deleteRowData).then((res) => {
                    if (res.data.result === '0') {
                        this.deleteRowData = {}
                        this.dialogDeleteVisible = false
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    } else {
                        this.$notify({
                            title: '提示',
                            message: '删除失败',
                            type: 'warning',
                            duration: 2000
                        })
                    }
                    // this.list.unshift(this.tempAllData)
                    // this.dialogFormVisible = false
                    // this.$notify({
                    //   title: '成功',
                    //   message: '创建成功',
                    //   type: 'success',
                    //   duration: 2000
                    // })
                })
            },
            handleFetchPv(pv) {
                fetchPv(pv).then(response => {
                    this.pvData = response.data.pvData
                    this.dialogPvVisible = true
                })
            },
            handleDownload() {
                this.downloadLoading = true
                this.CompanyList.forEach((item)=>{
                    if(item.company_balance_status==-1){
                        item.statestext='未审核'
                    }
                    else if(item.company_balance_status==1){
                        item.statestext='审核已通过'
                    }
                    else{
                        item.statestext='审核未通过'
                    }
                })
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['ID', '公司名称', '公司联络人', '公司电话','公司地址','公司余额','状态','创建时间']
                    const filterVal = ['id', 'company_name', 'company_contacts', 'company_phone','company_address','company_balance','statestext','company_balance_create_time']
                    const data = this.formatJson(filterVal, this.CompanyList)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '企业注册信息'
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
            }
        }
    }
</script>
<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }

    .el-input--small .el-input__inner{
        height: 40px;
    }
</style>