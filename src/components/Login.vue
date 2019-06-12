<template>
<div id="l_box" >
 <div v-if="!login_flag" id="login_box">

      <h2>Login to your account</h2>
      <input type="text" placeholder="用户名" v-model="userName">
      <br>
      <br>
      <input type="password" id placeholder="密码" v-model="userPwd">
      <br>
      <br>

      <button @click="login" class="loginbt">登录</button>
      <br>
      <br>
      <span class="register" @click="toRegister">还未注册？去注册</span>
      <span class="goadminlogin" @click="toadminlogin">管理员登录</span>
      <!-- <button @click="register">注册</button> -->
      <span v-show="tipError">用户名或密码错误</span>
   
  </div>
    <div v-else class="login_already fr clearfix">
      <span class="img_holder" >
        <img
          :src='headPic'
          alt
          style="max-width:100%;max-height:100%;border-radius:50%;"
        >
      </span>
      <span class="use_name">{{userinfo.userName}}</span>
      <span class="logout" @click="logOut">注销</span>
      <div style="margin-top:30px;">
        <div class="fl" style="width:25%; cursor: pointer;" @click="toSolding">
          <Icon type="ios-card" size="35" color="black"/>
          <div style="margin-top:5px;">出售中</div>
        </div>
        <div class="fl" style="width:25%;    cursor: pointer;" @click="soldOut">
          <Icon type="md-checkbox-outline" size="35" color="black"/>
          <div style="margin-top:5px;" >已售出</div>
        </div>
        <div class="fl" style="width:25%;    cursor: pointer;" @click="myOrder">
          <Icon type="ios-basket-outline" size="35" color="black"/>
          <div style="margin-top:5px;" >我的订单</div>
        </div>
        <div class="fl" style="width:25%;    cursor: pointer;" @click="editPersonal">
          <Icon type="ios-create-outline" size="35" color="black"/>
          <div style="margin-top:5px;">个人资料</div>
        </div>
      </div>
    </div>

</div>
 
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
export default {
  data() {
    return {
      userName: "",
      userPwd: "",
      tipError: false,
    };
  },
  computed: {
    login_flag(){
      return this.$store.state.isLogin
    },
    userinfo(){
      return this.$store.state.userInfo
    },
    headPic(){
      return '../../static/headPortrait/'+ this.$store.state.userInfo.headPortrait
    }
    
  },
  mounted() {},
  methods: {
    login() {
      axios
        .post("/user/login", {
          userName: this.userName,
          userPwd: this.userPwd
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.tipError = false;
            this.$Message.success("登陆成功！");
            this.$store.commit('setIsLogin',true)
            this.$store.commit('setUserInfo',res.result.userinfo)
            Cookie.set("user_id", res.result.userinfo._id);
            Cookie.set("user_name", res.result.userinfo.userName);
            Cookie.set("headPortrait", res.result.userinfo.headPortrait);
          } else {
            this.tipError = true;
          }
        });
    },

    /** 跳转到管理员登录界面 */
    toadminlogin() {
      this.$router.push("/adminlogin");
    },
    /** 跳转到注册界面 */
    toRegister() {
      this.$router.push("/register");
    },
    /**跳转到出售中页面 */
    toSolding(){
      this.$router.push('/solding')
    },
    /**跳转到已出售页面 */
    soldOut(){
      this.$router.push('/dealrecord')
    },
    /**跳转到购买记录 */
    myOrder(){
      this.$router.push('/buyrecord')
    },
    /**跳转到个人资料页面 */
    editPersonal(){
      this.$router.push('/editpersonal')
    },

    /**退出登录 */
    logOut(){
      this.$store.commit('setIsLogin',false)
      Cookie.remove('user_name')
      Cookie.remove('user_id')
      Cookie.remove('headPortrait')
    }
  }
};
</script>

<style lang='less'>
#l_box{
#login_box {
  background: white;
  width: 340px;
  height: 270px;
  padding: 38px 45px 38px 48px;
  margin-right: 80px;
  border-radius: 4px;
}
.img_holder{
  width:60px;
  height:60px;
  display:inline-block;
}

 input {
    outline: none;
    width: 240px;
    height: 35px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    padding: 10px 15px;
  }
  h2 {
    margin: 0 0 20px;
    // color: #558979;
    color: #fdca4a;
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
  }
  .loginbt {
    width: 240px;
    height: 35px;
    // background: #558979;
    background: #fdca4a;
    border: 0;
    color: black;
  }
  .loginbt:hover {
    background: black;
    color: white;
  }
  .register {
    color: #fca402;
  }
  .register:hover {
    color: #fdca4a;
    cursor: pointer;
  }
  .goadminlogin {
    float: right;
    cursor: pointer;
    color: black;
  }
  .goadminlogin:hover {
    color: #fdca4a;
  }
    .login_already {
    background: white;
    width: 340px;
    height: 210px;
    // padding: 30px 25px;
    padding:30px 25px 0px 50px;
    margin-right: 80px;
    border-radius: 4px;

  }
  .use_name {
    display: inline-block;
    font-size: 18px;
    height: 25px;
    line-height: 25px;
    font-family: PingFangSC-Semibold;
    font-weight: 700;
    margin-left: 20px;
    color: black;
  }
  .logout{
    display: inline-block;
    margin-left: 80px;
  }
  .logout:hover{
    color: #fdca4a;
    cursor: pointer;
  }
}

</style>
