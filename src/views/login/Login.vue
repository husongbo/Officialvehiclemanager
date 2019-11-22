<template>
  <div class="login">
    <div class="login-form">
      <div class="login-header">
        <img src="../../assets/images/logo.png" width="100" height="100" alt="">
        <p>{{ $Config.siteName }}</p>
      </div>
      <el-input
          placeholder="请输入用户名"
          suffix-icon="fa fa-user"
          v-model="User.username"
          style="margin-bottom: 18px"
          @blur="BlurName"
      >
      </el-input>
      <div v-if="!UserYz[0].flag" style="margin-bottom: 10px;color: red;font-size: .9rem;">只能输入中文的用户名</div>
      <el-input
          placeholder="请输入密码"
          suffix-icon="fa fa-keyboard-o"
          v-model="User.userpassword"
          type="password"
          style="margin-bottom: 18px"
          @keyup.native.enter="login"
          @blur="BlurPsd"
      >
      </el-input>
      <div v-if="!UserYz[1].flag" style="margin-bottom: 10px;color: red;font-size: .9rem;">只能输入6-12位的可以包含字母或数字</div>
      <el-input
              placeholder="请输入验证码"
              v-model="User.usercode"
              type="text"
              style="margin-bottom: 18px"
              auto-complete="on"
              @keyup.native.enter="login"
      ></el-input>
      <span class="show-pwd" @click="reloadCode">
          <img :src="codeImg" alt="">
        </span>


      <el-button
              class=""btns
          type="primary" :loading="loginLoading"
          style="width: 100%;margin-bottom: 18px"
          @click.native="login"
      >登录
      </el-button>
      <div>
        <!--<el-checkbox v-model="Remenber"> 记录密码</el-checkbox>-->
        <div style="float: right;color: #3C8DBC;font-size: 14px;cursor: pointer;"  @click="register">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {setToken} from '../../utils/dataStorage'
  import md5 from 'md5'
  import '../../utils/util.js'
  import {login as loginApi} from '../../api/user'
  import util from "../../utils/util";
  import Menu from '@/menu/index';
  // import $ from  '/jquery.js'
  export default {
    data() {
      return {
        User:{
            username:'',
            userpassword:'',
            usercode:''
        },
          UserYz:[
              {
                  id:1,
                  YZM:/[a-zA-Z0-9\u4e00-\u9fa5]/g,
                  flag:true
              },
              {
                  id:2,
                  YZM:/^[A-Za-z0-9]{6,12}$/,
                  flag:true
              }
          ],
        Remenber: true,
          codeImg: 'http://gw.youxinbao.com.cn/Public/GetValidateCode',
        loginLoading: false,
          menu:Menu,
      }
    },
      created(){
        // console.log($)
        //   $.ajax('http://gw.youxinbao.com.cn/Public/GetValidateCode',{
        //       data:{},
        //       type:'post',//HTTP请求类型
        //       timeout:10000,//超时时间设置为10秒；
        //       success:function(response){
        //           console.log(response)
        //       },
        //       error:function(xhr,type,errorThrown){
        //           console.log(xhr)
        //       }
        //   });
      },
    methods: {
        reloadCode() {
            this.codeImg = 'http://gw.youxinbao.com.cn/Public/GetValidateCode?' + new Date().getTime()
        },
      login() {
        this.loginLoading = true;
        setTimeout(() => {
            if(this.User.username==''||this.User.userpassword==''){
                this.$message.error('登录信息不能为空');
                this.loginLoading = false
                return
            }
            if(!this.UserYz[0].flag||!this.UserYz[1].flag){
                this.$message.error('请正确输入登录信息');
                this.loginLoading = false
                return
            }
            var MdPsd=md5(this.User.userpassword)
            localStorage.setItem('Psd',MdPsd)
            var json={
                user_name:this.User.username,
                auth_password:this.User.userpassword
            }
            console.log(json)
            console.log("加密密码"+MdPsd)
            var AesJson=util.encrypt(JSON.stringify(json),MdPsd)
            console.log(AesJson)
            var datas={
                user_name:this.User.username,
                post_params:AesJson
            }
            console.log(datas)
            loginApi(datas).then(response=>{
                console.log(response)
                if(response.data.result==0){
                    localStorage.setItem('UserInfo',JSON.stringify(response.data.user_info))
                    localStorage.setItem('Role',response.data.user_info.role_id)
                    // 转成JSON格式
                    // console.log(localStorage.getItem('Role'))
                    setToken(response.data.user_info.user_id);
                    this.$notify({
                      title: '登录成功',
                      message: '欢迎进入公务用车平台',
                      type: 'success',
                      duration: 2000
                    });
                    this.loginLoading = false;
                    this.$router.push({path: '/'});
                }
                else{
                    this.$message.error("密码错误")
                    this.loginLoading = false;
                }
            }).catch(_=>{})
        }, 1000);
      },
        register(){
            setToken('201907160832183855');
            this.$router.push({path: '/register'});
        },
        BlurName(){
          console.log(this.UserYz[0].YZM.test(this.User.username))
          if(!this.UserYz[0].YZM.test(this.User.username)){
              this.UserYz[0].flag=false
              console.log("不正确")
          }
          else{
              this.UserYz[0].flag=true
          }
        },
        BlurPsd(){
            console.log(this.UserYz[1].YZM.test(this.User.userpassword))
            if(!this.UserYz[1].YZM.test(this.User.userpassword)){
                this.UserYz[1].flag=false
                console.log("不正确")
            }
            else{
                this.UserYz[1].flag=true
            }
        }
    }
  }
</script>

<style lang="scss">
  @import "Login.scss";
  .show-pwd{
    position: absolute;
    right: 40px;
    bottom:130px;
  }
  .el-input--suffix{
    margin-bottom: 10px!important;
  }
  .login-form{
    box-shadow:0 0 1rem rgb(68, 200, 255)
  }
</style>
