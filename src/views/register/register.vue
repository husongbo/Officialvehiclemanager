<template>
  <div class="register">
    <div class="totle" style="display: flex;align-items: center;padding-left: 40px;">
      <img src="../../assets/images/logins.png" alt="" width="100px" height="100px">
      <span style="font-weight: bold;font-family: '微软雅黑'">公务用车平台</span>
    </div>
    <el-steps class="steps" :active="active" align-center finish-status="success">
      <el-step title="商户注册"></el-step>
      <el-step title="商户验证"></el-step>
      <el-step title="完成企业信息"></el-step>
      <el-step title="注册完成"></el-step>
    </el-steps>
    <div class=" registers">
      <div class="divs" :style="{display:disone}"style="float: left;clear: both;">
        <el-form class="forms" label-position="left" label-width="120px">
          <el-form-item label="商户名称:" prop="oil_coupon_price" class="foems">
            <el-input type="test" style="width:300px;border-radius: 5px;color:black!important;" size="small" @blur="shname()"   v-model="mername.merchant_name"
              placeholder="请输入入驻商户名称"></el-input>
            <span class="title" :style="{visibility:titleone}">商户名已被使用。</span>
          </el-form-item>
          <el-form-item label="登录账户:" prop="oil_coupon_price" class="foems">
            <el-input type="test" style="width:300px;border-radius: 5px;color:black!important;" placeholder="请输入登录账户" v-model="merchant_name.merchant_user_name">
            </el-input>
            <span class="title" :style="{visibility:titletwo}">账户已被使用</span>
          </el-form-item>
          <el-form-item label="登录密码:" prop="oil_coupon_price" class="foems">
            <el-input type="password" style="width:300px;border-radius: 5px;color:black!important;" size="small" v-model="user_pwd" @blur="userpwds"
              placeholder="请设置登录密码"></el-input>
            <span class="title" :style="{visibility:titlethree}">请设置登录密码</span>
          </el-form-item>
          <el-form-item label="重复登录密码:" prop="oil_coupon_price" class="foems">
            <el-input type="password" style="width:300px;border-radius: 5px;color:black!important;" size="small" v-model="user_pwds" @blur="judgepsd()"
              placeholder="请再次输入登录密码"></el-input>
            <span class="title" :style="{visibility:titlefour}">密码不一致</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <router-link to="/login">
          <el-button @click="dialogaddVisible = false" style="margin-right: 20px;">取消</el-button>
          </router-link>
          <el-button type="primary" @click="nextinfotwo">下一步</el-button>
        </div>
      </div>

      <div class="divs" style="margin: 0 auto;float: left;clear: both;" :style="{display:distwo}">
        <el-form class="forms" label-position="left" label-width="120px" style="">
          <el-form-item label="商户联系人姓名:" prop="oil_coupon_price" class="foems">
            <el-input type="test" style="width:300px;border-radius: 5px;color:black!important;" size="small" v-model="SYyz.contacts" @blur="contactsname"
              placeholder="请输入商户联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机号:" prop="oil_coupon_price" class="foems">
            <el-input class="phones" type="test" style="width:300px;border-radius: 5px;color:black!important;margin-right: 20px" v-model="SYyz.phone" @blur="contactsphone"
              placeholder="请输入商户联系人手机号"></el-input>
          </el-form-item>
          <div id="demo">
            <span class="demo-span">验证:</span>
            <div id="slider">
              <div id="slider_bg"></div>
              <span id="label">>></span> <span id="labelTip">拖动滑块获取验证码</span>
            </div>
          </div>
          <!--<el-form-item label="滑块:" prop="oil_coupon_price" class="foems">-->
          <!--</el-form-item>-->
        </el-form>
        <el-form class="forms" label-position="left" label-width="120px" style="">
          <el-form-item label="验证码:" prop="oil_coupon_price" class="foems">
            <el-input type="" style="width:300px;border-radius: 5px;color:black!important;" size="small" v-model="phone_yz.sms_validate_code"
              placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="previnfotwo()" style="margin-right: 20px;">上一步</el-button>
          <el-button type="primary" @click="nextinfothree()">下一步</el-button>
        </div>
      </div>

      <div style="width: 48%;margin: 0 30%;" :style="{display:disthree}">
        <div class="divs" style="float: left;clear: both;">
          <el-form class="forms" label-position="left" label-width="130px" style="">
            <el-form-item label="企业注册信息:" prop="oil_coupon_price" class="foems">
              <el-input type="test" style="width:300px;border-radius: 5px;color:black!important;" size="small" v-model="CompanyText"
                        placeholder="请输入公司注册名称"></el-input>
              <span
                style="float:right;font-size: 0.6rem;color:#cccc;margin-left: 5px;text-align: left;width:160px;">请填写公司注册名称</span>
            </el-form-item>

            <el-form-item label="联系地址:" prop="oil_coupon_price" class="foems">
              <el-input type="test" style="width:300px;border-radius: 5px;color:black!important;margin-right: 20px" v-model="qiyeparams.company_address"
                        placeholder="请输入公司联系地址"></el-input>
              <span
                style="float:right;font-size: 0.6rem;color:#cccc;margin-left: 5px;text-align: left;width:160px;">请填写公司联系地址</span>
            </el-form-item>
            <el-form-item label="统一社会信用代码:" prop="oil_coupon_price" class="foems">
              <el-input type="test" style="width:300px;border-radius: 5px;color:black!important;margin-right: 20px" v-model="qiyeparams.company_tyshxydm" @blur="coupondaima"
                        placeholder="请输入统一社会信用代码"></el-input>
              <span
                style="float:right;font-size: 0.6rem;color:#cccc;margin-left: 5px;text-align: left;width:160px;">请填写统一社会信用代码</span>
            </el-form-item>
            <el-form-item label="营业执照:" prop="oil_coupon_price" class="foems">
              <el-upload class="upload-demo" style="width:80px;float: left;"
                         :action="actionones" :on-preview="handlePreview" :on-remove="handleRemove" :on-error="errors"  :on-exceed="handleExceed" :limit="imgLimit" accept="image/gif,image/jpeg"
                         list-type="picture" :before-upload="beforeAvatarUpload" :on-success="successed"
              >
                <el-button size="small" type="primary">选择文件</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
              <span
                style="float:right;font-size: 0.6rem;color:#cccc;margin-left: 5px;text-align: left;width:160px;">仅支持jpg,文件大小
            <=2M</span> </el-form-item> <el-form-item label="开户许可证:" prop="oil_coupon_price" class="foems">
            <el-upload class="upload-demo" style="width:80px;float: left;"  :on-exceed="handleExceed" :limit="imgLimit" accept="image/gif,image/jpeg"
                       :action="actiontwos" :on-preview="handlePreview" :on-success="successedtwo"
                       :on-remove="handleRemove"  list-type="picture" :before-upload="beforeAvatarUpload"
            >
              <el-button size="small" type="primary">选择文件</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span
              style="float:right;font-size: 0.6rem;color:#cccc;margin-left: 5px;text-align: left;width:160px;">仅支持jpg,文件大小
                <=2M</span> </el-form-item>
            <!--<el-form-item label="合同编号:" prop="oil_coupon_price" class="foems">-->
            <!--<el-input type="test" style="width:300px;border-radius: 5px;color:black!important;margin-right: 20px" v-model="qiyeparams.company_htbh"-->
                      <!--placeholder="请输入合同编号"></el-input>-->
          <!--</el-form-item>-->
            <el-form-item label="合同扫描件:" prop="oil_coupon_price" class="foems">
              <el-upload class="upload-demo" style="width:80px;float: left;"  :on-exceed="handleExceed" :limit="imgLimit" accept="application/pdf"
                         :action="actionthrees" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="successedthree"
                         list-type="picture" :before-upload="beforeAvatarUploads"
              >
                <el-button size="small" type="primary">选择文件</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
              <span
                style="float:right;font-size: 0.6rem;color:#cccc;margin-left: 5px;text-align: left;width:160px;">仅支持pdf,文件大小
            <=5M</span> </el-form-item> </el-form> <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button @click="dialogaddVisibles = false">取消</el-button>-->
          <!--<el-button type="primary" @click="">下一步</el-button>-->
          <!--</div>-->
          <div slot="footer" class="dialog-footer" style="margin-bottom: 30px;">
            <el-button @click="previnfothree()" style="margin-right: 20px;">上一步</el-button>
            <el-button type="primary" @click="nextinfofour()">完成</el-button>
          </div>
        </div>
      </div>


    </div>


  <div class="finishs" :style="{display:disfour}">
    <div class="finimg">
      <img src="./finish.png"/>
    </div>
    <div class="finish-title">资料已提交，请等待审核

    </div>
    <router-link to="/login">
    <div style="display: flex;justify-content: center;margin-top: 20px">
      <el-button type="primary" @click="clicklogin()">点击登录</el-button>
    </div>
    </router-link>
  </div>

  </div>
