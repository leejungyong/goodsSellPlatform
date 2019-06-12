<template>
  <div id="record">
    <div id="pie1">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main1" style="float:left;width:100%;height: 300px"></div>
    </div>
    <div class="title">交易记录列表</div>
    <Button
      type="primary"
      shape="circle"
      size="large"
      style="margin-left:10px"
      @click.native="openModal"
    >
      <Icon type="md-trash"/>批量删除
    </Button>

    <div class="table_box">
      <Table :columns="columns" :data="data" border></Table>
    </div>
    <br>
    <div class="page_box">
      <Page
        :total="pageParams.total"
        :current="pageParams.page"
        :page-size="pageParams.pageSize"
        @on-change="pageChange"
        show-total
      />
    </div>
  </div>
</template>

<script>
var echarts = require("echarts");
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "编号",
          key: "index"
        },
        {
          title: "订单编号",
          key: "_id",
          width: 90
        },
        {
          title: "物品编号",
          key: "p_id",
          width: 90
        },
        {
          title: "物品标题",
          key: "p_title"
        },
        // {
        //   title: '图片',
        //   key: 'p_img'
        // },
        {
          title: "物品价格",
          key: "p_price"
        },
        {
          title: "卖家编号",
          key: "s_id",
          width: 90
        },
        {
          title: "卖家电话",
          key: "s_telephone"
        },
        {
          title: "卖家地址",
          key: "s_address"
        },
        {
          title: "买家编号",
          key: "b_id",
          width: 90
        },
        {
          title: "买家电话",
          key: "b_telephone"
        },
        {
          title: "买家地址",
          key: "b_address"
        },
        {
          title: "成交时间",
          key: "date"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [],
      getList: [], //存所有的列表数据
      loading: false,
      pageParams: {
        //分页的属性
        page: 1,
        pageSize: 4,
        total: 0
      }
    };
  },
  created() {

    this.fetch();
  },
  mounted () {
    this.getChart()
  },
  methods: {
    /**获取分类列表 */
    fetch(flag) {
      this.$http
        .get("/admin/recordList", { params: this.pageParams })
        .then(response => {
          let res = response.data;
          console.log(res);
          this.pageParams.total = res.result.count;
          if (res.status == "0") {
            for (let i in res.result.list) {
              res.result.list[i].index =
                (this.pageParams.page - 1) * this.pageParams.pageSize +
                parseInt(i) +
                1;
            }
            if (flag) {
              this.getList = this.data.concat(res.result.list);
              this.data = res.result.list;
            } else {
              this.data = res.result.list;
            }
          } else {
            this.$Message.info("获取列表失败！");
          }
        });
    },

    getChart() {
     
      var myChart = echarts.init(document.getElementById('main1'));
       myChart.setOption({
        title: {
          text: "各分类成交金额占比",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          data: ["服装", "学习", "运动", "美妆", "数码"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "服装" },
              { value: 310, name: "学习" },
              { value: 234, name: "运动" },
              { value: 135, name: "美妆" },
              { value: 1548, name: "数码" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    /**删除某一条记录 */
    remove(index) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>确认删除该j交易记录吗？</p>",
        onOk: () => {
          // console.log('JJJJJ')
          this.$http
            .post("/admin/delete_record", { _id: this.data[index]._id })
            .then(response => {
              if (response.data.status == "0") {
                this.$Message.success(response.data.msg);
                this.data.splice(index, 1);
                this.fetch();
              } else {
                this.$Message.error(response.data.msg);
              }
            });
        }
      });
    },
    pageChange(page) {
      this.pageParams.page = page;
      this.fetch(true);
    }
  }
};
</script>

<style lang="less">
#record {
  padding-top: 40px;
  .title {
    font-size: 24px;
    color: black;
    margin-bottom: 10px;
  }
  .table_box {
    margin-top: 30px;
  }
  .ivu-modal-body {
    padding: 40px 70px !important;
  }
  .page_box {
    text-align: center;
  }
}
.text {
  display: inline-block;
  width: 80px;
}
</style>
