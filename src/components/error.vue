<template>
  <div class="err_view" ref="view">
    <span>{{tip}}</span>
  </div>
</template>

<script>
export default {
  name: "error",
  data: function () {
    return {
      state: 1,
      tip: this.$route.params.tip,
    }
  },
  methods: {
    show: function (err) {
      this.$refs["view"].classList.remove("err_view_animation" + this.state);
      this.tip = err;
      this.state = (this.state) % 2 + 1;
      this.$refs["view"].classList.add("err_view_animation" + this.state);
    },
  }
}
</script>

<style scoped>
@import url("../common/styles/component/error.css");
</style>