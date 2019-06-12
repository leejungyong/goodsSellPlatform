<template>
  <div id="adminLogin">
    <div class="login">
      <div class="logo"></div>
      <div class="login_form">
        <div class="user">
          <input
            class="fl clear text_value"
            type="text"
            placeholder="管理员"
            v-model="userName"
          >
          <input
            class="text_value"
            type="password"
            placeholder="密码"
            style="margin-left:37px;"
            v-model="userPwd"
          >
        </div>
        <button
          class="button"
          id="submit"
          type="submit"
          @click="login"
        >登录</button>
      </div>

      <div id="tip"></div>
      <div class="foot">
        <span v-show="tipError">用户名或密码错误 </span>
        Copyright © 2011-2015 All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      userName: '',
      userPwd: '',
      tipError: false
    }
  },
  computed: {
    nickName() {
      return this.$store.state.nickName
    }
  },
  mounted() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      this.$http.get("/admin/checkLogin").then(response => {
        let res = response.data
        if (res.status == '0') {
          // this.nickName = res.result.userName
          this.$store.commit('updateUserInfo', res.result.userName)
        }
      })
    },
    login() {
      axios.post('/admin/login', {
        userName: this.userName,
        userPwd: this.userPwd
      }).then((response => {
        let res = response.data
        if (res.status == '0') {
          this.tipError = false
          alert('登录成功')
          this.$router.push({ name: 'Admin', params: { userName: res.result.userName } })
        } else {
          this.tipError = true
        }
      }))
    }
  }

}
</script>
<style lang="less" >
@import "../../assets/css/common.css";
#adminLogin {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../../assets/images/login_bg.jpg");
  text-align: center;
  .login {
    width: 640px;
    height: 400px;
    position: relative;
    left: 25%;
    top: 20%;
  }
  .logo {
    background: url("../../assets/images/admin_logo.png") no-repeat 30px center;
    height: 150px;
  }
  .login_form {
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    width: 600px;
  }
  .user {
    background: url("../../assets/images/login_name_bg.jpg");
    width: 540px;
    height: 80px;
  }
  .text_value {
    margin-left: 17px;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 15px;
    width: 225px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #666;
    font-weight: bold;
    border: none;
    background-color: #f5f6f7;
  }
  .button {
    background: url("../../assets/images/login_button.jpg") no-repeat;
    height: 54px;
    text-indent: 100px;
    border: none;
    position: relative;
    left: 315px;
    top: -67px;
  }
}
</style>

