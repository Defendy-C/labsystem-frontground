<template>
  <error ref="err"></error>
  <loading ref="loading"></loading>
  <router-view />
</template>

<script>
import Error from "@/components/error";
import Loading from "@/components/loading";
export default {
  AuthStatus: true,
  components: {Loading, Error},
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
