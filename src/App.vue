<template>
  <div id="app">
    <Chart />
  </div>
</template>

<script>
import Chart from './components/chart.vue'

export default {
  name: 'App',
  components: {
    Chart
  }
}
</script>

<style>
#app,
html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
