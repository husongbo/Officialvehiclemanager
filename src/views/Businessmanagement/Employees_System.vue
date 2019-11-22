<template>
    <div class="app-container">
        <div style="display: flex;justify-content: space-between;">
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
            <el-select v-if="roleId!=6" v-model="zttype" clearable placeholder="状态"
                       style="width: 150px;margin-left: 20px;"
                       @change="zttypees">
                <el-option v-for="item in Typezt" :key="item.key" :label="item.name"
                           :value="item.ifs"/>
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
                :data="lists"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top: 0px;"
                @sort-change="sortChange"
                @selection-change="SelectionChange">
            <el-table-column label="姓名"  align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.real_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="手机号码" width="120px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="省份/城市" width="150px" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.province==null"></span>
                <span v-else>{{ scope.row.province}}-{{scope.row.city}}</span>
            </template>
        </el-table-column>
            <el-table-column label="详情地址" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所在公司" width="250px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.company_text }}</span>
                </template>
            </el-table-column>
            <el-table-column label="邮箱" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.email }}</span>
                </template>
            </el-table-column>
            <el-table-column label="身份证号码" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.driver_id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="车辆信息" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.car_no_list }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.update_trade_pwd_fail_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="50px" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.status!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                    <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="EditUser(scope.row)">编辑</el-button>
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
            <!--&lt;!&ndash;<div class="text item">&ndash;&gt;-->
            <!--&lt;!&ndash;总交易金额: {{bussinessTotalMoney}}&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</el-card>-->

        <!--编辑-->
        <el-dialog
                :visible.sync="editDialogVisible"
                title="编辑员工"
                width="40%">
            <el-form ref="addForm"  size="small" label-width="90px">
                <el-form-item prop="ms_role_id" label="所属公司">
                    <el-input
                            v-model="SuoCompanyText"
                            maxlength="20"
                            clearable
                            disabled
                            placeholder="请输入员工姓名"
                            auto-complete="off"
                            @blur="BlurName"
                            style="max-width: 300px;margin-right: 20px;"
                            tabindex="4"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="员工姓名">
                    <el-input
                            v-model="infos.real_name"
                            maxlength="20"
                            clearable
                            placeholder="员工姓名"
                            auto-complete="off"
                            @blur="BlurName"
                            style="max-width: 300px;margin-right: 20px;"
                            tabindex="4"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="员工邮箱">
                    <el-input
                            v-model="infos.email"
                            maxlength="100"
                            placeholder="员工邮箱"
                            auto-complete="off"
                            tabindex="7"
                            @blur="BlurPhone"
                            style="max-width: 300px;margin-right: 20px;"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="选择车辆">
                    <el-input
                            v-model="Carlength"
                            maxlength="100"
                            disabled
                            placeholder=""
                            auto-complete="off"
                            tabindex="7"
                            style="max-width: 300px;margin-right: 20px;"
                            type="text"/>
                    <el-button type="info" @click="CareditDialogVisible=true">员工车辆编辑</el-button>
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
        <el-button @click="PeopleClose">取 消</el-button>
        <el-button type="primary" @click="EditOk">确 定</el-button>
      </span>
        </el-dialog>

        <!--车辆员工编辑-->
        <el-dialog
                :visible.sync="CareditDialogVisible"
                title="员工车辆编辑"
                width="40%">
            <div style="display: flex;justify-content: space-between;margin-bottom: 10px;">
                <div>当前车辆(移除车辆)</div>
                <el-button type="info" size="mini" @click="CaraddDialogVisible=true">添加车辆</el-button>
            </div>
            <el-table
                    v-loading="listLoading"
                    :key="tableKey"
                    :data="Carcheckedlist"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    @sort-change="sortChange"
                    @selection-change="carokSelectionChange">
                <el-table-column
                        type="selection"
                        disabled="true"
                        width="35" aria-checked="true"/>
                <el-table-column label="ID" prop="oil_id" align="center" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号" width="150px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.car_no }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--<pagination style=" margin-top: 10px;" v-show="totals>0" :total="totals" :page.sync="listQuerys.page_num"-->
            <!--:limit.sync="listQuerys.page_size"-->
            <!--@pagination="EditUser"/>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="CarEditClose">取 消</el-button>
                <el-button type="primary" @click="CarEditPeople">移除</el-button>
            </span>
        </el-dialog>

        <!--车辆添加-->
        <el-dialog
                :visible.sync="CaraddDialogVisible"
                title="员工车辆添加"
                width="40%">
            <div style="display: flex;justify-content: space-between;margin-bottom: 10px;">
                <div>当前车辆(添加车辆)</div>
                <!--<el-button type="info" size="mini" @click="CaraddDialogVisible=true">添加车辆</el-button>-->
            </div>
            <el-table
                    v-loading="listLoading"
                    :key="tableKey"
                    :data="Carnocheckedlist"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;max-height: 500px;overflow-y: scroll;"
                    @sort-change="sortChange"
                    @selection-change="carokSelectionChanges">
                <el-table-column
                        type="selection"
                        disabled="true"
                        width="35" aria-checked="true"/>
                <el-table-column label="ID" prop="oil_id" align="center" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号" width="150px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.car_no }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--<pagination style=" margin-top: 10px;" v-show="totals>0" :total="totals" :page.sync="listQuerys.page_num"-->
                        <!--:limit.sync="listQuerys.page_size"-->
                        <!--@pagination="EditUser"/>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="CaraddDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="CaraddPeople">添加</el-button>
            </span>
        </el-dialog>

        <!--新建用户-->
        <el-dialog
                :visible.sync="addDialogVisible"
                title="新建员工"
                width="40%">
            <el-form ref="addForm"  size="small" label-width="90px">
                <el-form-item prop="ms_role_id" label="公司名称">
                    <el-select v-model="UserCompanyId" disabled clearable placeholder="请选择" @change="changecompany" style="width: 300px;">
                        <el-option
                                v-for="item in companylists"
                                :key="item.company_id"
                                :label="item.company_name"
                                :value="item.company_id"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="员工姓名">
                    <el-input
                            v-model="info.real_name"
                            maxlength="20"
                            clearable
                            placeholder="请输入员工姓名"
                            auto-complete="off"
                            @blur="BlurName"
                            style="max-width: 300px;margin-right: 20px;"
                            tabindex="4"
                            type="text"/>
                    <div v-if="!Verification[0].flag" style="color:red;">员工姓名只能包含中文</div>
                </el-form-item>
                <el-form-item prop="ms_email" label="手机号">
                    <el-input
                            v-model="info.user_name"
                            maxlength="100"
                            placeholder="请输入员工手机号"
                            auto-complete="off"
                            tabindex="7"
                            @blur="BlurPhone"
                            style="max-width: 300px;margin-right: 20px;"
                            type="text"/>
                    <el-button @click="GetPhoneCode" type="success" style="min-width: 80px;">{{Codetext}}</el-button>
                    <span style="color: rgb(133,206,97);font-size: 12px;margin-left: 10px;">此手机号为登录名</span>
                    <div v-if="!Verification[1].flag" style="color:red;">请输入正确的电话号码</div>
                </el-form-item>
                <el-form-item prop="ms_email" label="验证码">
                    <el-input
                            v-model="phone_yz.sms_validate_code"
                            maxlength="100"
                            placeholder="请输入验证码"
                            auto-complete="off"
                            tabindex="7"
                            style="max-width: 300px;margin-right: 20px;"
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import waves from '@/directive/waves' // Waves directive
    import {GetEmployList,GetECompanyList,SubMitEmployInfo} from '../../api/balanceManage'
    import util from "../../utils/util";
    import { SendSmsCode,CheckSmsValidateCode,GetEmpolyCarList,GetECarList,EmpolyBindOrUnBindCar} from '@/api/balanceManage'
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
                editDialogVisible:false,
                Verification:[
                    {
                        id:1,
                        YZM:/[\u4e00-\u9fa5]/g,
                        flag:true
                    },
                    {
                        id:2,
                        YZM:/^[1][3,4,5,7,8][0-9]{9}$/,
                        flag:true
                    }
                ],
                addDialogVisible:false,
                info:{
                    company_id:'',
                    status:0,
                    real_name:'',
                    user_name:'',
                    phone:'',
                },
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
                status_adds:'open',
                status_addss:'open',
                Companyid:'',
                CompanyList:[],
                CareditDialogVisible:false,
                OkCarList:[],
                SelectCompany:'',
                SelectUser:'',
                companylists:[],
                Userlists:[],
                totals:0,
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
                    {key:0,name:'离职',ifs:"no"},
                    {key:1,name:'在职',ifs:"ok"}
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
                lists: [],
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
                modifyDate:'',
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
                UserCompanyId:'',
                Codetext:'获取验证码',
                phone_yz:{
                    sms_validate_code:'',
                    phone:'',
                },
                User:'',
                listQuerys: {
                    begin_date: '',
                    end_date: '',
                    user_id:'',
                    page_num: 1,
                    page_size: 10,
                    company_id:'',
                    state:-1,
                },
                Carlist:[],
                CarKey:'',
                Carcheckedlist:[],
                Carnocheckedlist:[],
                CaraddDialogVisible:false,
                checkedCar:'',
                checkedCars:'',
                CardUser:'',
                Carlength:0,
                SuoCompanyText:'',
                // UserCompanyText:'',
            }
        },
        created() {
            var _this=this
            this.Role=localStorage.getItem('Role')
            var userinfo=JSON.parse(localStorage.getItem('UserInfo'))
            this.User=userinfo
            this.UserCompanyId=userinfo.company_id
            // var datas={
            //     company_id:''
            // }
            // console.log(userinfo.company_id)
            // GetECompanyList(datas).then(response => {
            //     response.data.data.forEach((item)=>{
            //         console.log(item)
            //         if(userinfo.company_id==item.company_id){
            //             alert("A")
            //             _this.UserCompanyId=item.company_name
            //             return
            //         }
            //     })
            //
            // })

            this.info.company_id=userinfo.company_id
            if(this.Role!=1){

                this.info.company_id=this.UserCompanyId
                this.listQuery.company_id=userinfo.company_id
            }
            this.GetCompany()
            this.getList()
        },
        methods: {
            PeopleClose(){
                this.getList()
                this.editDialogVisible=false
            },
            CarEditClose(){
                this.CareditDialogVisible=false
            },
            CarEditPeople(){
                if(this.checkedCars==''){
                    this.CareditDialogVisible=false
                    return
                }
                var jsons={
                    user_id:this.CardUser.user_id,
                    car_no_list:this.checkedCars,
                    type:2
                }
                var Userpsd=localStorage.getItem('Psd')
                var AesJsons=util.encrypt(JSON.stringify(jsons),Userpsd)
                var datass={
                    user_id:this.User.user_id,
                    post_params:AesJsons
                }
                EmpolyBindOrUnBindCar(datass).then(response => {
                    console.log(response)
                    this.GetCar()
                    if(response.data.result==0){
                        this.$message.success('移除车辆成功')
                    }
                    else{
                        this.$message.success('移除车辆失败')
                    }
                    this.CareditDialogVisible=false
                })
                //this.CareditDialogVisible=false
            },
            BlurName(){
                if(!this.Verification[0].YZM.test(this.info.real_name)){
                    this.Verification[0].flag=false
                }
                else{
                    this.Verification[0].flag=true
                }
            },
            EditOk(){
              console.log(this.infos)
                var Userpsd=localStorage.getItem('Psd')

                var AesJson=util.encrypt(JSON.stringify(this.infos),Userpsd)
                var datas={
                    method:'edit',
                    user_id:this.User.user_id,
                    post_params:AesJson
                }
                console.log(datas)
                SubMitEmployInfo(datas).then(response => {
                    console.log(response)
                    this.$message.success('员工信息修改成功')
                    this.editDialogVisible=false
                    this.getList()
                })

            },
            EditUser(row){
                this.CardUser=row
                this.infos.company_id=this.CardUser.company_id
                this.SuoCompanyText=this.CardUser.company_text
                this.infos.phone=this.CardUser.phone.trim()
                this.infos.real_name=this.CardUser.real_name
                this.infos.user_id=this.CardUser.user_id
                this.infos.status=this.CardUser.status
                if(this.infos.status==1){
                    this.status_addss='close'
                }
                else{
                    this.status_addss='open'
                }
                this.infos.email=this.CardUser.email
                this.listQuerys.company_id=row.company_id
                this.listQuerys.user_id=this.User.user_id
                // console.log(this.listQuerys)
                var json={
                    user_id:row.user_id
                }
                this.CarKey=json
               this.GetCar()
            },
            GetCar(){
                this.Carcheckedlist=[]
                this.Carnocheckedlist=[]
                var AesJson=util.encrypt(JSON.stringify(this.listQuerys),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    post_params:AesJson
                }
                GetECarList(datas).then((res)=>{

                    if(res.data.data==undefined){
                        this.Carlist=[]
                    }
                    else {
                        this.Carlist=res.data.data
                        // console.log(res)
                        var AesJson=util.encrypt(JSON.stringify(this.CarKey),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                        var datas={
                            post_params:AesJson
                        }
                        GetEmpolyCarList(datas).then(response => {
                            console.log(response)
                            var list=[]
                            if(response.data.data==undefined){
                                return
                            }
                            if(response.data.data[0].car_no==''||response.data.data[0].car_no==null){
                                list=[]
                            }
                            else{
                                response.data.data.forEach((item)=>{
                                    list.push(item.car_no)
                                })
                            }
                            if(list.length==0){
                                this.Carlength=0
                                this.Carnocheckedlist=this.Carlist
                                this.Carcheckedlist=[]
                                return
                            }
                            console.log(this.Carlist)
                            this.Carlength=list.length
                            this.Carlist.forEach((item)=>{
                                var flag=true
                                list.forEach((items)=>{
                                    if(item.car_no==items){
                                        flag=false
                                        this.Carcheckedlist.push(item)
                                    }
                                })
                                if(flag){
                                    this.Carnocheckedlist.push(item)
                                }
                            })
                            // console.log(this.Carnocheckedlist)
                        })
                        this.editDialogVisible=true
                    }
                })
            },
            GetPhoneCode(){
              setTimeout(()=>{
                  if(!this.Verification[1].flag||this.info.user_name==''){
                      return
                  }
                  var phones={
                      phone:this.info.user_name
                  }
                  console.log(phones)
                  SendSmsCode(phones).then(response => {
                      console.log(response);
                      if(response.data.result==0){
                          this.$message.success('验证码发送成功')
                          var len=60
                          this.Codetext=len
                          var lens=setInterval(()=>{
                              this.Codetext--
                              if(this.Codetext==0){
                                  clearInterval(lens)
                                  this.Codetext='获取验证码'
                              }
                          },1000)
                      }
                      else{
                          this.$message.error('验证码发送失败')
                      }

                  });
              },200)
            },
            BlurPhone(){
                if(!this.Verification[1].YZM.test(this.info.user_name)){
                    this.Verification[1].flag=false
                }
                else{
                    this.Verification[1].flag=true
                }
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
            GetCompany(){
                var datas={
                    company_id:''
                }
                GetECompanyList(datas).then(response => {
                    this.companylists=response.data.data
                    // console.log(this.companylists)
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
            addswitchaddss(val){
                if(val=="open"){
                    this.infos.status=0
                }
                else{
                    this.infos.status=1
                }
            },
            AddUser(){
                this.phone_yz.phone=this.info.user_name
                CheckSmsValidateCode(this.phone_yz).then(response=>{
                    console.log(response)
                })
                    this.info.phone=this.info.user_name
                    if(this.info.real_name==''||this.info.user_name==''||this.phone_yz.sms_validate_code==''){
                        this.$message.error('文本框的值不能为空')
                        return
                    }
                    if(!this.Verification[0].flag&&!this.Verification[1].flag){
                        this.$message.error('请正确输入文本框的值')
                        return
                    }
                    console.log(this.info)
                    var psd=localStorage.getItem('Psd')
                    console.log(psd)
                    var Aesjson=util.encrypt(JSON.stringify(this.info),psd)
                    var datas={
                        method:'add',
                        user_id:this.User.user_id,
                        post_params:Aesjson
                    }
                    SubMitEmployInfo(datas).then(response => {
                        console.log(response)
                        if(response.data.result==0){
                            this.addDialogVisible=false
                            this.getList()
                            this.SelectCompany=''
                            this.info.phone=''
                            this.info.status=0
                            this.info.real_name=''
                            this.phone_yz.sms_validate_code=''
                            this.status_adds='open'

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
            carokSelectionChange(val){
                this.checkedCars=''
                if(val.count==0){
                    this.checkedCars=''
                    return
                }
                if(val.count==1){
                    this.checkedCars=val[0].car_no
                }
                else{
                    val.forEach((item,index)=>{
                        if(val.length-1==index){
                            this.checkedCars+=item.car_no
                        }
                        else{
                            this.checkedCars+=item.car_no+","
                        }
                    })
                }

                console.log(this.checkedCars)
            },
            CaraddPeople(){
                if(this.checkedCar==''){
                    this.CaraddDialogVisible=false
                    return
                }
                var jsons={
                    user_id:this.CardUser.user_id,
                    car_no_list:this.checkedCar,
                    type:1
                }
                var Userpsd=localStorage.getItem('Psd')
                var AesJsons=util.encrypt(JSON.stringify(jsons),Userpsd)
                var datass={
                    user_id:this.User.user_id,
                    post_params:AesJsons
                }
                console.log(jsons)
                console.log(datass)
                EmpolyBindOrUnBindCar(datass).then(response => {
                    console.log(response)
                    this.GetCar()
                    if(response.data.result==0){
                        this.$message.success('车辆绑定成功')
                    }
                    else{
                        this.$message.success('车辆绑定失败')
                    }
                    this.CaraddDialogVisible=false
                })
            },
            carokSelectionChanges(val){
                this.checkedCar=''
                if(val.count==0){
                    this.checkedCar=''
                    return
                }
                if(val.count==1){
                    this.checkedCar=val[0].car_no
                }
                else{
                    val.forEach((item,index)=>{
                        if(val.length-1==index){
                            this.checkedCar+=item.car_no
                        }
                        else{
                            this.checkedCar+=item.car_no+","
                        }
                    })
                }

                console.log(this.checkedCar)
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
                    var sortArr = this.lists.sort(this.sortDownDate);
                    this.lists =sortArr;
                    // console.log(this.list);
                }
                else{
                    var sortArr = this.lists.sort(this.sortUpDate);
                    this.lists =sortArr;
                    // console.log(this.list);
                }
                // this.list=this.list.sort(compare('apply_tradeId'));
                // console.log(item);
            },
            sortDownDate(a, b) {
                return Date.parse(a.update_trade_pwd_fail_time) - Date.parse(b.update_trade_pwd_fail_time);
            },
            sortUpDate(a, b) {
                return Date.parse(b.update_trade_pwd_fail_time) - Date.parse(a.update_trade_pwd_fail_time);
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
            getList() {
                // this.total=0
                var companylist=[]
                this.lists=[]
                var datas={
                    company_id:''
                }
                GetECompanyList(datas).then(response => {
                    companylist=response.data.data
                    // console.log(response)
                    this.listLoading = true
                    var userid= sessionStorage.getItem(this.$Config.tokenKey).replace("\"","").replace("\"","");
                    this.listQuery.user_id=userid
                    var AesJson=util.encrypt(JSON.stringify(this.listQuery),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                    var datas={
                        post_params:AesJson
                    }
                    GetEmployList(datas).then(response => {

                        if(response.data.data==undefined){
                            this.lists=[]
                        }
                        else{
                            this.lists=response.data.data
                            this.total=response.data.total_count
                            this.lists.forEach((item)=>{
                                item.update_trade_pwd_fail_time=this.ChangeDateFormat(item.update_trade_pwd_fail_time)

                                companylist.forEach((val)=>{
                                    if(val.company_id==item.company_id){
                                        item.company_text=val.company_name
                                    }
                                })
                            })
                        }
                        console.log(response)
                    })
                    console.log(companylist)
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
                var _this=this
                this.downloadLoading = true
                this.lists.forEach(item => {
                    if(item.status==1){
                        item.statestext='正常'
                    }
                    else{
                        item.statestext='未激活'
                    }
                })
                //console.log(this.lists)
                var PeopleList=this.lists
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['姓名', '手机号码', '所在省份', '所在城市','电子邮箱','详细地址','绑定的车辆','公司名称','个人资产','状态','创建时间']
                    const filterVal = ['real_name', 'phone', 'province', 'city','email','address','car_no_list','company_text','personal_balance','statestext','update_trade_pwd_fail_time']
                    // console.log(PeopleList)
                    const data = this.formatJson(filterVal, PeopleList)
                    // console.log(data)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '企业员工信息'
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