<template>
  <Pop ref="pop" @ok="updateAdmin" @close="initAdminUpdate">
    <template v-slot:main>
      <AdminUpdate ref="adminUpdate"></AdminUpdate>
    </template>
  </Pop>
  <nav>
    <div class="admin_nav_greeting">
      <i class="fa fa-user-circle-o"></i>
      <span>Hello! {{ username }}</span>
    </div>
    <div ref="nav_list">
      <div :key="indexList" v-for="(list, indexList) in lists" class="admin_nav_list">
        <router-link v-if="list.type === 'item'" :to="list.link">{{ list.name }}<i class="fa fa-angle-down ico"></i></router-link>
        <span class="admin_main_nav_title" v-else @click="toggleList">{{ list.name }}<i class="fa fa-angle-up ico"></i></span>
        <ul class="admin_main_nav_list" v-if="list.children" :len="list.children.length">
          <li @click="switchView" :key="indexItem" v-for="(item, indexItem) in list.children">
            <router-link :to="item.link">{{ item.name }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="admin_main_aside">
    <div class="admin_main_head">
      <div class="admin_login_out">
        <button @click="loginOut" class="fa fa-sign-out"></button>
      </div>
      <div class="admin_main_option">
       <button class="fa fa-gear" @click="showAdminUpdate"></button>
      </div>
      <div class="admin_main_timer">
        <span ref="date">{{timer}}</span>
        <button @click="main_date_toggle" class="fa fa-clock-o"></button>
      </div>
    </div>
    <div class="admin_main_view">
      <router-view />
    </div>
  </div>
</template>

<script>
import {
  confirm_loginout, confirm_update_admin,
  err_empty,
  err_pwd_new_old_check,
  dateUpdatePerSecond,
  strToInt, rsaEncrypt,
  clearToken,
  checkNickName,
  checkPassword,
  err_nickname_format, err_password_format, err_pwd_check, tip_update
} from "@/common/util";
import { adminUpdate} from "@/api/http";
import Pop from "@/components/pop";
import AdminUpdate from "@/components/adminUpdate";

const dateShow = "admin_main_timer_show";
const dateHidden = "admin_main_timer_hidden";
const idCurView = "admin_main_cur_view";
const idCurTitle = "admin_main_cur_title";
const classCurSelected = "admin_main_nav_selected";
const classNavList = "admin_main_nav_list"
const classNavTitle = "admin_main_nav_title";
const classNavIco = "ico";
const downIco = "fa-angle-down";
const upIco = "fa-angle-up";
const secondTitleHeight = 40;

export default {
  name: "MainAdmin",
  components: {
    Pop,
    AdminUpdate,
  },
  setup() {
    let {timer, start} = dateUpdatePerSecond();
     start();
     return {
       timer,
     }
  },
  data: function () {
    return {
      username: "",
      lists: [
        {
          name: "管理员管理",
          type: "list",
          children:[
            {
              name: "管理员列表",
              link: "/admin/main/list",
            },
            {
              name: "创建管理员/用户",
              link: "/admin/main/create"
            }
          ]
        }
      ],
      showDate: false,
    }
  },
  async created() {
    const res = await this.$store.dispatch("getAdmin");
    this.username = res.name;
    await this.$router.push("/admin/main/list");
    this.$refs["nav_list"].querySelector(".admin_main_nav_list").querySelector("li").id = idCurView;
    this.$refs["nav_list"].querySelector(".admin_main_nav_title").id = idCurTitle;
    this.$refs["nav_list"].querySelector(".admin_main_nav_title").classList.add(classCurSelected);
  },
  methods: {
    main_date_toggle: function () {
      this.showDate = !this.showDate;
      if (this.showDate) {
        this.$refs["date"].classList.remove(dateHidden);
        this.$refs["date"].classList.add(dateShow);
        return
      }
      this.$refs["date"].classList.remove(dateShow);
      this.$refs["date"].classList.add(dateHidden);
    },
    startErrorTip: function (err_msg) {
      this.$store.commit("Err", err_msg);
    },
    switchView: function (e) {
      this.$refs["nav_list"].querySelector("." + classCurSelected).classList.remove(classCurSelected);
      this.$refs["nav_list"].querySelector("#" + idCurTitle).id = "";
      this.$refs["nav_list"].querySelector("#" + idCurView).id = "";
      e.currentTarget.classList.add(classCurSelected);
      e.currentTarget.id = idCurView;
      e.currentTarget.parentNode.parentNode.querySelector("." + classNavTitle).id = idCurTitle;
      return;
    },
    toggleList: function (e) {
      this.$refs["nav_list"].querySelector("." + classCurSelected).classList.remove(classCurSelected);

      let ico = e.currentTarget.querySelector("." + classNavIco);
      let list = e.currentTarget.parentNode.querySelector("." + classNavList);

      if (list.style.height === "" || list.style.height === "0px") {
        ico.classList.remove(upIco);
        ico.classList.add(downIco);
        let len;
        len = strToInt(list.getAttribute("len"));
        list.style.height = (secondTitleHeight * len) + "px";
        e.currentTarget.parentNode.querySelector("#" + idCurView).classList.add(classCurSelected);
        return ;
      }


      list.style.height = "0px";
      ico.classList.remove(downIco);
      ico.classList.add(upIco);
      e.currentTarget.classList.add(classCurSelected);
    },
    loginOut: function () {
      this.$root.confirm(confirm_loginout, ()=> {
        clearToken();
        location.reload();
      }, () => {});
    },
    showAdminUpdate: function () {
      this.$refs["pop"].show("管理员信息设置");
    },
    updateAdmin: function () {
      const values = this.$refs["adminUpdate"].getValue();
      const adminName = values[0], oldPwd = values[1], newPwd = values[2], checkPwd = values[3];
      if (!adminName||adminName === "" || !oldPwd || oldPwd === "" || !newPwd || newPwd === "" || !checkPwd || checkPwd === "" ) {
        this.startErrorTip(err_empty);
        return;
      }
      if (!checkNickName(adminName)) {
        this.startErrorTip(err_nickname_format);
        return;
      }
      if (!checkPassword(newPwd) || !checkPassword(oldPwd) ||!checkPassword(checkPwd)) {
        this.startErrorTip(err_password_format);
        return;
      }
      if (oldPwd === newPwd) {
        this.startErrorTip(err_pwd_new_old_check);
        return;
      }
      if (newPwd !== checkPwd) {
        this.startErrorTip(err_pwd_check);
        return;
      }
      this.$root.confirm(confirm_update_admin, async () => {
        let resp = await adminUpdate(adminName, rsaEncrypt(oldPwd), rsaEncrypt(newPwd));
        let res = resp.HandleResp(this.startErrorTip);
        if (res) {
          this.startErrorTip(tip_update);
        }
      });
    },
    initAdminUpdate: function () {
      this.$refs["adminUpdate"].initAdminName(this.$store.state.adminName);
    }
  },
}
</script>

<style scoped>
@import "../common/styles/view/main_admin.css";
</style>