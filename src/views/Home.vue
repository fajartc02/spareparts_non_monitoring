<template>
  <div class="home">
    <JumbotronHome/>
    <ContainerHome/>
    <FooterOrder/>
  </div>
</template>

<script>
// @ is an alias to /src
import JumbotronHome from '@/components/JumbotronHome.vue'
import ContainerHome from '@/components/ContainerHome.vue'
import FooterOrder from '@/components/FooterOrder.vue'
// import messaging from '../../public/firebase-messaging-sw'

export default {
  
  name: 'home',
  components: {
    JumbotronHome,
    ContainerHome,
    FooterOrder,
  },
  mounted() {
    // messaging.onMessage((payload) => {
    //   console.log('Message received. ', payload);
    //   // ...
    // });
  }
}
</script>

<style>
  
</style>