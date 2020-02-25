<template>
  <div class="jumbotron jumbotron-fluid noneBack" 
    style="
      background-image: url('https://cdn.pixabay.com/photo/2016/11/09/07/09/babu-1810147__340.jpg');
      background-size: cover;
      margin-top: 20px
    "
  >
  <div class="container">
    <h1 class="display-4 glow" style="font-size: 50px">Spareparts Non Item Order Monitoring</h1>
    <emitting-analog-clock id='main-clock' :size='260' :showDigital="true" :smooth="true"></emitting-analog-clock>
    <p class="lead glow">🖥️ Awesome Apps Non Item Spareparts Control 🖥️</p>
  </div>
</div>
</template>

<script>
import EmittingAnalogClock from 'vue-emitting-analog-clock';
export default {
  name: 'jumbotron',
  data() {
    return {
      // smooth: true
    }
  },
  components: {
    EmittingAnalogClock
  }
}
</script>

<style>
.noneBack {
  background-color: none;
}
.glow {
  font-size: 30px;
  color: #fff;
  text-align: center;
  animation: glow 1s ease-in-out infinite alternate;
}

canvas {
position: relative;
top: 0px;
left: 0px;
margin: 0px;
}


</style>
