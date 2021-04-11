<template>
  <div class="page">
    <button v-if="curPage > 1" class="fa fa-chevron-left"></button>
    <button v-else class="fa fa-chevron-left" disabled></button>
    <button v-if="curPage > 5">1</button>
    <span v-if="curPage > 7">...</span>
    <button v-if="curPage - 2 > 0">{{ curPage - 2 }}</button>
    <button v-if="curPage - 1 > 0">{{ curPage - 1 }}</button>
    <button v-if="curPage > 0">{{ curPage }}</button>
    <button v-if="curPage + 1 < totalPage">{{ curPage + 1 }}</button>
    <button v-if="curPage + 2 < totalPage">{{ curPage + 2 }}</button>
    <span v-if="curPage < totalPage - 2">...</span>
    <button v-if="curPage < totalPage - 1">{{totalPage}}</button>
    <button v-if="curPage !== totalPage" class="fa fa-chevron-right"></button>
    <button v-else class="fa fa-chevron-right" disabled></button>
    共 {{ totalCount }} 条
  </div>
</template>

<script>
export default {
  name: "page",
  props: {
    curPage:{
      type: Number,
      default: 0,
    },
    totalPage: {
      type: Number,
      default: 0,
    },
    totalCount: {
      type: Number,
      default: 0
    }}
}
</script>

<style scoped>
@import url("../common/styles/component/page.css");
</style>