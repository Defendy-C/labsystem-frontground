<template>
<div class="verify_view hide" ref="view">
  <div class="verify_view_banner">
    <span>滑动验证:请移动拼图到空白区域</span>
  </div>
  <div class="verify_view_main">
    <img :src="basePuz">
    <div class="verify_view_mask"></div>
  </div>
  <div class="verify_view_puzzle" @mousedown="puzzleDown" ref="puzzle">
    <img :src="puzzle">
    <div class="verify_view_puzzle_mask"></div>
  </div>
  <div class="verify_view_result" ref="ResultBanner">
    <span >{{tip}}</span>
  </div>
</div>
</template>

<script>
import {getVCodeKey, getPuzzle, verifyCode} from "../api/http"
export default {
  name: "verify_code",
  data: function () {
    return {
      key: "",
      clickPos: 0,
      movePos: 0,
      puzzle: "",
      basePuz: "",
      tip: "",
      status: false,
      finished: false,
    }
  },
  methods: {
    initVerifyView: async function() {
      this.$emit("pending");
      const resp = await getVCodeKey();
      const res = resp.HandleResp(this.error);
      if (!res) {
        this.$emit("pended");
        return false;
      }
      this.key = res.key;
      const puz = await getPuzzle(this.key, 1);
      if (!puz) {
        this.$emit("pended");
        return false;
      }
      const base = await getPuzzle(this.key, 2);
      if (!base) {
        this.$emit("pended");
        return false;
      }
      this.puzzle = puz;
      this.basePuz = base;
      this.$emit("pended");
      return true;
    },
    initParams: function () {
      this.clickPos = 0;
      this.movePos = 0;
      this.$refs.puzzle.style.left = "0px";
      this.finished = false;
      this.$refs["ResultBanner"].classList.remove("fail");
      this.$refs["ResultBanner"].classList.remove("success");
    },
    puzzleDown: function (e) {
      e.preventDefault();
      // when puzzle move event have taken place, it will not be touched off repeatedly
      if (this.finished) {
        return
      }
      this.clickPos = e.pageX;
      e.currentTarget.addEventListener("mousemove", this.puzzleMove);
      e.currentTarget.addEventListener("mouseup", this.cancelMove);
      e.currentTarget.addEventListener("mouseleave", this.cancelMove);
    },
    puzzleMove: function (e) {
      e.preventDefault();
      let move = e.pageX - this.clickPos;
      let left = !e.currentTarget.style.left ? 0 : parseInt(e.currentTarget.style.left.substr(0, e.currentTarget.style.left.length - 2));
      left = left + move;
      if (left >= 250 || left <= 0) {
        return
      }
      e.currentTarget.style.left = left + "px";
      this.clickPos = e.pageX;
      this.movePos += move;
    },
    cancelMove: async function (e) {
      e.currentTarget.removeEventListener("mousemove", this.puzzleMove);
      e.currentTarget.removeEventListener("mouseup", this.cancelMove);
      e.currentTarget.removeEventListener("mouseleave", this.cancelMove);
      let res = await this.verify();
      res ? this.success() : this.failed();
      // the action of mouse moving have finished
      this.finished = true;
    },
    success: function () {
      // render
      this.tip = "验证成功!";
      this.$refs["ResultBanner"].classList.add("success");
      let self = this;
      setTimeout(async function () {
        self.hide();
        self.$emit("success", self.key, self.movePos);
      }, 1000);
    },
    failed: function () {
      this.tip = "验证失败!";
      this.$refs["ResultBanner"].classList.add("fail");
      let self = this;
      setTimeout(async function () {
        self.hide();
      }, 1000);
    },
    error: function (err_msg) {
      this.$emit("failed", err_msg);
    },
    show: async function () {
      let res = await this.initVerifyView();
      if (!res) {
        return false;
      }
      this.initParams();
      this.$refs["view"].classList.remove("hide");
      this.$refs["view"].classList.add("show");
      return true;
    },
    hide: function () {
      this.$refs["view"].classList.remove("show");
      this.$refs["view"].classList.add("hide");
    },
    verify: async function () {
      this.$emit("pending");
      let res = await verifyCode(this.key, this.movePos);
      this.$emit("pended");
      return  res.HandleResp(this.error);
    }
  }
}

</script>

<style scoped>
@import url('../common/styles/component/verify_code.css');
</style>