</template>
<script>
  import { isvalidUsername } from '@/utils/validate'
  import LangSelect from '@/components/LangSelect'
  import SocialSign from './socialsignin'
  import loginPic from '@/assets/images/zsylogo-login.png'
  import { UpLoadFile,CheckMerchantName,CheckMerchantUserName,RegisterMerchant,RegisterMerchantUser,UpdateUserInfo,SendSmsCode,CheckSmsValidateCode,SaveImage,UpdateMerchant} from '@/api/balanceManage'
  import {RegisterCompanyUser,UpdateCompanyUser,RegisterCompany,UpdateCompanyInfo,CheckYYDM} from '@/api/login'
  import  './slide-unlock.css'
  import './jquery.slideunlock.js'
  import util from "../../utils/util";
  // import SliderUnlock from 'slideunlock'
  export default {
    name: 'Login',
    components: { LangSelect, SocialSign },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名！'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度6-8位'))
        } else {
          callback()
        }
      }
      return {
        serverUrl:'http://gw.youxinbao.com.cn/upload/',
        header: {token: sessionStorage.token},
        loginPic: loginPic + '?' + +new Date(),
        dialogaddVisible: false,
        dialogaddVisibles: false,
        value1: 0,
        disone: 'block',
        distwo: 'none',
        disfour:'none',
        active: 0,
          User_ids:'',
          CompanyId:'',
        mername:{
          merchant_name:''//商户名
        },
        merchant_name:{
          merchant_user_name:''//用户名
        },
        user_pwd:'',//密码
        phone_yz:{
          sms_validate_code:''
        },
        user_pwds:'',
        user_id:0,
        merchant_id:0,
        actionones:'',
        actiontwos:'',
        actionthrees:'',
        imgLimit: 1,
        titleone:'hidden',
        titletwo:'hidden',
        titlethree:'hidden',
        titlefour:'hidden',
        disthree: 'none',
        successone:false,
        successtwo:false,
        successthree:false,
        xinyong:false,
        contractnames:false,//商户名
        contractphones:false,//手机号
        passwords:false,//密码
        imgparms:{
          merchant_id:0,
          id:0
        },
        qiyeparams:{
          user_id:0,
          merchant_id:0,
          company_name:'',
          company_address:'',
          company_tyshxydm:'',
          company_htbh:''
        },
        senduser:{
          user_name:'',
          user_pwd:''
        },
        sendusername:{
          merchant_name:''
        },
        SYyz:{
          user_id:0,
          merchant_id:0,
          contacts:'',
          phone:''
        },
        formLabelWidth: '120px',
        codeImg: 'http://gw.youxinbao.com.cn/Public/GetValidateCode',
        fileList2: [{
          name: 'food.jpeg', url: ''
        }],
        loginForm: {
          username: '',
          password: '',
          validateCode: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        numType: 'text',
        loading: false,
        showDialog: false,
        redirect: undefined,
          CompanyText:'',
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {

      // window.addEventListener('hashchange', this.afterQRScan)
    },
    mounted(){
      $(function () {
        var slider = new SliderUnlock("#slider", {
          successLabelTip: "验证成功"
        }, function () {
          // setTimeout(function () {
          $("#labelTip").html("验证成功");
          $("#labelTip").css("color", "#787878");
          var ph=$(".phones").find('input').val();
          var phones={
            phone:ph
          }
          console.log(phones)
          SendSmsCode(phones).then(response => {
            console.log(response);

          });
          // }, 2000);
          // slider.init();
        });
        slider.init();
      })
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      //密码校验
      password(pwd){
        var reg = /^[0-9A-Za-z]{6,12}$/;
        if(!reg.test(pwd)){
          return false
        }
        return true
      },
      userpwds(){
        if(!this.password(this.user_pwd)){
          this.$message({
            message: '请填写正确的密码(最少6位，最多12位)',
            type: 'error'
          })
          this.passwords=false
          return false
        }
        this.passwords=true
        return true
      },
      //商户名判断
      shname(){
          var json={
              company_name:this.mername.merchant_name
          }
          var AesJson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
          var datass={
              post_params:AesJson
          }
          console.log(json)
          RegisterCompany(datass).then(response => {
          console.log(response);
          if(response.data.result==0){
              this.CompanyText=this.mername.merchant_name
              this.CompanyId=response.data.company_id
              this.actionones="http://gwyc.youxinbao.com.cn/Manage/SaveImage?company_id="+this.CompanyId+"&id=1"
              this.actiontwos="http://gwyc.youxinbao.com.cn/Manage/SaveImage?company_id="+this.CompanyId+"&id=2"
              this.actionthrees="http://gwyc.youxinbao.com.cn/Manage/SaveImage?company_id="+this.CompanyId+"&id=3"
            this.titleone="hidden"
            return
          }
          else{
              this.titleone="visible"
          }
        });
      },
      //中文校验
      subname(name) {
        var han = /^[\u4e00-\u9fa5]+$/;
        if (!han.test(name)) {
          return false;
        };
        return true;
      },
      contactsname(){
        var inx=this.subname(this.SYyz.contacts)
        if(!inx){
          this.$message({
            message: '请填写正确的商户名(只能是中文)',
            type: 'error'
          })
          this.contractnames=false
          return false
        }
        this.contractnames=true
        return true

      },
      //统一社会信用代码校验
    CheckSocialCreditCode(Code)
      {
        var patrn = /^[0-9A-Z]+$/;
        //18位校验及大写校验
        if ((Code.length != 18) || (patrn.test(Code) == false)) {
          console.info("不是有效的统一社会信用编码！");
          return false;
        }
        else {
          var Ancode;//统一社会信用代码的每一个值
          var Ancodevalue;//统一社会信用代码每一个值的权重
          var total = 0;
          var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
          var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
          //不用I、O、S、V、Z
          for (var i = 0; i < Code.length - 1; i++) {
            Ancode = Code.substring(i, i + 1);
            Ancodevalue = str.indexOf(Ancode);
            total = total + Ancodevalue * weightedfactors[i];
            //权重与加权因子相乘之和
          }
          var logiccheckcode = 31 - total % 31;
          if (logiccheckcode == 31) {
            logiccheckcode = 0;
          }
          var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
          var Array_Str = Str.split(',');
          logiccheckcode = Array_Str[logiccheckcode];


          var checkcode = Code.substring(17, 18);
          if (logiccheckcode != checkcode) {
            console.info("不是有效的统一社会信用编码！");
            return false;
          } else {
            console.info("yes");
          }
          return true;
        }
      },
      coupondaima(){
        var toggle=this.CheckSocialCreditCode(this.qiyeparams.company_tyshxydm);
        if(!toggle){
          this.$message({
            message: '请填写正确的信用代码',
            type: 'error'
          })
          this.xinyong=false
        }
        else{
            var json={
                company_yydm:this.qiyeparams.company_tyshxydm
            }
            console.log(json)
            var Aesjson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
            var datas={
                post_params:Aesjson
            }
            CheckYYDM(datas).then(response => {
                console.log(response)
                if(response.data.message=='信用代码已存在'&&response.data.result==0){
                    this.$message({
                        message: response.data.message,
                        type: 'error'
                    })
                    this.xinyong=false
                    return
                }
                this.xinyong=true
                return true
            })
        }
      },
      successed(){
        this.successone=true
      },
      successedtwo(){
        this.successtwo=true
      },
      successedthree(){
        this.successthree=true
      },
      //用户名判断
      username(){
        CheckMerchantUserName(this.merchant_name).then(response => {
          console.log(response);
          if(response.data.result==0){
            this.titletwo="hidden"
            return
          }
          else{
            this.titletwo="visible"
          }
        });
      },
      //手机号校验
      checkMobile(str) {
        var re = /^1\d{10}$/
        if (re.test(str)) {
          this.contractphones=true
          return true
        } else {
          this.contractphones=false
          return false
        }
      },
      contactsphone(){
        var to=this.checkMobile(this.SYyz.phone)
        if(!to){
          this.$message({
            message: '请填写正确的手机号',
            type: 'error'
          })
          return false
        }
        return true
      },
      //效验验证码
      CheckCode(){
        // phone_yz

      },
      handlehttprequest(a){
        // console.log(a.file)
        // var form = new FormData();
        // // 文件对象
        // form.append("file", a.file);
        // var lensize=a.file.size
        // var size=lensize/ 1024 / 1024 < 2;
        //
        // if(!size){
        //   this.$message({
        //     message: '上传失败，文件过大',
        //     type: 'error'
        //   })
        //   return false
        // }
        console.log(this.imgparms)
        this.imgparms.id=1;
        SaveImage(this.imgparms).then(response => {
          console.log(response);
        });

        // UpLoadFile(form).then(response => {
        //   console.log(response);
        // });
        // console.log(form.get('file'))
      },
      handlehttprequests(){
        console.log(a.file)
        var form = new FormData();
        // 文件对象
        form.append("file", a.file);
        var lensize=a.file.size
        var size=lensize/ 1024 / 1024 < 5;

        if(!size){
          this.$message({
            message: '上传失败，文件过大',
            type: 'error'
          })
          return false
        }
        UpLoadFile(form).then(response => {
          console.log(response);
        });
        console.log(form.get('file'))
      },
      errors(){
        alert("錯誤");
      },
      nextinfotwo() {
        console.log(this.user_pwd)
        console.log(this.user_pwds)
        if(this.merchant_name.merchant_user_name==""||this.user_pwd==""||this.user_pwds==""){
          this.$message({
            message: '文本框不可以为空，请重新输入！',
            type: 'error'
          })
          return false
        }
        var json={
            user_name:this.merchant_name.merchant_user_name,
            auth_password:this.user_pwds
        }
        var datajson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
          var datas={
              post_params:datajson
          }
          console.log(json)
        console.log(datajson)
          RegisterCompanyUser(datas).then(response => {
              console.log(response)
              if(response.data.result==0){
                  this.User_ids=response.data.user_id
                  this.$notify({
                    title: '',
                    message: '填写商户验证',
                    type: 'success',
                    duration: 2000
                  })
                  this.disone = "none";
                  this.distwo = "block";
                  this.active = 1;
              }
              else{
                    this.$message({
                      message: '网络延迟，请稍后再试',
                      type: 'error'
                    })
              }
          })
        // if(this.titletwo=="visible"||this.titlethree=="visible"||this.titlefour=="visible"||!this.passwords){
        //   this.$message({
        //     message: '输入有误！请重新输入',
        //     type: 'error'
        //   })
        //   return false
        // }
        // this.sendusername.merchant_name=this.mername.merchant_name
        // this.senduser.user_name=this.merchant_name.merchant_user_name
        // this.senduser.user_pwd=this.user_pwd
        // RegisterMerchant(this.sendusername).then(response => {
        //   console.log(response)
        //   this.merchant_id=response.data.result1
        //   this.imgparms.merchant_id=response.data.result1
        //   this.qiyeparams.merchant_id=response.data.result1
        //   this.actionones="http://gw.youxinbao.com.cn/Public/SaveImage?merchant_id="+response.data.result1+"&id=1"
        //   this.actiontwos="http://gw.youxinbao.com.cn/Public/SaveImage?merchant_id="+response.data.result1+"&id=2"
        //   this.actionthrees="http://gw.youxinbao.com.cn/Public/SaveImage?merchant_id="+response.data.result1+"&id=3"
        //
        //   console.log(this.merchant_id)
        // //   console.log(this.user_id)
        // //   console.log(response);
        // });
        // RegisterMerchantUser(this.senduser).then(response => {
        //   console.log(response)
        //   // console.log(response.data)
        //   this.user_id=response.data.result1
        //   this.qiyeparams.user_id=response.data.result1
        //   console.log(this.user_id)
        //   // console.log(this.merchant_id)
        //   // console.log(response);
        // });

      },
      posturl(){
        return 'http://gw.youxinbao.com.cn/upload/'
      },
      previnfotwo(){
        this.disone = "block";
        this.distwo = "none";
        this.active-=1;
      },
      previnfothree(){
        this.distwo = "block";
        this.disthree = "none";
        this.active-=1;
      },
      nextinfothree() {

        // this.SYyz.user_id=this.user_id
        // this.SYyz.merchant_id=this.merchant_id
        if(this.SYyz.contacts!=''&&this.SYyz.phone!=''&&this.phone_yz.sms_validate_code!=''&&this.contractnames&&this.contractphones){
            var json={
                user_id:this.User_ids,
                real_name:this.SYyz.contacts,
                phone:this.SYyz.phone
            }
            var AesJson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
            var DataJson={
                post_params:AesJson
            }
            // CheckSmsValidateCode(this.phone_yz).then(response=>{
            //   console.log(response.data.result)
            //   if(parseInt(response.data.result)===0) {
                  UpdateCompanyUser(DataJson).then(response => {
                      console.log(response)
                      if (parseInt(response.data.result) == 0) {
                          this.$notify({
                              title: '',
                              message: '填写企业信息',
                              type: 'success',
                              duration: 2000
                          })
                          this.distwo = "none";
                          this.disthree = "block";
                          this.active = 2;
                      }
                  })
            //   }
            //   else{
            //     this.$message({
            //       message: '验证码不正确，请重新输入',
            //       type: 'error'
            //     })
            //   }
            // })
        }
        else{
          this.$message({
            message: '文本框能输入正确的内容',
            type: 'error'
          })
        }

      },
      nextinfofour(){
        console.log(this.qiyeparams)
        if(this.qiyeparams.company_address!=''&&this.CompanyText!=''&&this.xinyong){
          if(this.successone&&this.successtwo&&this.successthree){
              var json={
                  company_id:this.CompanyId,
                  company_name:this.CompanyText,
                  company_address:this.qiyeparams.company_address,
                  company_yydm:this.qiyeparams.company_tyshxydm
              }
              var AesJson=util.encrypt(JSON.stringify(json),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
              var datas={
                  user_id:this.User_ids,
                  post_params:AesJson
              }
              console.log(json)
              UpdateCompanyInfo(datas).then(response => {
                  if(response.data.result==0){
                      this.disthree = "none";
                      this.disfour="block";
                      this.active = 3;
                      this.$notify({
                        title: '成功',
                        message: '注册成功',
                        type: 'success',
                        duration: 2000
                      })
                  }
              console.log(response)
            });
          }
          else{
            this.$message({
              message: '必须选择图片',
              type: 'error'
            })
          }
        }
        else{
          this.$message({
            message: '文本框内请填写正确的内容',
            type: 'error'
          })
        }

      },
      clicklogin(){
        // window.location.href="/#/login"
      },
      reloadCode() {
        this.codeImg = 'http://gw.youxinbao.com.cn/Public/GetValidateCode?' + new Date().getTime()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      judgepsd(){
        if(this.user_pwd!=this.user_pwds){
          this.titlefour="visible"
        }
        else{
          this.titlefour="hidden"
        }
      },
      beforeAvatarUpload(file) {//文件上传之前调用做一些拦截限制
        console.log(file);
        const isJPG = true;
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      beforeAvatarUploads(file){
        console.log(file);
        const isJPG = true;
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      handleExceed() {//图片上传超过数量限制
        this.$message({
          message: '只能上传一张图片',
          type: 'error'
        })
      },

      openregsiter() {
        // this.dialogaddVisible=true;
        this.$router.push({ path: '/login/register' })
      },
      nextregister() {
        this.dialogaddVisible = false;
        this.dialogaddVisibles = true;
      },
      handleLogin() {
        debugger
        // this.$router.push({ path: this.redirect || 'dashboard' })
        // this.$router.push({ path: '/' })
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsernameCode', this.loginForm).then((res) => {
              console.log(res)
              // this.loading = false
              // this.$router.push({ path: this.redirect || '/' })
              if (res.result === '0') {
                this.$router.push({ path: this.redirect || '/' })
                // this.$router.push({ path: '/' })
              } else {
                this.$message.error(res.message);
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
            this.$store.dispatch('LoginByUsernameCode', this.loginForm).then((res) => {
              debugger
              if (res.result === '0') {
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      &::first-line {}
    }
  }

  .block {
    width: 60%;
  }

  /* reset element-ui css */
  .login-container {
    .el-dialog__header {
      background: rgb(100, 144, 156);

      .el-dialog__title {
        color: white;
      }

      .el-dialog__close {
        color: white;
      }
    }

    .el-slider__runway {
      height: 40px;
    }

    .el-slider__runway {
      background: rgb(232, 232, 232);
      border: 1px solid #ccc;
    }

    .el-slider__bar {
      height: 40px;
    }

    .el-slider__bar {
      height: 40px;
      width: 40px;
    }

    .el-slider__button {
      height: 40px;
      width: 30px;
      border: 1px solid #ccc;
      border-radius: 0;
    }

    .el-slider__button-wrapper {
      top: 0px;
      right: 18px;
      /*left:18px!important;*/
    }

    .inputs {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      text-align: center;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 11px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }

  .login-container .el-form-item {
    /*background: white;*/
  }

  .foems {
    background: white;
  }

  .login-container .el-input input {
    /*height: 0px!important;*/
    color: black;
  }

  .demo1 {
    width: 48%;
    height: 100%;
    float: left;
    padding: 20px;
    border: 1px dashed #fff;
    border-radius: 4px;
    box-sizing: border-box;
    position: relative;
  }

  .btns,
  .slider,
  .result {
    margin-bottom: 40px;
  }

  #demo {
    border: 0px dashed #d5d4ff;
    border-radius: 10px;
    text-align: left;
    margin-bottom: 20px;
    position: relative;
    padding: 0;
    margin-top: 0;

    #slider {
      margin: 0 120px;
      border-radius: 0;
    }

    .demo-span {
      position: absolute;
      top: 10px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
      left: 75px;
    }
  }

  .dialog-footer {
    float: left;
    clear: both;
    width: 100%;
    display: flex;
    justify-content: center;
    /*text-align: right;*/
    /*padding-right: 40px;*/
  }

  .registers {
    width: 100%;
    margin: 100px auto;
    height: 100%;
    float: left;
    clear: both;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 999;

  }

  .totle {
    margin: 10px 0px;
    margin-top: 0;
    font-size: 30px;
    height: 158px;
    color: white;
    background: rgb(45,58,75);

    /*color: white;*/
  }

  .title {
    font-style: 0.6rem;
    /*display: none;*/
    color: red;
    margin-left: 10px;
  }

  .forms {
    float: left;
    clear: both;
    margin: 0 auto;

    .el-form-item__label {
      text-align: right;
    }

    .el-input--small {
      input {
        height: 40px;
        line-height: 40px;
      }
    }

    .el-input--medium {
      input {
        height: 40px;
        line-height: 40px;
      }
    }
  }

  .upload-demo {
    .el-upload-list {
      width: 350px;
    }
  }
  .finimg{
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .finish-title{
    text-align: center;
    margin-top: 20px;
    font-size: 25px;
    color: #3b91b6;
    font-family: "楷體";
  }
  .divs{
    box-shadow: 0px 1px 10px rgba(34, 25, 25, 0.2);
    padding: 50px;
    margin-bottom: 50px;
    /*margin: 0 auto;*/
    position: relative;
    z-index: 9999;
  }
  .register{
    height:auto;
    float: left;
    clear: both;
    width: 100%;
  }
  .steps{
    margin-top: 30px;
  }
</style>
