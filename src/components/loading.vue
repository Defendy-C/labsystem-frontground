<template>
  <div class="loading_view" ref="view">
    <div class="loading_view_img"><i class="fa fa-spinner fa-pulse"></i></div>
    <div class="loading_view_mask"></div>
  </div>
</template>

<script>
export default {
  name: "loading",
  methods: {
    show: function () {
      this.$refs["view"].style.display = "block";
    },
    close: function () {
      this.$refs["view"].style.display = "none";
    }
  }
}
</script>

<style scoped>
@import url("../common/styles/component/loading.css");
</style>