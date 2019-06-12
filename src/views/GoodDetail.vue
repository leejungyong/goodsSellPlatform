<template>
  <div id="good_detail_box">
    <div class="top_box">
        <span>
        <span style="width:40px;height:40px;display:inline-block;" v-if="flag">
          <img class="img" :src="headPort" style="border-radius:50%;">
        </span>
        <span style="display: inline-block;margin-left: 10px;width: 600px;border-right: 1px solid;line-height: 35px;height:35px;">{{userName}}</span>
        </span>
      <span style="display: inline-block;font-size: 15px;margin-left:60px;cursor:pointer;" @click="toRelease">发布闲置</span>
      <span style="display: inline-block;font-size: 15px;margin-left:40px;cursor:pointer;" @click="mySolding">我的闲置</span>
    </div>
    <div class="middle">
      <div class="seller_info">
        <span>
        <span style="width:30px;height:30px;display:inline-block;" >
          <img class="img" :src='detail.user_id.headPortrait' style="border-radius:50%;">
        </span>
        <span style="display: inline-block;margin-left: 10px;width: 520px;">{{detail.user_id.userName}}</span>
        </span>
      </div>
      <div class="img_box">
        <div style="width:370px;height:500px;margin:0 auto;">
          <img class="img" :src='detail.p_img' alt>
        </div>
      </div>
      <div class="detail fr clearfix">
        <div class="title">{{detail.p_title}}</div>
        <div class="price">
          转 卖 价：
          <span style="color:red;font-size:24px;font-weight:bold;">¥{{detail.p_price}}</span>
        </div>
        <div class="address">地 址： {{detail.user_id.address}}</div>
        <div class="telephone">联系方式: {{detail.user_id.telephone}}</div>
        <!-- <div>交易方式：在线交易</div> -->
        <Button class="buy_bt" type="warning" size="large" style="width:170px;" @click="buyGood">立即购买</Button>
      </div>
      <div class="info_box">
        <div class="tab_de">宝贝详情</div>
        <div class="info">
            <span style="font-size:16px;font-weight:bold;color:#4d4d4b;display: inline-block;margin: 20px;" >宝贝介绍</span>
            <div style="margin-top:10px;">{{detail.p_information}}</div>
        </div>
      </div>
    </div>
        <Modal
        v-model="modal"
        title="购买详情"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>物品名称：{{detail.p_title}}</p>
        <p>成交价格：{{detail.p_price}}RMB</p>
        <p>运送至：{{userInfo.address}}</p>
        <p>卖家地址：{{detail.user_id.address}}</p>
        <p>卖家联系方式：{{detail.user_id.telephone}}</p>
    </Modal>
  </div>
</template>

<script>

import Cookie from 'js-cookie'
export default {
  data() {
    return {
      detail: { 
        // headPortrait:''
      },
      id:'',
      modal:false,
      newRecord:{
        p_id:'',
        p_title:'',
        p_img:'',
        p_price:null,
        s_id:'',
        s_telephone:'',
        s_address:'',
        b_id:'',
        b_telephone:'',
        b_address:'',
        datet:'',
        category:''
      },
      flag:true
    };
  },
  created() {
    this.id=this.$route.params._id
    if(Cookie.get('user_name')==undefined){
      this.flag=false
    }else{
      this.flag=true
    }
    this.fetch()
    // this.detail = this.$route.params.item;
  },
  computed: {
    headPort(){
      return '../../static/headPortrait/'+this.$store.state.userInfo.headPortrait
    },
    userName(){
      return this.$store.state.userInfo.userName
    },
    userInfo(){
      return this.$store.state.userInfo
    }
  },
  methods: {
    buyGood() {
      if(Cookie.get('user_name')!=undefined){
         this.modal=true
      }else{
        this.$Message.error('请先登录！')
        this.$router.push('/home')
      }
    
    },
    fetch(){
        this.$http.post('/user/selectById',{_id:this.id}).then(res=>{
            let data=res.data.result
            
            if(res.data.status=='0'){
                    this.detail=data.list[0]
            this.detail.user_id.headPortrait='../../static/headPortrait/'+this.detail.user_id.headPortrait
            this.detail.p_img='../../static/goodspics/'+this.detail.p_img
            }
            console.log(this.detail)
        })
    },
    ok(){
      this.newRecord={
        p_id:this.detail._id,
        p_title:this.detail.p_title,
        p_img:this.detail.p_img,
        p_price:this.detail.p_price,
        s_id:this.detail.user_id._id,
        s_telephone:this.detail.user_id.telephone,
        s_address:this.detail.user_id.address,
        b_id:this.userInfo._id,
        b_telephone:this.userInfo.telephone,
        b_address:this.userInfo.address,
        category:this.detail.category,
        date:new Date()
      }
      this.$http.post('/user/new_record',this.newRecord).then(response=>{
        console.log(response.data)
        let res=response.data
        if(res.status=='0'){
          this.$http.post('/user/aleadybuy',{_id:this.newRecord.p_id}).then(response2=>{
            
          })
          this.$Message.success(res.msg)
        }else{
          this.$Message.error('操作失败！')
        }
      })
    },
    cancel(){

    },

    toRelease(){
      this.$router.push('/goodupload')
    },
    mySolding(){
      this.$router.push('/solding')
    }
  }
};
</script>

<style lang="less">
@import '../assets/css/common.css';
#good_detail_box {
  .top_box {
    height: 90px;
    background-color: rgba(51, 51, 51, 0.9);
    color: white;
    padding:0 100px ;
    line-height: 90px;
  }
  .middle {
    width: 85%;
    margin: 20px auto;
    // background: #4d4d4b;
  }
  .seller_info {
    height: 50px;
    // background: #fdca4a;
    border-top: 3px solid;
    border-bottom: 1px solid;
    line-height: 43px;
  }
  .img_box {
    width: 700px;
    height: 500px;
    background: #ededed;
    margin-top: 20px;
    display: inline-block;
  }
  .img {
    max-width: 100%;
    max-height: 100%;
  }
  .detail {
    // width: 450px;
    margin-top: 20px;
    margin-right: 100px;
    color: black;
    font-size: 15px;
  }
  .title {
    font-size: 22px;
    font-weight: bold;
  }
  .price {
    margin: 10px 0px;
  }
  .address {
    border-top: 1px solid #eee;
    line-height: 40px;
  }
  .telephone {
    //   line-height: 40px;
  }
  .buy_bt {
    margin: 30px 0;
  }
  .info_box {
      margin-top: 20px;
  }
  .tab_de {
    width: 120px;
    height: 40px;
    background-color: rgba(51, 51, 51, 0.9);
    color: white;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 40px;
  }
  .info{
      border-top:5px solid #4d4d4b;
      padding: 20px;
  }
}
</style>
