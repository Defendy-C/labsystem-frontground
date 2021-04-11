<template>
  <div class="tab" ref="tabs">
    <button :key="index" v-for="(tab, index) in tabs" @click="tabSelected" :tag="index">{{ tab }}</button>
  </div>
</template>

<script>
export default {
  name: "tab",
  props: {
    responseAction: {
      type: Function,
      default: (tag) => {console.log("tab", tag, ":no action")}
    },
    tabs: {
      type: Array,
      default: () => [],
    }
  },
  mounted() {
    this.$refs["tabs"].querySelector("button").id = "tab_selected";
  },
  methods: {
    tabSelected: function (e) {
      this.$refs["tabs"].querySelector("#tab_selected").id = "";
      e.currentTarget.id = "tab_selected";
      this.responseAction(e.currentTarget.getAttribute("tag"));
    }
  }
}
</script>

<style scoped>
@import url("../common/styles/component/tab.css");
</style>