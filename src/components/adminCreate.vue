<template>
<div class="createAdminView">
  <div>
    <label for="nickname">昵称</label>
    <input type="text" id="nickname" />
  </div>
  <div>
    <label for="password">密码</label>
    <input id="password" type="password" />
  </div>
  <div>
    <label for="confirm_password" >确认密码</label>
    <input id="confirm_password" type="password">
  </div>
</div>
</template>

<script>
export default {
name: "adminCreate"
}
</script>

<style scoped>

</style>