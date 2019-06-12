<template>
  <div class="register_page">
    <h1 class="main_title">个人资料</h1>
    <div class="info_box">
      <div> <span>用户名</span><input type="text" v-model="currentUser.userName"> </div>
      <div> <span>密码</span><input type="password" v-model="currentUser.userPwd"></div>
       <!-- <div> <span>再次输入密码</span><input type="password" v-model="userPwdSecond"></div> -->
      <div><span>联系电话</span><input type="text" v-model="currentUser.telephone"></div>
      <div> <span>邮箱</span><input type="text" v-model="currentUser.mailbox"></div>
      <div> <span>地址</span><input type="text" v-model="currentUser.address"></div>
        <div> <input type="file" name="" id="file" accept="image/gif,image/jpeg,image/png,image/jpg" class="inputfile" @change="onChangeImg($event)"><label for="file" class="upload fl clearfix">上传头像</label></div>
        <div class="img_box">
            <img :src="img" alt="" class="img">
        </div>
        
    </div>
 <div> <button class="sureRegister" @click="sureEdit">确认修改</button></div>
  </div>
</template>

<script>
import "../assets/css/common.css";
export default {
    data () {
        return {
            currentUser:{
                _id:'',
                userName:'',
                userPwd:'',
                telephone:'',
                mailbox:'',
                address:'',
                headPortrait:'',
            },
            img:''
        }
    },
    created(){
        this.currentUser=this.userInfo
        this.img='../../static/headPortrait/'+this.userInfo.headPortrait
    },
    computed: {
      userInfo(){
          return this.$store.state.userInfo
      } ,
    //   img(){
    //       return '../../static/headPortrait/'+this.$store.state.userInfo.headPortrait
    //   }
    },
    methods: {
        /** 上传图片 */
        onChangeImg(event){
            let reader=new FileReader(),
                img1=event.target.files[0]
            let url=''
            let form=new FormData()
            form.append('file',img1)
            this.$http.post('/user/file_upload',form,{
                headers:{'Content-Type':'multipart/form-data'}
            }).then(response=>{
                if(response.data.status=='0'){
                    this.img='../../static/headPortrait/'+response.data.result.imageName
                    this.currentUser.headPortrait=response.data.result.imageName
                    this.$store.commit('setUserInfo',this.currentUser)
                    return
                }
            })
        },
        sureEdit(){
            
          if(this.currentUser.userName!=''||this.currentUser.userPwd!=''||this.currentUser.telephone!=''||this.currentUser.mailbox!=''||this.currentUser.address!=''){
            // if(this.newUser.userPwd==this.userPwdSecond){
              this.$http.post('/user/edit_person',this.currentUser).then((result)=>{
                let res=result.data
                if(res.status=='0'){
                  this.$Message.success(res.msg)
                  this.$router.push('/home')
                  // alert('注册成功')
                }
              })

          }else{
            this.$Message.error('*号为必填项！')
          }
        }
    }

}
</script>

<style lang="less">
.register_page {
    position: absolute;
  height: 100%;
  background-color: #4d4d4b;
  width: 100%;
  padding: 40px 300px;
  h1.main_title {
    color: #fff;
    font-weight: 600;
  }
  h1::before {
    content: "|";
    color: #fdca4a;
  }
  .info_box {
    margin-top: 40px;
    font-size: 14px;
    span {
      color: #fff;
      display: inline-block;
      width: 100px;
    }
    span::before {
      content: "* ";
      color: #fdca4a;
    }
    input {
      width: 200px;
      height: 30px;
      margin-right: 10px;
    }
    div {
      margin-top: 30px;
    }
    label{
        color: #fff;
        font-weight: 400;
    }
     .inputfile {
      z-index: -11111;
      width: 0px;
      height: 1px;
      outline: none;
    }
    .upload {
      background: #fdca4a;
      color: #4d4d4b;
      width: 70px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-weight: 700;
    }
     .img_box {
      width: 60px;
      height: 60px;
      position: relative;
      left: 100px;
      top: -30px;
    }
    .img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      border-radius: 3px;
      box-shadow: 1px 1px 1px 1px #e2e2e2;
    }
  }
   .sureRegister{
        background:black;
        color: #fff;
        border: 2px solid #fdca4a;
        width: 90px;
        height: 35px;  
        font-size: 13px;
        letter-spacing: 1px;
        line-height: 1;
        font-weight: 700; 
        transition: 1s all ease;
        
    }
    .sureRegister:hover{
        color: #fdca4a
    }
 
}
</style>
