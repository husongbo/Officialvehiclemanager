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
                <el-select v-if="Userinfo.role_id==1" v-model="zttypes" clearable placeholder="选择公司"
                           style="width: 150px;margin-left: 20px;"
                           @change="changecompanys">
                    <el-option v-for="item in companylist" :key="item.company_id" :label="item.company_name"
                               :value="item.company_id"/>
                </el-select>
                <el-select v-if="roleId!=6" v-model="Financetext" clearable placeholder="财务审核"
                           style="width: 150px;margin-left: 20px;"
                           @change="changeFinance">
                    <el-option v-for="item in Finance" :key="item.state" :label="item.text"
                               :value="item.state"/>
                </el-select>
                <el-select v-if="roleId!=6" v-model="Operatetext" clearable placeholder="运营审核"
                           style="width: 150px;margin-left: 20px;"
                           @change="changeOperate">
                    <el-option v-for="item in Operate" :key="item.key" :label="item.text"
                               :value="item.state"/>
                </el-select>
                <!--<el-button icon="el-icon-search" v-waves :loading="downloadLoading" type="info"-->
                           <!--@click="handleDownload" style="margin-left: 20px">搜索</el-button>-->
            </div>
            <div class="coopon-right">
                <el-button icon="el-icon-circle-plus" type="primary"
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
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top: 40px;"
                @sort-change="sortChange"
                @selection-change="SelectionChange">
            <el-table-column label="公司名称"  align="center" width="250">
                <template slot-scope="scope">
                    <span>{{ scope.row.companyname }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司总金额" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gold_balance_before }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请金额" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.reserve_gold_balance}}</span>
                </template>
            </el-table-column>
            <el-table-column label="汇入银行" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.paying_bank }}</span>
                </template>
            </el-table-column>
            <el-table-column label="汇款银行" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remittance_bank }}</span>
                </template>
            </el-table-column>
            <el-table-column label="流水号" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remittance_flow }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.reserve_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="财务审核状态" width="150px" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.finance_examine_state!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                    <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
                </template>
            </el-table-column>
            <el-table-column label="运营审核状态" width="150px" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.operate_examine_state!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                    <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
                </template>
            </el-table-column>
            <!--<el-table-column label="操作" width="150px" align="center">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-button type="primary" size="mini" @click="dialogedits(scope.row.coupon_no,scope.row.status,scope.row.id)">编辑</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>

        <pagination style=" margin-top: 10px;" v-show="total>0" :total="total" :page.sync="listQuery.page_num"
                    :limit.sync="listQuery.page_size"
                    @pagination="getList"/>

        <el-card class="box-card" style="margin-top: 40px;float: left;clear: both;">
            <div class="text item">
                总记录数: {{total}}
            </div>
            <!--<div class="text item">-->
            <!--总交易金额: {{bussinessTotalMoney}}-->
            <!--</div>-->
        </el-card>

        <!--新建用户-->
        <el-dialog
                :visible.sync="addDialogVisible"
                title="新建企业资金"
                width="40%">
            <el-form ref="addForm"  size="small" label-width="90px">
                <el-form-item prop="ms_role_id" label="选择公司">
                    <el-select v-model="SelectCompany" style="width: 300px;" disabled clearable placeholder="请选择" @change="changecompany" >
                        <el-option
                                v-for="item in companylist"
                                :key="item.company_id"
                                :label="item.company_name"
                                :value="item.company_id"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="公司金额">
                    <el-input
                            v-model="info.gold_balance_before"
                            maxlength="20"
                            clearable
                            placeholder="请输入公司金额"
                            auto-complete="off"
                            tabindex="4"
                            type="number"/>
                    <!--<div v-if="!Verification[0].flag" style="color:red;">请输入正确的电话号码</div>-->
                </el-form-item>
                <el-form-item prop="ms_email" label="申请金额">
                    <el-input
                            v-model="info.reserve_gold_balance"
                            maxlength="100"
                            placeholder="请输入申请金额"
                            auto-complete="off"
                            tabindex="7"
                            type="number"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="汇入银行">
                    <el-input
                            v-model="info.paying_bank"
                            maxlength="100"
                            placeholder="请输入汇入银行"
                            auto-complete="off"
                            tabindex="7"
                            type="text"/>
                </el-form-item><el-form-item prop="ms_email" label="汇款银行">
                <el-input
                        v-model="info.remittance_bank"
                        maxlength="100"
                        placeholder="请输入汇款银行"
                        auto-complete="off"
                        tabindex="7"
                        type="text"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="流水号">
                    <el-input
                            v-model="info.remittance_flow"
                            maxlength="100"
                            placeholder="请输入流水号"
                            auto-complete="off"
                            tabindex="7"
                            type="number"/>
                </el-form-item>
                <!--<el-form-item label="状态" prop="oil_change_date">-->
                    <!--<el-switch-->
                            <!--v-model="status_adds"-->
                            <!--@change="addswitchadds"-->
                            <!--active-value="close"-->
                            <!--inactive-value="open"-->
                            <!--active-color="#13ce66"-->
                            <!--inactive-color="#ccc"/>-->
                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import waves from '@/directive/waves' // Waves directive
    import {GetEmployList,GetECompanyList,SubMitEmployInfo,GetGoldList,SubMitEGoldInfo} from '../../api/balanceManage'
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
                checkedinvoices:[],
                list_query:{
                    coupon_list:'',//选中的id
                    types:''
                },
                addDialogVisible:false,
                info:{
                    company_id:'',
                    gold_balance_before:'',//公司金额
                    reserve_gold_balance:'',//申请金额
                    paying_bank:'',
                    remittance_bank:'',
                    data_state:0,
                    finance_examine_state:0,
                    operate_examine_state:0,
                    remittance_flow:'',
                    reserve_gold_id:1,
                    data_create_user:'',
                    reserve_user:'',
                },
                status_adds:'open',
                Companyid:'',
                CompanyList:[],
                SelectCompany:'',
                SelectUser:'',
                companylists:[],
                Userlists:[],
                flagauaser:true,
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
                    {key:0,name:'在职',ifs:"no"},
                    {key:1,name:'为在职',ifs:"ok"}
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
                ascdesctxt:'',
                names:'',
                oiltype:'',
                zttype:'',
                zttypes:'',
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
                    user_id:'',
                    begin_date:'',
                    end_date:'',
                    company_id:'',
                    finance_examine_state:-1,
                    operate_examine_state:-1,
                    state:0,
                    page_size:10,
                    page_num:1

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
                modifyDate:'',
                companylist:[],
                Finance:[
                    {
                        text:'未审核',
                        state:'no'
                    },
                    {
                        text:'已审核',
                        state:'ok',
                    },
                    {
                        text:'审核未通过',
                        state:'nook'
                    }
                ],
                Operate:[
                    {
                        text:'未审核',
                        state:'no'
                    },
                    {
                        text:'已审核',
                        state:'ok',
                    },
                    {
                        text:'审核未通过',
                        state:'nook'
                    }
                ],
                Financetext:'',
                Operatetext:'',
                Userinfo:'',
            }
        },
        created() {
           this.Userinfo= JSON.parse(localStorage.getItem('UserInfo'))
            this.SelectCompany=this.Userinfo.company_id
            this.Companyid=this.Userinfo.company_id
            this.info.company_id=this.Userinfo.company_id
            console.log(this.Userinfo)
            // this.listQuery.begin_date = new Date()
            // this.listQuery.end_date = new Date()
            // this.listQuery.modifyDate = [new Date()+'',new Date()+'']
            this.GetCompany()
            this.getList()
            // this.getMerchantList()
            // this.roleId = localStorage.getItem('roleId')
            // this.getProvinceList()
        },
        methods: {
            changecompanys(val){
                this.listQuery.company_id=val
                this.getList()
            },
            changeFinance(val){
                if(val==''){
                    this.listQuery.finance_examine_state=-1
                    this.getList()
                    return
                }
                if(val=='no'){
                    this.listQuery.finance_examine_state=0
                }
                else if(val=='ok'){
                    this.listQuery.finance_examine_state=1
                }
                else{
                    this.listQuery.finance_examine_state=2
                }
                this.getList()
            },
            changeOperate(val){
                if(val==''){
                    this.listQuery.operate_examine_state=-1
                    this.getList()
                    return
                }
                if(val=='no'){
                    this.listQuery.operate_examine_state=0
                }
                else if(val=='ok'){
                    this.listQuery.operate_examine_state=1
                }
                else{
                    this.listQuery.operate_examine_state=2
                }
                this.getList()
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
            GetCompany(){
                var datas={
                    company_id:''
                }
                GetECompanyList(datas).then(response => {
                    this.companylist=response.data.data
                    // console.log(this.companylist)
                })
            },
            addswitchadds(val){
                if(val=="open"){
                    this.info.status=0
                }
                else{
                    this.info.status=1
                }
                // console.log(this.info.status)
            },
            AddUser(){
                this.info.reserve_user=this.Userinfo.real_name
                this.info.data_create_user=this.Userinfo.real_name
                console.log(this.info)
                var Aesjson=util.encrypt(JSON.stringify(this.info),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    method:'add',
                    post_params:Aesjson
                }
                SubMitEGoldInfo(datas).then(response => {
                    console.log(response)
                    if(response.data.result==0){
                        this.addDialogVisible=false
                        this.getList()
                        // this.SelectCompany=''
                        // this.info.status=0
                        // this.info.user_password=''
                        // this.info.real_name=''
                        // this.info.company_id=''
                        // this.status_adds='open'

                    }
                })
            },
            changecompany(val){
                this.Companyid=val
                this.info.company_id=val
                if(val=='') {
                    this.SelectCompany = ''
                    this.info.company_id = ''
                    return
                }
            },
            insertdata(item){
                this.model_infos.model_info.coupon_effectiveTime=item[0];
                this.model_infos.model_info.coupon_expirdDate=item[1];
            },
            //选择分类
            DateTypeitem(val){
                this.model_infos.model_info.coupon_type=val
                console.log(val)
            },
            //编辑
            dialogedits(ids,str,id){
                this.edit_conpon=ids;
                this.model_edit.id=id

                // alert(id)
                if(str==1){
                    this.status_model="aa"
                    this.model_edit.status=1
                    this.$message({
                        message: '已处理商户，不可重复处理',
                        type: 'success'
                    })
                    return;
                }
                else{
                    this.status_model="bb"
                    this.model_edit.status=0
                }

                this.dialogeditVisible=true
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
                    var sortArr = this.list.sort(this.sortDownDate);
                    this.list =sortArr;
                    console.log(this.list);
                }
                else{
                    var sortArr = this.list.sort(this.sortUpDate);
                    this.list =sortArr;
                    console.log(this.list);
                }
                // this.list=this.list.sort(compare('apply_tradeId'));
                // console.log(item);
            },
            sortDownDate(a, b) {
                return Date.parse(a.reserve_time) - Date.parse(b.reserve_time);
            },
            sortUpDate(a, b) {
                return Date.parse(b.reserve_time) - Date.parse(a.reserve_time);
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
                this.listLoading = true
                var userid= sessionStorage.getItem(this.$Config.tokenKey);
                var data={
                    user_id:userid.replace("\"","").replace("\"","")
                }
                this.listQuery.user_id=data.user_id
                console.log(this.listQuery)
                var AesJson=util.encrypt(JSON.stringify(this.listQuery),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    post_params:AesJson
                }
                GetGoldList(datas).then(response => {
                    // console.log(response)
                    if(response.data.result==1){
                        this.list=[]
                    }
                    else{
                        this.total=response.data.total_count
                        this.list=response.data.data
                        this.list.forEach((item)=>{
                            item.reserve_time=this.ChangeDateFormat(item.reserve_time)
                            this.companylist.forEach((items)=>{
                                if(items.company_id==item.company_id){
                                    item.companyname=items.company_name
                                }
                            })
                        })
                    }
                    console.log(response)
                })
                setTimeout(()=>{
                    this.listLoading = false
                },1000)
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
                this.list.forEach(item => {
                   if(item.finance_examine_state==0){
                       item.financetext='未审核'
                   }
                   else if(item.finance_examine_state==1){
                       item.financetext='审核已通过'
                   }
                   else{
                       item.financetext='审核未通过'
                   }
                    if(item.operate_examine_state==0){
                        item.operatetext='未审核'
                    }
                    else if(item.operate_examine_state==1){
                        item.operatetext='审核已通过'
                    }
                    else{
                        item.operatetext='审核未通过'
                    }
                })
                var Companylist=this.list
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['公司名称', '公司总金额', '申请金额', '汇入银行','汇款银行','流水号','财务审核状态','运营审核状态','创建时间']
                    const filterVal = ['company_id', 'gold_balance_before', 'reserve_gold_balance', 'paying_bank','remittance_bank','remittance_flow','financetext','operatetext','reserve_time']
                    const data = this.formatJson(filterVal, Companylist)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '企业资金管理信息'
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
    .filter-container{
        float: left;
    }
    .coopon-right{
        float: right;
    }
    .el-input--small .el-input__inner{
        height: 40px;
    }
</style>