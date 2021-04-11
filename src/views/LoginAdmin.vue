<template>
  <div class="admin_login_view">
    <h1>LabSystem 后台管理平台</h1>
    <div class="for_login">
      <Login w="500" @LoginBtnClick="verify" :visible="loginInputVisible"></Login>
    </div>
  </div>
  <verify-code @pended="loaded" @pending="loading" @success="login" @failed="Fail" ref="VerifyCodeView"></verify-code>
</template>

<script>
import Login from "@/components/login.vue"
import VerifyCode from "@/components/verify_code"
import {adminLogin} from "@/api/http";
import {err_login, err_server, setToken, rsaEncrypt } from "@/common/util"
export default {
  name: "LoginAdmin",
  components: {
    Login,
    VerifyCode,
  },
  data: function () {
    return {
      uname: "",
      password: "",
      loginInputVisible: true,
    }
  },
  methods: {
    login: async function (key, vcode) {
      const resp = await adminLogin(this.uname, this.password, key, vcode);
      const res = resp.HandleResp(this.Fail);
      if (!res) {
        this.loginInputVisible = true;
        return ;
      }
      setToken(resp.data);
      this.loginInputVisible = true;
      await this.$router.push({name: "mainAdmin"});
    }
    ,
    verify: async function (uname, password) {
      if (uname === "" || password === "") {
        this.startErrorTip(err_login);
        return
      }
      if (!await this.$refs["VerifyCodeView"].show()) {
        return
      }
      this.uname = uname;
      this.password = rsaEncrypt(password);
      this.loginInputVisible = false;
    },
    Fail: function (fail_msg) {
      // hidden verify view
     this.loginInputVisible = true;
     fail_msg = fail_msg ? fail_msg : err_server;
     this.startErrorTip(fail_msg);
    },
    startErrorTip: function (err_msg) {
      this.$store.commit("Err", err_msg);
    },
    loading: function () {
      this.$root.loading();
    },
    loaded: function () {
      this.$root.loaded();
    }
  }
}
</script>

<style scoped>
@import "../common/styles/view/admin_login_view.css";
</style>