<template>
  <div id="app">
    <Test msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Test from './components/test_now2.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    Test
  }
}
</script>

<style>
#app, html, body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
