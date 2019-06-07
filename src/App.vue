<template>
  <div id="app">
    <app-header></app-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-footer></app-footer>
  </div>
</template>

<script>
import navbar from "./components/navbarFiles/navbar.vue";
import footerSection from "./components/footerFiles/footer.vue";

export default {
  name: "App",
  components: {
    "app-header": navbar,
    "app-footer": footerSection
  }
};
</script>

<style lang="scss">
@import "./custom.scss";
</style>

