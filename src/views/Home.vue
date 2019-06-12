<template>
  <div id="home">
    <div class="home_top">
      <!-- <div class="navbar"></div> -->
      <span class="big_title">闲置物品网络交易平台</span>
      <Login class="fr clearfix"/>
    </div>
    <div class="release_goods">
      <div class="release_text1 fl clearfix">
        <Input suffix="ios-search" placeholder="请输入关键词" style="width: auto" v-model="keyWords"/>
        <span style=" cursor: pointer;display: inline-block;margin-left: 15px;" @click="search()">搜索</span>
      </div>
      <div class="release_text fl" style="border-left: 1px solid #fff;cursor: pointer;" @click="toUpload">
        <Icon type="md-add"/>发布闲置
      </div>
    </div>
    <div class="navigition">
      <ul class="clearfix">
        <li
          class="fl"
          v-for="(item,index) in categoryList"
          :key="index"
          @click="chooseCategory(item._id)"
        >{{item.category_name}}</li>
      </ul>
    </div>
    <div style="background:#4d4d4b;padding:10px 0px;margin-top:20px;">
      <div class="item_list">
        <div
          class="item"
          v-for="(item,index) in goodList"
          :key="index"
          @click="toGoodDetail(item._id)"
        >
          <div style="width:200px;height:200px;">
            <img style="max-width: 100%; max-height: 100%;border-radius:5px;" :src="item.p_img" alt>
          </div>
          <div class="p_title">{{item.p_title}}</div>
          <div
            class="fl clearfix"
            style="color:red;margin-left: 20px; font-size: 15px;"
          >￥{{item.p_price}}</div>
          <div class="s_name">{{item.user_id.userName}}</div>
        </div>
      </div>
      <div class="page_box">
        <Page
          :total="pageParams.total"
          :current="pageParams.page"
          :page-size="pageParams.pageSize"
          @on-change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Login from "../components/Login";
import "../assets/css/common.css";
import Cookie from 'js-cookie'
export default {
  components: {
    Login
  },
  data() {
    return {
      categoryList: [],
      goodList: [],
      pageParams: {
        //分页的属性
        page: 1,
        pageSize: 10,
        total: 0
      },
      id: "5c84d614183517434c51fe62", //分类的id初始化为‘最新’
      userid: "",
      // username: "zp4657553",
      // userhead: "",
      keyWords:''
    };
  },
  created() {
    this.fetchCategory();
    this.userid=Cookie.get('user_id')
    this.fetch(this.id);
  },
  computed: {
    isLogin(){
      return this.$store.state.isLogin
    }
  },
  watch: {
    isLogin(){
      this.fetch(this.id)
    }
  },
  methods: {
    //获取所有分类
    fetchCategory() {
      this.$http.post("/user/getAllCategory", {}).then(res => {
        let data = res.data.result;
        this.categoryList = data.list;
      });
    },
    //获取商品列表
    fetch(id) {
      if (id != this.id) {
        this.goodList = [];
        this.pageParams.page = 1;
        this.$http
          .post("/user/selectByCategory", { _id: id, userid:this.userid, params: this.pageParams })
          .then(res => {
            console.log(res.data);
            // this.pageParams.total=res.data.result.count
            let data = res.data.result;
            let arr = data.list.map((item, index) => {
              item.p_img = "../../static/goodspics/" + item.p_img;
              return item;
            });
            this.goodList = arr;
          });
      } else {
        this.goodList = [];
        this.$http
          .post("/user/getAllGoodList", { userid:this.userid, params: this.pageParams })
          .then(res => {
            this.pageParams.total = res.data.result.count;
            let data = res.data.result;
            let arr = data.list.map((item, index) => {
              item.p_img = "../../static/goodspics/" + item.p_img;
              return item;
            });
            this.goodList = arr;
          });
      }
    },

    //分页
    pageChange(page) {
      this.pageParams.page = page;
      this.fetch(this.id);
    },

    //点击分类
    chooseCategory(id) {
      this.fetch(id);
    },

    //跳转至商品详情页
    toGoodDetail(_id) {
      this.$router.push({ name: "gooddetail", params: { _id } });
    },
    //跳转至发布闲置页面
    toUpload(){
      // let n= Cookie.get('userName')
      // console.log(n)o
      if(Cookie.get('user_name')!=undefined){
        this.$router.push({name:"GoodUpload"})
      }else{
        this.$Message.error('请先登录！')
      }

    },
    /**关键词搜索 */
    search(){
      console.log(this.keyWords)
      this.pageParams.page=1
      this.$http.post('/user/search',{str:this.keyWords,params:this.pageParams}).then(response=>{
        console.log(response.data)
        let res=response.data
        this.pageParams.total = res.result.count;
        if(res.status=='0'){
            
            let arr = res.result.list.map((item, index) => {
              item.p_img = "../../static/goodspics/" + item.p_img;
              return item;
            });
            this.goodList = arr;
        }
      })
    }
  }
};
</script>

<style lang="less">
#home {
  .big_title{
        display: inline-block;
    margin: 80px 130px;
    color: #fdca4a;
    // color: #f2f2f2;
    font-size: 50px;
    font-weight: 900;
  }
  .login_already {
    background: white;
    width: 340px;
    height: 210px;
    // padding: 30px 25px;
    padding: 30px 25px 0px 50px;
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
  .home_top {
    height: 350px;
    width: 100%;
    margin-bottom: 30px;
    // background-image: url("../assets/images/banner.jpg");
    background: #4d4d4b;
    padding-top: 40px;
  }
  .release_goods {
    height: 100px;
    width: 80%;
    margin: 0 auto;
    // background: white;
    background: #fdca4a;
    line-height: 100px;
    border-radius: 3px;
    font-family: PingFangSC-Semibold;
  }

  .release_text,
  .release_text1 {
    font-size: 18px;
    font-family: PingFangSC-Semibold;
    font-weight: 700;
    color: #222;
    width: 50%;
    text-align: center;
    // margin-right: 80px;
  }
  .navigition {
    width: 80%;
    height: 60px;
    line-height: 60px;
    margin: 0 auto;
    background: #4d4d4b;
    color: white;
    margin-top: 15px;
    border-radius: 3px;
  }
  .navigition ul li {
    font-size: 16px;
    margin-left: 65px;
    width: 10%;
    cursor: pointer;
  }
  .item_list {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    color: black;
  }
  .item {
    width: 200px;
    height: 320px;
    margin: 7px;
    background: white;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  .p_title {
    width: 160px;
    height: 40px;
    margin: 10px auto 0px auto;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
  }
  .s_name {
    width: 160px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-top: 1px solid #f2f2f2;
    // margin-top: 10px;
    margin: 30px auto 0px auto;
    text-align: left;
  }
  .page_box {
    text-align: center;
    margin-top: 30px;
  }
}
</style>
