<template>
  <div class="container-fluid">
    <div class="row flex-row flex-nowrap overflow-auto" style="padding: auto; margin-left: 10px">
      <div v-for="item in container" :key="item.img">
        <div class="card card-block" style="width: 15rem;margin-right: 50px">
          <img :src="item.img" class="card-img-top" alt="blank" style="width: 200px">
          <div class="card-body">
            <p class="card-text">
              <br/>
              <b>{{item.name}}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
    <TableOrder/>
  </div>
</template>

<script>
import TableHome from './TableHome'
import TableOrder from './TableOrder'
import axios from 'axios'

export default {
  data() {
    return {
      container: [
        {
          name: 'Solenoid SMC',
          img: 'https://webshop.demaco.nl/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/s/m/smc-5loz-solenoid_1.jpg'
        },
        {
          name: 'Servo Motor',
          img: 'https://cdn.cncbote.de/wp-content/uploads/2015/10/135980_1.png'
        },
        {
          name: 'Linear Scale',
          img: 'https://www.micromech.co.uk/uploads/products/renishaw_encoder_rgh25f.jpg'
        },
        {
          name: 'Linear Bushing',
          img: 'https://www.sparesfusion.com/pub/media/catalog/product/cache/1/small_image/400x400/6b014c604f2636251a746701b76634f2/t/h/thk_lmf12luu.jpg'
        },
        {
          name: 'Photo Sensor',
          img: 'https://electropeak.com/pub/media/catalog/product/cache/10f519365b01716ddb90abc57de5a837/o/m/omron_e3z-d61_diffuse_reflective_npn_5-100mm_distance_sensor.jpg'
        }
      ]
    }
  },
  components: {
    TableHome,
    TableOrder
  },
  created() {
    axios.get('https://us-central1-sparepartsmonitoring.cloudfunctions.net/helloWorld')
    .then((result) => {
      console.log('masuk');
      
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  }
}
</script>

<style>
.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
.card {
  display: inline-block;
}
</style>
