<template>
  <error ref="err"></error>
  <loading ref="loading"></loading>
  <Confirm ref="confirm"></Confirm>
  <router-view />
</template>

<script>
import Error from "@/components/error";
import Loading from "@/components/loading";
import Confirm from "@/components/confirm";
export default {
  AuthStatus: true,
  components: {Confirm, Loading, Error},
  name: 'App',
  methods: {
    err: function (err) {
      this.$refs["err"].show(err);
    },
    loading: function () {
      this.$refs["loading"].show();
    },
    loaded: function () {
      this.$refs["loading"].close();
    },
    confirm(tip, ok, cancel) {
      this.$refs["confirm"].show(tip, ok, cancel);
    }
  },
  watch: {
    '$store.state.ErrSensor': function () {
      this.err(this.$store.state.errMsg);
    }
  }
}
</script>
<style>
</style>
