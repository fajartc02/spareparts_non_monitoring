<template>
  <form>
    <div v-if="status" class="alert alert-success" role="alert">
      <p>Data Sudah Di Tambahkan, Silahkan Kalo Mau Tambah Lagi .. Semua Barang Bisa Di lihat di <a href="/">Home</a></p>
    </div>
    <div class="form-group">
      <label>Nama Barang</label>
      <input type="text" v-model="input.barang" class="form-control" placeholder="Nama Barang">
    </div>
    <div class="form-group">
      <label>Harga</label>
      <div class="input-group-prepend">
        <div class="input-group-text">Rp.</div>
        <input type="text" v-model="input.harga" class="form-control" placeholder="Harga">
      </div>
    </div>
    <div class="form-group">
      <label>Stock</label>
      <div class="input-group-prepend">
        <div class="input-group-text">Qty.</div>
        <input type="number" v-model="input.stock" class="form-control" placeholder="Stock">
      </div>
    </div>
    <uploadFile/>
    <button type="button" class="btn btn-primary" @click="submitBarang">Tambah</button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import uploadFile from './uploadFile.vue'
export default {
  data() {
    return {
      input: {
        barang: '',
        harga: '',
        stock: ''
      },
      status: false,
    }
  },
  methods: {
    ...mapActions([
      'tambahBarangDB'
    ]),
    submitBarang() {
      this.tambahBarangDB(this.input)
      this.input = {
        barang: '',
        harga: '',
        stock: ''
      }
      this.status = true
    }
  },
  components: {
    uploadFile
  }
}
</script>

<style>

</style>
