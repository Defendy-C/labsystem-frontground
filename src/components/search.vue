<template>
  <div class="search">
    <div class="search_input">
      <input type="text" placeholder="请输入要搜索的内容">
      <div class="select">
      </div>
      <button><i class="fa fa-search"></i></button>
    </div>
    <div class="search_field" ref="fieldsView" @mouseenter="showSearchField" @mouseleave="hiddenSearchField">
      <ul>
        <span>{{ selectedSearchField }}<i class="fa fa-chevron-down"></i></span>
        <li @click="selectSearchField">ID</li>
        <li @click="selectSearchField">用户名</li>
        <li @click="selectSearchField">创建人</li>
      </ul>
    </div>
<!--    <div class="admin_time_selector">-->
<!--      <span>创建时间:</span>-->
<!--      <input type="datetime-local" value="from" />-->
<!--      <span>~</span>-->
<!--      <input type="datetime-local" value="to" />-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "search",
  data: function () {
    return {
      selectedSearchField: "ID",
    }
  },
  methods: {
    showSearchField: function () {
      this.$refs["fieldsView"].style.height = "120px";
    },
    hiddenSearchField: function () {
      this.$refs["fieldsView"].style.height = "28px";
    },
    selectSearchField: function (e) {
      this.selectedSearchField = e.currentTarget.innerHTML;
      this.hiddenSearchField();
    }
  }
}
</script>

<style scoped>
@import url("../common/styles/component/search.css");
</style>