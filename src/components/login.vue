<template>
  <div class="login_view" :style=s>
    <div class="login_view_input">
      <input type="text" placeholder="请输入用户名" v-model="uname" :disabled="inputDisabled">
      <i class="fa fa-user"></i>
    </div>
    <div class="login_view_input">
      <input type="password" placeholder="请输入密码" v-model="password" :disabled="inputDisabled">
      <i class="fa fa-lock"></i>
      <i class="fa fa-eye-slash"></i>
    </div>
    <div class="login_view_loginBtn">
      <button @click="loginBtnClick" :disabled="inputDisabled">
        <i class="fa fa-arrow-right"></i>&nbsp;
        <span>登录</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  props: ["w", "visible"],
  data: function () {
    return {
      "s": "width: " + this.w + "px",
      "uname": "",
      "password": "",
      "inputDisabled": false,
    }
  },
  methods: {
    loginBtnClick: function () {
      this.$emit("LoginBtnClick", this.uname, this.password);
    }
  },
  watch: {
    visible: function () {
      let isVisible = this.visible === undefined ? true : this.visible;
      if (isVisible) {
        this.inputDisabled = false;
      } else {
        this.inputDisabled = true;
      }
    }
  }
}
</script>

<style scoped>
@import url("../common/styles/component/login.css");
</style>