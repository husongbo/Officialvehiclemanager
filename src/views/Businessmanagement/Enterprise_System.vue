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
            <el-select v-if="Role==1" v-model="zttypes" clearable placeholder="选择公司"
                       style="width: 150px;margin-left: 20px;"
                       @change="ChangeCompanys">
                <el-option v-for="item in companylists" :key="item.key" :label="item.company_name"
                           :value="item.company_id"/>
            </el-select>
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
            <el-button icon="el-icon-circle-plus"  type="primary"
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
            <!--<el-table-column label="公司名称"  align="center" width="250">-->
                <!--<template slot-scope="scope">-->
                    <!--<span>{{ scope.row.company_name }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="公司联络人" width="180px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_user }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司车辆" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.car_no }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公司资金" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.balance }}</span>
                </template>
            </el-table-column>
            <el-table-column label="车辆状态" width="200px" align="center">
                <template slot-scope="scope">
                <i v-if="scope.row.state!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
                <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="200px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editCar(scope.row)">编辑</el-button>
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
        <!--编辑车辆-->
        <el-dialog
                :visible.sync="editDialogVisible"
                title="编辑车辆"
                width="40%">
            <el-form ref="addForm" :model="formData" size="small" label-width="100px">
                <el-form-item prop="ms_login_password" label="车牌信息">
                    <el-input
                            v-model="CarInfo.car_no"
                            maxlength="20"
                            clearable
                            disabled
                            placeholder=""
                            style="width: 300px;"
                            auto-complete="off"
                            tabindex="4"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="分配金额">
                <el-input
                v-model="info.balance"
                maxlength="100"
                style="width: 300px;"
                placeholder="请输入分配金额"
                auto-complete="off"
                tabindex="7"
                type="number"/>
                    <span style="color: red;margin-left: 20px;">*当前可分配{{CompanyBlance}}元</span>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="对应员工">
                    <el-input
                            v-model="CarUserCount"
                            maxlength="20"
                            clearable
                            placeholder=""
                            disabled
                            style="width: 300px;"
                            auto-complete="off"
                            tabindex="4"
                            type="text"/>
                    <el-button type="info" style="margin-left: 20px;" @click="CarPeopleEdits">车辆员工编辑</el-button>
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
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditCars">确 定</el-button>
      </span>
        </el-dialog>
        <!--车辆员工编辑-->
        <el-dialog
                :visible.sync="CareditDialogVisible"
                title="车辆员工编辑"
                width="40%">
            <div style="display: flex;justify-content: space-between;margin-bottom: 10px;">
                <div>当前员工(移除员工)</div>
                <el-button type="info" size="mini" @click="CaraddDialogVisible=true">添加员工</el-button>
            </div>
            <el-table
                    v-loading="listLoading"
                    :key="tableKey"
                    :data="OkCarList"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;max-height: 300px;overflow-y: scroll;"
                    @sort-change="sortChange"
                    @selection-change="SelectionChange">
                <el-table-column
                        type="selection"
                        disabled="true"
                        width="35" aria-checked="true"/>
                <el-table-column label="公司名称" prop="oil_id" align="center" width="250">
                    <template slot-scope="scope">
                        <span>{{ scope.row.company_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户名" width="150px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.real_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" width="150px" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.user_name }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!--<pagination style=" margin-top: 10px;" v-show="totals>0" :total="totals" :page.sync="listQuerys.page_num"-->
                        <!--:limit.sync="listQuerys.page_size"-->
                        <!--@pagination="getList"/>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="CarEditClose">取 消</el-button>
                <el-button type="primary" @click="CarEditPeople">移除</el-button>
            </span>
        </el-dialog>
        <!--车辆新增员工-->
        <el-dialog
                :visible.sync="CaraddDialogVisible"
                title="车辆新增员工"
                width="40%">
            <div style="display: flex;justify-content: space-between;margin-bottom: 10px;">
                <div>当前员工(新增员工)</div>
                <!--<el-button type="info" size="mini">新增员工</el-button>-->
            </div>
            <el-table
                    v-loading="listLoading"
                    :key="tableKey"
                    :data="NoCarList"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;max-height: 300px;overflow-y: scroll;"
                    @sort-change="sortChange"
                    @selection-change="SelectionChanges">
                <el-table-column
                    type="selection"
                    disabled="true"
                    width="35" aria-checked="true"/>
                <el-table-column label="公司名称" prop="oil_id" align="center" width="250">
                    <template slot-scope="scope">
                        <span>{{ scope.row.company_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户名" width="150px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.real_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" width="150px" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.user_name }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!--<pagination style=" margin-top: 10px;" v-show="addtotals>0" :total="addtotals" :page.sync="addlistQuerys.page_num"-->
                        <!--:limit.sync="addlistQuerys.page_size"-->
                        <!--@pagination="getList"/>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="CaraddDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="CarAddPeople">添加</el-button>
            </span>
        </el-dialog>
        <!--新建车辆-->
        <el-dialog
                :visible.sync="addDialogVisible"
                title="新建车辆"
                width="40%">
            <el-form ref="addForm" :model="formData" size="small" label-width="100px">
                <el-form-item prop="ms_role_id" label="选择公司">
                    <el-select v-model="SelectCompany" clearable placeholder="请选择" style="width: 300px;" disabled @change="changecompany">
                        <el-option
                                v-for="item in companylists"
                                :key="item.company_id"
                                :label="item.company_name"
                                :value="item.company_id"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ms_login_password" label="公司车辆">
                    <el-input
                            v-model="info.car_no"
                            maxlength="20"
                            clearable
                            placeholder="请输入车牌号码"
                            auto-complete="off"
                            tabindex="4"
                            @blur="blurCompanyPhone"
                            type="text"/>
                </el-form-item>
                <el-form-item prop="ms_email" label="车辆行驶证">
                    <el-upload
                            action="http://gwyc.youxinbao.com.cn/Manage/SaveLicenseImage"
                            list-type="picture-card"
                            accept="image/gif,image/jpeg,image/jpg"
                            :on-success="handleAvatarSuccess"
                            :on-error="errorimg"
                            :on-exceed="handleExceed"
                            :on-preview="handlePictureCardPreview"
                            :limit="imgLimit"
                            :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
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
    import {GetECarList,SubMitECarInfo,GetECompanyList,GetEmpolyList,SaveLicenseImage,GetCarEmpolyList,CarBindOrUnBindEmpoly} from '../../api/balanceManage'
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
                editDialogVisible:false,
                addDialogVisible:false,
                CareditDialogVisible:false,
                CaraddDialogVisible:false,
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
                        text:/^[A-Za-z0-9]{6,12}$/,
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
                    {key:0,name:'未激活',ifs:'no'},
                    {key:1,name:'已激活',ifs:'ok'}
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
                totals:1,
                addtotals:1,
                zttypes:'',
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
                listQuerys:{
                    page_num: 1,
                    page_size: 10,
                },
                addlistQuerys:{
                    page_num: 1,
                    page_size: 10,
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
                CompanyList:[],
                SelectCompany:'',
                SelectUser:'',
                companylists:[],
                Userlists:[],
                flagauaser:true,
                info:{
                    balance:'',
                    car_no:'',
                    company_id:'',
                    create_user:'',
                    state:0,
                    license_img:'',
                    id:0,
                },
                Companyid:'',
                dialogImageUrl: '',
                dialogVisible: false,
                imgLimit:1,
                actionimg:'',
                Role:'',
                CarInfo:'',
                CompanyBlance:'',
                NoCarList:[],
                OkCarList:[],
                CarJSon:{
                    car_no:'',
                    type:'',
                    company_id:'',
                    user_id_list:''
                },
                User:'',
                CarUserCount:0,
            }
        },
        created() {
            this.Role=localStorage.getItem('Role')
            var userinfo=JSON.parse(localStorage.getItem('UserInfo'))
            this.User=userinfo
            this.SelectCompany=userinfo.company_id
            this.info.company_id=this.SelectCompany
            var datas={
                company_id:''
            }
            GetECompanyList(datas).then(response => {
                response.data.data.forEach((item)=>{
                    if(item.company_id==this.SelectCompany){
                        console.log(item)
                        if(item.company_balance==null){
                            this.CompanyBlance=0
                        }
                        else{
                            this.CompanyBlance=item.company_balance
                        }
                    }
                })
                console.log(response.data.data)
            })
            this.GetUser()
            if(this.Role!=1){
                this.listQuery.company_id=userinfo.company_id
            }
            this.GetCompany()
            this.getList()
        },
        methods: {
            CarPeopleEdits(){
                this.GetList()
                this.CareditDialogVisible=true
            },
            CarEditClose(){
                this.CareditDialogVisible=false
                this.GetList()
            },
            errorimg(e){
              console.log(e)
            },
            GetList(){
                this.CarUserCount=0
                this.NoCarList=[]
                this.OkCarList=[]
                var json={
                    company_id:this.SelectCompany,
                    car_no:this.CarInfo.car_no
                }
                var AesJson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                // console.log(json)
                var datas={
                    post_params:AesJson
                }
                // console.log(datas)
                GetCarEmpolyList(datas).then(response => {
                    console.log(response)
                    if(response.data.data==undefined){
                        this.NoCarList=[]
                        this.OkCarList=[]
                    }
                    else{
                        response.data.data.forEach((item)=>{
                            if(item.car_no==''){
                                this.NoCarList.push(item)
                            }
                            else{
                                this.CarUserCount++
                                this.OkCarList.push(item)
                            }
                        })
                    }
                })
            },
            //编辑车辆
            EditCars(){
                if(parseFloat(this.info.balance)>parseFloat(this.CompanyBlance)){
                    this.$message.error('申请金额已经大于分配金额')
                    return
                }
                this.info.car_no=this.CarInfo.car_no
                console.log(this.info)
                var Aesjson=util.encrypt(JSON.stringify(this.info),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    method:'edit',
                    post_params:Aesjson
                }
                SubMitECarInfo(datas).then(response => {
                    console.log(response)
                    if(response.data.result==0){
                        this.$message.success('修改车辆信息成功')
                        this.editDialogVisible=false
                        this.getList()
                        this.info.state=0
                        this.info.balance=''
                        this.CarUserCount=''
                        this.info.car_no=''
                        this.info.company_id=''
                        this.info.create_user=''
                        this.info.id=''
                        this.status_adds='open'
                        this.dialogImageUrl=''
                    }
                    else{
                        this.$message.success('修改车辆信息失败')
                    }
                })
                // this.editDialogVisible=false
            },
            //车辆员工编辑
            CarEditPeople(){
                if(this.CarJSon.user_id_list==''){
                    this.CareditDialogVisible=false
                    return
                }
                this.CarJSon.car_no=this.CarInfo.car_no
                this.CarJSon.type=2
                this.CarJSon.company_id=this.SelectCompany
                var Userpsd=localStorage.getItem('Psd')
                var AesJson=util.encrypt(JSON.stringify(this.CarJSon),Userpsd)
                var datas= {
                    user_id: this.User.user_id,
                    post_params: AesJson,
                }
                console.log(this.CarJSon)
                console.log(datas)
                CarBindOrUnBindEmpoly(datas).then(response => {
                    console.log(response)
                    // if(response.data.result==0){
                        this.$message.success("移除员工成功")
                        this.GetList()
                    // }
                    // else{
                    //     this.$message.error("移除员工失败")
                    // }
                })
                this.GetList()
                this.CareditDialogVisible=false
            },
            //车辆新增员工
            CarAddPeople(){
                if(this.CarJSon.user_id_list==''){
                    this.CaraddDialogVisible=false
                    return
                }
                this.CarJSon.car_no=this.CarInfo.car_no
                this.CarJSon.type=1
                this.CarJSon.company_id=this.SelectCompany
                var Userpsd=localStorage.getItem('Psd')
                var AesJson=util.encrypt(JSON.stringify(this.CarJSon),Userpsd)
                var datas= {
                    user_id: this.User.user_id,
                    post_params: AesJson,
                }
                console.log(this.CarJSon)
                console.log(datas)
                CarBindOrUnBindEmpoly(datas).then(response => {
                    console.log(response)
                    if(response.data.result==0){
                        this.$message.success("新增员工成功")
                        this.GetList()
                    }
                    else{
                        this.$message.error("新增员工失败")
                    }
                })
                this.CaraddDialogVisible=false
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
            editCar(row){
                this.CarUserCount=0
                this.info.id=row.id
                this.editDialogVisible=true
                if(row.state==1){
                    this.status_adds='close'
                    this.info.state=1
                }
                else{
                    this.status_adds='open'
                    this.info.state=0
                }
                var json={
                    company_id:row.company_id,
                    car_no:row.car_no
                }
                var AesJson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                // console.log(json)
                var datas={
                    post_params:AesJson
                }
                // console.log(datas)
                GetCarEmpolyList(datas).then(response => {
                    console.log(response)
                    if(response.data.data==undefined){
                    }
                    else{
                        response.data.data.forEach((item)=>{
                            if(item.car_no==''){
                            }
                            else{
                                this.CarUserCount++
                            }
                        })
                    }
                })
                //this.GetList()
                this.CarInfo=row
                console.log(row)
            },
            handleAvatarSuccess(res, file) {//图片上传成功
                console.log(res);
                this.info.license_img=res.license_img
            },
            handleExceed() {//图片上传超过数量限制
                this.$message({
                    message: '只能上传一张图片',
                    type: 'error'
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                console.log(file)
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
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
            changecompany(val){
                this.Companyid=val
                this.info.company_id=val
                if(val==''){
                    this.flagauaser=true
                    this.SelectCompany=''
                    this.info.company_id=''
                    return
                }
                else{
                    this.flagauaser=false
                    this.GetUser()
                }
            },
            ChangeCompanys(val){
              this.listQuery.company_id=val
              this.getList()
            },
            changeuser(val){
                this.SelectUser=val
                this.info.create_user=val
                if(val==''){
                    this.SelectUser=''
                    this.info.create_user=''
                    return
                }
            },
            GetUser(){
              var datas={
                  company_id:this.SelectCompany
              }
                GetEmpolyList(datas).then(response => {
                    this.Userlists=response.data.data
                    // console.log(this.Userlists)
                })
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
                    this.info.state=0
                }
                else{
                    this.info.state=1
                }
                console.log(this.info.state)
            },

            //添加公司
            AddCompany(){
                console.log(this.info)
                var Aesjson=util.encrypt(JSON.stringify(this.info),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    method:'add',
                    user_id:this.User.user_id,
                    post_params:Aesjson
                }
                SubMitECarInfo(datas).then(response => {
                    console.log(response)
                    if(response.data.result==0){
                        this.addDialogVisible=false
                        this.getList()
                        this.SelectCompany=''
                        this.SelectUser=''
                        this.flagauaser=true
                        this.info.state=0
                        this.info.balance=''
                        this.info.car_no=''
                        this.info.id=''
                        this.info.company_id=''
                        this.info.create_user=''
                        this.status_adds='open'
                        this.dialogImageUrl=''

                    }
                })
            },
            ClearFormData(){
                this.formData.company_address=''
                this.formData.company_phone=''
                this.formData.company_balance=''
                this.formData.company_stop_line=''
                this.formData.company_balance=''
                this.formData.company_early_warning_line=''
                this.formData.company_id=''



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
                this.CarJSon.user_id_list=''
                if(val.length==0){
                    this.CarJSon.user_id_list=''
                }
                else{
                    if(val.length==1){
                        this.CarJSon.user_id_list=val[0].user_id
                    }
                    else{
                        val.forEach((item,index)=>{
                            if(val.length-1==index){
                                this.CarJSon.user_id_list+=item.user_id
                            }
                            else{
                                this.CarJSon.user_id_list+=item.user_id+','
                            }
                        })
                    }
                }
            },
            SelectionChanges(val){
                this.CarJSon.user_id_list=''
                if(val.length==0){
                    this.CarJSon.user_id_list=''
                }
                else{
                    if(val.length==1){
                        this.CarJSon.user_id_list=val[0].user_id
                    }
                    else{
                        val.forEach((item,index)=>{
                            if(val.length-1==index){
                                this.CarJSon.user_id_list+=item.user_id
                            }
                            else{
                                this.CarJSon.user_id_list+=item.user_id+','
                            }
                        })
                    }
                }
              console.log(this.CarJSon.user_id_list)
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
                return Date.parse(a.create_time) - Date.parse(b.create_time);
            },
            sortUpDate(a, b) {
                return Date.parse(b.create_time) - Date.parse(a.create_time);
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
                var val1 = parseInt(obj1.create_time);
                var val2 = parseInt(obj2.create_time);
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
            getList() {
                // this.total=0
                this.listLoading = true
                var userid= sessionStorage.getItem(this.$Config.tokenKey).replace("\"","").replace("\"","");
                this.listQuery.user_id=userid
                console.log(this.listQuery)
                var AesJson=util.encrypt(JSON.stringify(this.listQuery),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
                var datas={
                    post_params:AesJson
                }
                GetECarList(datas).then((res)=>{
                    if(res.data.data==undefined){
                        this.CompanyList=[]
                    }
                    else {
                        console.log(res)
                        this.CompanyList = res.data.data
                        this.total=res.data.total_count
                        this.CompanyList.forEach((item)=>{
                            item.create_time=this.ChangeDateFormat(item.create_time)
                        })
                    }
                    console.log(this.CompanyList)
                    setTimeout(()=>{
                        this.listLoading = false
                    },1000)
                })
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
                this.CompanyList.forEach(item => {
                    if(item.state==1){
                        item.statetext='正常'
                    }
                    else{
                        item.statetext='未激活'
                    }
                })
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['ID', '公司联络人', '公司车辆', '公司资金','车辆状态','创建时间']
                    const filterVal = ['id', 'create_user', 'car_no', 'balance','statetext','create_time']
                    // console.log(this.CompanyList)
                    const data = this.formatJson(filterVal, this.CompanyList)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '企业车辆管理信息'
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