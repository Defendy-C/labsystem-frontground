<template>
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
        <button class="fa fa-sign-out"></button>
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
import { dateUpdatePerSecond, strToInt } from "@/common/util";
import {adminInfo} from "@/api/http";

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
              name: "创建管理员",
              link: "/admin/main/create"
            }
          ]
        }
      ],
      showDate: false,
    }
  },
  async created() {
    const resp = await adminInfo();
    const res = resp.HandleResp(this.startErrorTip);
    this.username = res.name;
    this.$store.commit("setAdminName", res.name);
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
    }
  },
}
</script>

<style scoped>
@import "../common/styles/view/main_admin.css";
</style>