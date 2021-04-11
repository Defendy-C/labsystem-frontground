<template>
<table>
  <thead>
    <tr>
      <td :key="index" v-for="(item, index) in fieldOpt">
        <span> {{item.name}} </span>
      </td>
      <td v-if="operation.length > 0"><span>操作</span></td>
    </tr>
  </thead>
  <tbody>
    <tr :key="index" v-for="(item, index) in list">
      <td :key="k" v-for="(value, k) in item">
        <span v-if="fieldOpt[k].typ==='text'">{{value}}</span>
        <button v-else-if="fieldOpt[k].typ==='button'" :class="fieldOpt[k].style" @click="value.executor(value.params)">{{fieldOpt[k].action}}</button>
      </td>
      <td v-if="operation.length > 0">
        <button :key="index" v-for="(value, index) in operation" :class="value.type" @click="value.operate">
          {{value.name}}
        </button>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
  name: "table",
  props: {
    fieldOpt: {
      type: Array,
      default: () => [],
    },
    operation: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    }
  },
}
</script>

<style scoped>
@import url("../common/styles/component/table.css");
</style>