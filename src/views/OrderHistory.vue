<template>
  <div class="home">
    <JumbotronHome/>
    <TableOrderHistory/>
    <FooterOrder/>
  </div>
</template>

<script>
// @ is an alias to /src
import JumbotronHome from '@/components/JumbotronHome.vue'
import TableOrderHistory from '@/components/TableOrderHistory.vue'
import FooterOrder from '@/components/FooterOrder.vue'

export default {
  name: 'home',
  components: {
    JumbotronHome,
    TableOrderHistory,
    FooterOrder
  }
}
</script>

<style>
  
</style>