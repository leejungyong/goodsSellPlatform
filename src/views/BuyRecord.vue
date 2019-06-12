<template>
  <div id="solding">
    <div class="title">我的购买记录</div>
    <div style="background:#4d4d4b;padding:10px 0px;margin-top:20px;">
      <div class="item_list">
        <div class="item" v-for="(item,index) in goodList" :key="index">
          <div class="item_top">
            <span style="display: inline-block;width:180px;">成交日期： {{item.date}}</span>
            <span>订单号：{{item._id}}</span>
          </div>
          <div style="padding:0 20px;">
            <div style="width:120px;height:120px;" class="fl clearfix">
              <img style="max-width: 100%; max-height: 100%;border-radius:5px;" :src="item.p_img">
            </div>
            <div>
              <span class="good_title">{{item.p_title}}</span>
              <span style="display: inline-block;width:100px;text-align: center;">¥{{item.p_price}}</span>
              <span
                style="display: inline-block;width:180px;text-align: center;"
              >{{item.s_telephone}}</span>
              <span style="display: inline-block;width:180px;text-align: center;">{{item.s_address}}</span>
            </div>
          </div>
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
import "../assets/css/common.css";
export default {
  data() {
    return {
      goodList: [],
      pageParams: {
        total: 5,
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  methods: {
    fetch() {
      this.$http
        .post("/user/buy_record", {
          b_id: this.userInfo._id,
          params: this.pageParams
        }).then(response => {
          console.log(response.data);
          let res = response.data;
          if (res.status == "0") {
            res.result.list.forEach(item => {
              let index = item.date.indexOf("T");
              item.date = item.date.slice(0, index);
            });
            this.goodList = res.result.list;
          }
        });
    },
        pageChange(page) {
      this.pageParams.page = page;
      this.fetch()
    },
  }
};
</script>

<style lang="less">
#solding {
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
  .item {
    border: 1px solid;
    width: 80%;
    margin: 20px auto;
    padding-bottom: 30px;
  }

  .item_top {
    height: 30px;
    background: #fdca4a;
    margin-bottom: 10px;
    line-height: 30px;
    padding: 0 20px;
  }
  .good_title {
    width: 200px;
    height: 100px;
    line-height: 100px;
    display: inline-block;
  }

  .page_box {
    text-align: center;
    margin-top: 30px;
  }
}
</style>

