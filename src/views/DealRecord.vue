<template>
    <div id="solding">
        <div class="title">已出售记录</div>
            <div style="background:#4d4d4b;padding:10px 0px;margin-top:20px;">
      <div class="item_list">
        <div
          class="item"
          v-for="(item,index) in goodList"
          :key="index"
        >
          <div style="width:200px;height:200px;">
            <img style="max-width: 100%; max-height: 100%;border-radius:5px;" :src="item.p_img" alt>
          </div>
          <div class="p_title">{{item.p_title}}</div>
            <!-- <div
                class="fl clearfix"
                style="color:red;margin-left: 20px; font-size: 15px;"
            >￥{{item.p_price}}</div> -->
          <!-- <div class="s_name">
              {{item.user_id.userName}}
              </div> -->
          
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
import '../assets/css/common.css'
export default {
    data () {
        return {
            goodList:[

            ],
            pageParams:{
                total:0,
                page:1,
                pageSize:10
            }
        }
    },
    created () {
        this.fetch()
    },
      computed: {
    user_id() {
      return this.$store.state.userInfo._id;
    }
  },
    methods: {
          fetch() {
      this.$http
        .post("/user/query_sold", { user_id: this.user_id, state: 1 ,params:this.pageParams})
        .then(res => {
          console.log(res.data);
          this.pageParams.total=res.data.result.count
          let data = res.data.result;
          data.list.forEach(item => {
            item.p_img = "../../static/goodspics/" + item.p_img;
          });
          this.goodList = data.list;
        });
    },
    pageChange(page) {
      this.pageParams.page = page;
      this.fetch()
    },
    }
}
</script>

<style lang="less">
#solding{
     background: #4d4d4b;
  color: #fff;
  padding: 50px 0px;
  position: absolute;
  height: 100%;
  width: 100%;
  .title {
    color: #fff;
    font-weight: 600;
    font-size: 20px;
    padding: 0 70px;
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
    height: 250px;
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
    margin: 30px auto 0px auto;
   text-align: left
  }
  .page_box {
    text-align: center;
    margin-top: 30px;
  }
}
</style>

