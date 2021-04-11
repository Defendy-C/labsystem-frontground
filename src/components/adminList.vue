<template>
  <div class="admin_manager_view">
    <div class="admin_opt">
      <div class="admin_search">
        <search></search>
      </div>
    </div>
    <div class="admin_tab">
      <tab :tabs="['全部', '我的']" :response-action="tabSelected"></tab>
    </div>
    <div class="admin_list">
      <MyTable :fieldOpt="title" :list="list" :operation="fillOperation"></MyTable>
    </div>
    <div class="admin_page"><page :cur-page="curPage" :total-page="totalPage" :total-count="totalCount"></page></div>
  </div>
</template>

<script>
import MyTable from "./table";
import search from "@/components/search";
import page from "@/components/page";
import tab from "@/components/tab";
import { adminList } from "@/api/http";
import {dateFormat} from "@/common/util";
export default {
  name: "adminList",
  components: {
    MyTable,
    search,
    page,
    tab
  },
  data: function () {
    return {
      title: [
        {
          name: "ID",
          typ: "text",
        },
        {
          name: "昵称",
          typ: "text",
        },
        {
          name: "创建人",
          typ: "text",
        },
        {
          name: "权限",
          typ: "button",
          style: "normalOpt",
          action: "查看",
        },
        {
          name: "创建时间",
          typ: "text",
        }
      ],
      list: [],
      fillOperation: "",
      operation: [
        {
          name: "删除",
          type: "delete",
        }
      ],
      curPage: 1,
      totalPage: 0,
      totalCount: 0,
    }
  },
  async created() {
    const res = await this.getList();
    if (!res || !(res.list instanceof Array)) {
      return ;
    }
    this.packList(res);
  },
  methods: {
    startErrorTip: function (err_msg) {
      this.$root.err(err_msg);
    },
    showPower: function (power) {
      console.log(power);
    },
    packList: function (res) {
      if (!res) {
        return {}
      }
      this.list = [];
      this.totalCount = res.totalCount;
      this.totalPage = res.totalPage;
      for (let i = 0;i < res.list.length;i++) {
        const createdAt =  dateFormat(new Date(res.list[i].created_at));
        this.list[i] = [res.list[i].id, res.list[i].name, res.list[i].created_by, {params: res.list[i].power, executor: this.showPower}, createdAt];
      }
    },
    getList: async function (createdBy) {
      const resp = await adminList(createdBy,1, 10);
      const res = resp.HandleResp(this.startErrorTip);
      return {list: res.list, totalPage: res.total_page, totalCount: res.total_count};
    },
    tabSelected: async function (tag) {
      switch (tag) {
        case "0":
          this.fillOperation = "";
          this.packList(await this.getList());
          break;
        case "1":
          this.fillOperation = this.operation;
          this.packList(await this.getList(this.$store.state.adminName));
      }
    }
  }
}
</script>

<style scoped>
  @import url("../common/styles/component/admin_list.css");
</style>