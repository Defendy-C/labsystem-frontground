<template>
  <div class="createAdmin">
    <div class="admin_create_tab">
      <Tab :tabs="['管理员', '教师']" ></Tab>
    </div>
    <div class="createAdminView">
      <Forms ref="forms-view" :list="forms"></Forms>
      <div class="create_admin_power_view">
        <label>权限分配</label>
        <div>
          <Power ref="powerInfo" :data="powers"></Power>
        </div>
      </div>
      <div class="create_admin_btn_dock">
        <button @click="createAdmin">创建</button>
      </div>
    </div>
  </div>
</template>

<script>
import Power from "@/components/power";
import { adminCreate } from "@/api/http";
import { err_empty, err_pwd_check, err_nickname_format, err_password_format, tip_create, checkNickName, checkPassword, rsaEncrypt } from "@/common/util";
import Tab from "@/components/tab";
import Forms from "@/components/forms";
import { useStore } from "vuex"

export default {
name: "adminCreate",
  components: {
    Power,
    Tab,
    Forms,
  },
  setup() {
    const store = useStore();
    return {
      "powers": store.state.adminPowers,
      "forms": [
        {
          title: "昵称",
          type: "text",
          name: "nickname",
          require: true,
        },
        {
          title: "密码",
          type: "password",
          name: "password",
          require: true,
        },
        {
          title: "确认密码",
          type: "password",
          name: "confirm_pwd",
          require: true,
        }
      ]
    }
  },
  methods: {
    startErrorTip: function (err_msg) {
      this.$store.commit("Err", err_msg);
    },
    createAdmin: async function () {
      const values = this.$refs["forms-view"].getValues();
      const nickname = values[0], password = values[1], check_pwd = values[2];
      if (nickname === "" || password === "" || check_pwd === "") {
          this.startErrorTip(err_empty);
          return;
      }
      if (password !== check_pwd) {
        this.startErrorTip(err_pwd_check);
        return;
      }
      if (!checkNickName(nickname)) {
        this.startErrorTip(err_nickname_format);
        return;
      }
      if (!(checkPassword(password) && (checkPassword(check_pwd)))) {
        this.startErrorTip(err_password_format);
        return;
      }

      const powers = this.$refs.powerInfo.powers;
      let p = 0;
      for (let i = 0;i < powers.length;i++) {
        if (powers[i].own) {
          p +=powers[i].power;
        }
      }

      this.$root.confirm("是否创建管理员:" + this.nickname + " ?", async () => {
        let resp = await adminCreate(this.nickname, rsaEncrypt(this.password), p);
        let res = resp.HandleResp(this.startErrorTip);
        if (res) {
          this.startErrorTip(tip_create);
        }
      }, () => {});
    }
  }
}
</script>

<style scoped>
@import url("../common/styles/component/admin_create.css");
</style>