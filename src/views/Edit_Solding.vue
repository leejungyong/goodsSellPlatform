<template>
  <div id="release_good">
    <div class="title">修改物品信息</div>
    <div class="input_box">
      <div class="text">
        <i>*</i> 标题：
        <input type="text" v-model="newGood.p_title">
      </div>
      <div class="text">
        <i>*</i> 详细描述：
        <input type="text" v-model="newGood.p_information">
      </div>
      <div class="text">
        <i>*</i> 类别：
        <Select style="width:200px" v-model="newGood.category" class="fr clearfix">
          <Option
            v-for="item in categoryList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
      <div class="text">
        <i>*</i> 商品定价：
        <input type="text" v-model="newGood.p_price">
      </div>
      <div class="text">
        <i>*</i> 商品数量：
        <input type="text" v-model="newGood.p_num">
      </div>
      <div>
        <div style="margin: 0 45px;">
          <input
            type="file"
            name
            id="file"
            accept="image/gif, image/jpeg, image/png, image/jpg"
            class="inputfile"
            @change="onChangeImg($event)"
          >
          <label for="file" class="upload">上传图片</label>
        </div>
        <div class="img_box">
          <img :src="img" alt class="img">
        </div>
      </div>

      <div>
        <button class="sure_bt" @click="submit">确认提交</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newGood: {
        _id:'',
        p_name: "",
        p_title: "",
        p_information: "",
        p_price: "",
        p_num: "",
        p_img: "",
        datetime: "",
        category: "",
        user_id: "",
        state:0
      },
      categoryList: [], //所有的分类选项
      img: "",
      goodId:''
    };
  },
  created() {
        this.newGood=this.$route.params.item
        this.img='../../static/goodspics/'+ this.newGood.p_img
        console.log(this.$route.params.item)
        this.getCategoryList();
  },
    computed: {
    user_id() {
      return this.$store.state.userInfo._id
    }
  },
  methods: {
    /** 上传商品图片 */
    onChangeImg(event) {
      let reader = new FileReader(),
        img1 = event.target.files[0];
      let url = "";
      let form = new FormData();
      form.append("file", img1);
      this.$http
        .post("/user/file_upload_goods", form, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.status == "0") {
            this.img =
              "../../static/goodspics/" + response.data.result.imageName;
            this.newGood.p_img = response.data.result.imageName;
            return;
          }
        });
    },
    /**修改商品 */
    submit() {
      let date = new Date();
      this.newGood.datetime = date;
    // let img=this.newGood.p_img
    // let index=img.indexOf('g')
    // this.newGood.p_img=img.substring(index+10)
    // console.log(this.newGood.p_img)
      if(this.newGood.p_title!=''||this.newGood.p_information!=''||this.newGood.p_price!=''||this.newGood.p_price!=''||this.newGood.num!=''||this.newGood.p_img!=''){
        this.$http.post("/user/edit_good", this.newGood).then(response => {
            let res = response.data;
            if (res.status == "0") {
            this.$Message.success(res.msg);
            this.$router.push('/solding')
            } else {
            this.$Message.error("上传失败！");
            }
        });
      }else{
          this.$Message.error('*号为必填项！')
      }

    },
    getCategoryList() {
      this.$http.get("/admin/categoryList").then(result => {
        let res = result.data;
        res.result.list.forEach((item, index) => {
          this.categoryList.push({
            value: item._id,
            label: item.category_name
          });
        });
      });
    }
  }
};
</script>

<style lang="less">
#release_good {
  background: #4d4d4b;
  color: #fff;
  padding: 50px 70px;
  position: absolute;
  height: 100%;
  width: 100%;
  .title {
    color: #fff;
    font-weight: 600;
    font-size: 20px;
  }
  .input_box {
    width: 390px;
  }
  .text {
    font-size: 14px;
    margin: 40px;
    i {
      color: #fdca4a;
    }
  }
  .text input {
    color: #000;
    height: 30px;
    float: right;
    padding-left: 5px;
    width:200px;
    border-radius: 5px;
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
    left: 150px;
    top: -40px;
  }
  .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    border-radius: 3px;
    box-shadow: 1px 1px 1px 1px #e2e2e2;
  }
  .sure_bt {
    background: black;
    color: #fff;
    border: 2px solid #fdca4a;
    width: 90px;
    height: 35px;
    font-size: 13px;
    letter-spacing: 1px;
    line-height: 1;
    font-weight: 700;
    transition: 1s all ease;
    margin-left: 185px;
    margin-top: 10px;
  }
  .sure_bt:hover {
    color: #fdca4a;
  }
}
</style>

