<template>
    <div class="app-container">
        <div style="float: left;clear: both;width: 100%;margin:20px 0;">
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
            <el-select v-if="Role==1" v-model="zttype" clearable placeholder="选择公司"
                       style="width: 150px;margin-left: 20px;"
                       @change="ChangeCompany">
                <el-option v-for="item in companylist" :key="item.key" :label="item.company_name"
                           :value="item.company_id"/>
            </el-select>
            <el-select v-if="Role==1" v-model="zttypes" :disabled="FlagCompany" clearable placeholder="选择车辆"
                       style="width: 150px;margin-left: 20px;"
                       @change="ChangeCar">
                <el-option v-for="item in CompanyCarList" :key="item.key" :label="item.car_no"
                           :value="item.car_no"/>
            </el-select>
            <el-select v-if="Role==1" v-model="zttypess" :disabled="FlagCompany" clearable placeholder="选择员工"
                       style="width: 150px;margin-left: 20px;"
                       @change="ChangeUser">
                <el-option v-for="item in Empeople" :key="item.key" :label="item.real_name"
                           :value="item.user_id"/>
            </el-select>
            <el-select v-if="roleId!=6" v-model="zttypesss"  clearable placeholder="选择状态"
                       style="width: 150px;margin-left: 20px;"
                       @change="ChangeState">
                <el-option v-for="item in StateList" :key="item.key" :label="item.name"
                           :value="item.state"/>
            </el-select>
            <el-input class="inputs" v-model="Intranstion" style="width:200px;margin:0 20px;height: 40px;" size="small"  placeholder="请输入加油站" ></el-input>
            <el-button icon="el-icon-search" v-waves :loading="downloadLoading" type="info"
                       @click="clickSeach" style="margin-left: 20px">搜索</el-button>
        </div>
        <div class="coopon-right">
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
                type="selection"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @sort-change="sortChange"
                @selection-change="SelectionChange">
            <!--<el-table-column-->
                    <!--type="selection"-->
                    <!--width="35"/>-->
            <el-table-column label="消费地点" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gw_station_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="车辆信息" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gw_car_no }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司名称" width="250px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gw_company_name }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column label="消费地点" width="150px" align="center">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{ scope.row.address }}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="员工信息" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gw_user_real_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售金额" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gw_exchange_amount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="消费时间" width="250px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.gw_exchange_date}}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" width="200px" align="center">
                <template slot-scope="scope">
                    <!--<span>{{ scope.row.gw_data_state}}</span>-->
                    <i v-if="scope.row.gw_data_state!=3"  class="fa fa-circle text-danger ml5" style="color: red"/>
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
        <el-dialog  title="编辑"  :visible.sync="dialogeditVisible">
            <el-form ref="dataForm" :rules="rules" :model="model_edit" label-position="left" label-width="120px" style="width: 420px; margin-left:50px;">
                <el-form-item label="电子券码" prop="oil_change_date">
                    <el-input
                            v-model="edit_conpon"
                            placeholder=""
                            clearable/>
                </el-form-item>
                <el-form-item label="状态变更">
                    <el-switch
                            v-model="status_model"
                            active-value="aa"
                            @change="switchedits($event)"
                            inactive-value=bb
                            active-color="#13ce66"
                            :disabled="switchdis"
                            inactive-color="#ccc"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogeditVisible = false">aaa</el-button>
                <el-button type="primary" @click="editvisable">bbbb</el-button>
            </div>
        </el-dialog>
        <!--增加-->
        <el-dialog title="增加"  :visible.sync="dialogaddVisible">
            <el-form ref="dataForm" :rules="rules" :model="model_infos" label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
                <el-form-item label="电子券类型" prop="oil_id">
                    <el-select v-model="list_query.types" class="filter-item" placeholder="选择类型" @change="DateTypeitem">
                        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name" :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="电子券总额" prop="oil_coupon_price">
                    <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入总额" v-model="model_infos.model_info.coupon_amount"></el-input>
                </el-form-item>
                <el-form-item label="电子券请求码" prop="oil_coupon_price">
                    <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入请求码" v-model="model_infos.model_info.coupon_requestCode" ></el-input>
                </el-form-item>
                <el-form-item  label="电子券有效日期" prop="modifyDate">
                    <el-date-picker
                            v-model="listQuery.modifyDates"
                            :picker-options="pickerOptions2"
                            type="daterange"
                            align="right"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            unlink-panels
                            range-separator=""
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="handleFilterDates" />
                </el-form-item>
                <el-form-item label="电子券预警值" prop="oil_coupon_price">
                    <el-input style="width:200px;height: 36px;" size="small"  placeholder="请输入预警值"  v-model="model_infos.model_info.coupon_early_warning_line"></el-input>
                </el-form-item>
                <el-form-item label="电子券状态" prop="oil_change_date">
                    <el-switch
                            v-model="status_add"
                            @change="switchadds"
                            active-value="close"
                            inactive-value="open"
                            active-color="#13ce66"
                            inactive-color="#ccc"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogaddVisible = false">aaa</el-button>
                <el-button type="primary" @click="createAdd">bbbb</el-button>
            </div>
        </el-dialog>





        <el-dialog
            title="提示(是否导出)"
            :visible.sync="dialogoutVisible"
            width="30%"
            :before-close="handleCloses">
                <div>你一共选择了<el-tag>{{checkedlen}}</el-tag>条记录</div>
                <div style="margin-top: 15px;">总金额:<el-tag>{{checkedprice}}</el-tag></div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogoutVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDownload">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import waves from '@/directive/waves' // Waves directive
    import {parseTime, parseDateTime} from '@/utils'
    import {
        getBalanceInfoList,
        getBalanceHistoryInfoList,
        subMitBalanceApplyInfo,
        getBalanceHistory,
        getMerchantList,
        getRecordInfo,
        GetCouponRecordInfo,
        GetCouponTicketRecods,
        SubMitCouponTicketApplyInfo,
        GetCouponBalanceInfo,
        SubMitCouponApplyInfo,
        GetMerchantCouponException,
        SubMitCouponException,
        GetRecordsInfo,
        GetCompanyList,
        GetECompanyList,
        GetEmpolyList,
        GetCompanyCarList
    } from '@/api/balanceManage'
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
                // return parseDateTime(str)
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
                    {key:0,name:'未处理',ifs:"no"},
                    {key:1,name:'已处理',ifs:"ok"}
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
                listLoading: false,
                disabledNow: false,
                nowBalance: 0,
                nowUsername: '',
                balance_apply: '',
                balance_merchant_id: '',
                merchantList: [],
                listQuery: {
                    begin_date: '',
                    end_date: '',
                    car_no:'',
                    company_id:'',
                    user_id:'',
                    station_name:'',
                    state:-1,
                    page_size:10,
                    page_num:1,
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
                companylist:[],
                FlagCompany:true,
                CompanyCarList:[],
                Empeople:[],
                zttypes:'',
                zttypess:'',
                Intranstion:'',
                zttypesss:'',
                StateList:[
                    {
                        name:'未审核',
                        state:2
                    },
                    {
                        name:'已审核',
                        state:3
                    }
                ],
                modifyDate:'',
                Role:'',
            }
        },
        created() {
            this.Role=localStorage.getItem('Role')
            var userinfo=JSON.parse(localStorage.getItem('UserInfo'))
            if(this.Role!=1){
                this.listQuery.company_id=userinfo.company_id
            }
            console.log(userinfo)
            // this.listQuery.begin_date = new Date()
            // this.listQuery.end_date = new Date()
            // this.listQuery.modifyDate = [new Date()+'',new Date()+'']
            this.GetCompanylist()
            // this.GetEmpolylist()
            // this.GetCarlist()
            this.getList()
            // this.getMerchantList()
            // this.roleId = localStorage.getItem('roleId')
            // this.getProvinceList()
        },
        methods: {
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
            GetCompanylist(){
                var datas={
                    company_id:''
                }
                GetECompanyList(datas).then(response => {
                    this.companylist=response.data.data
                    // console.log(this.companylists)
                })
            },
            GetEmpolylist(){
                var datas={
                    company_id:this.listQuery.company_id
                }
                GetEmpolyList(datas).then(response => {
                    if(response.data.data==undefined){
                        this.Empeople=[]
                    }
                    else{
                        this.Empeople=response.data.data
                    }
                    console.log(this.Empeople)

                })
            },
            GetCarlist(){
                var datas={
                    company_id:this.listQuery.company_id
                }
                GetCompanyCarList(datas).then(response => {
                    if(response.data.data==undefined){
                        this.CompanyCarList=[]
                    }
                    else{
                        this.CompanyCarList=response.data.data
                    }
                    // console.log(this.CompanyCarList)
                })
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
            ChangeCompany(val){
                this.listQuery.company_id=val
                this.GetCarlist()
                this.GetEmpolylist()
              if(val==''){
                  this.FlagCompany=true
                  this.zttypes=''
                  this.zttypess=''
                  this.listQuery.car_no=''
                  this.listQuery.user_id=''
              }
              else{
                  this.FlagCompany=false
              }
              this.getList()
            },
            ChangeCar(val){
                console.log(val)
                this.listQuery.car_no=val
                this.getList()
            },
            ChangeUser(val){
                this.listQuery.user_id=val
                this.getList()
            },
            ChangeState(val){
                if(val==''){
                    this.listQuery.state=-1
                }
                else{
                    this.listQuery.state=val
                }
              this.getList()
            },
            clickSeach(){
              this.listQuery.station_name=this.Intranstion
                this.getList()
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
               // console.log(this.model_edit)
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
                return Date.parse(a.gw_exchange_date) - Date.parse(b.gw_exchange_date);
            },
            sortUpDate(a, b) {
                return Date.parse(b.gw_exchange_date) - Date.parse(a.gw_exchange_date);
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
            // compares(obj1,obj2){
            //     var val1 = obj1.gw_exchange_date;
            //     var val2 = obj2.gw_exchange_date;
            //     return val1-val2
            // },
            compare(obj1,obj2){
                var val1 = parseInt(obj1.gw_exchange_date);
                var val2 = parseInt(obj2.gw_exchange_date);
                if(val1 < val2){
                    return 1;
                }else{
                    return -1;
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
                var _this=this
                this.listLoading = true
                setTimeout(()=>{
                    this.listLoading = false
                },1000)
                console.log(this.listQuery)
                var AesJson=util.encrypt(JSON.stringify(this.listQuery),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    post_params:AesJson
                }
                GetRecordsInfo(datas).then(response => {
                    if(response.data.result==1){
                        this.list=[]
                        this.total=0
                        return
                    }
                    else{
                        this.list=response.data.data
                        this.total=response.data.total_count
                        this.list.forEach((item)=>{
                            item.gw_exchange_date=this.ChangeDateFormat(item.gw_exchange_date)
                        })
                    }
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
            handleDownload() {
                this.downloadLoading = true
                this.list.forEach((item)=>{
                    if(item.gw_data_state==3){
                        item.gw_data_state='已审核'
                    }
                    else{
                        item.gw_data_state='未审核'
                    }
                })
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['消费地点', '车辆信息', '员工信息', '销售金额','消费时间','审核状态']
                    const filterVal = ['gw_station_name','gw_car_no', 'gw_user_real_name', 'gw_coupon_amount', 'gw_exchange_date','gw_data_state']
                    const data = this.formatJson(filterVal, this.list)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '电子券异常信息'
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
<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }
    .el-input--small input{
        height:40px;
        line-height: 40px;
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