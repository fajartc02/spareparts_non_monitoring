<template>
  <form>
    <div v-if="status" class="alert alert-success" role="alert">
      <p>Data Sudah Di Tambahkan, Silahkan Kalo Mau Tambah Lagi .. Semua Barang Bisa Di lihat di <a href="/">Home</a></p>
    </div>
    <div v-if="noticeFill" class="alert alert-danger" role="alert">
      <p>SILAHKAN DI ISI DULU !</p>
    </div>
    <div class="form-group">
      <label>Nama Barang</label>
      <input type="text" v-model="input.barang" class="form-control" placeholder="Nama Barang">
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-sm-6">
          <label>Line</label>
          <!-- <input type="text" v-model="input.line" class="form-control" placeholder="LP/CR/etc ."> -->
          <select class="custom-select" id="inputGroupSelect01" v-model="input.line">
            <option disabled>---Pilih Line---</option>
            <option value="LP">LP</option>
            <option value="DC">DC</option>
            <option value="CR">CR</option>
            <option value="CB">CB</option>
            <option value="CH">CH</option>
            <option value="CAM">CAM</option>
            <option value="ASSY">ASSY</option>
          </select>
        </div>
        <div class="col-sm-6">
          <label>Mesin</label>
          <input type="text" v-model="input.mesin" class="form-control" placeholder="IMZY-0002/IKCM-0001/etc .">
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-sm-6">
          <label>Type</label>
          <div class="input-group-prepend">
            <div class="input-group-text">Type</div>
            <input type="text" v-model="input.type" class="form-control" placeholder="LHBBW25/SOHC/etc .">
          </div>
        </div>
        <div class="col-sm-6">
          <label>Jumlah</label>
          <div class="input-group-prepend">
            <div class="input-group-text">Qty.</div>
            <input type="number" v-model="input.jumlah" class="form-control" placeholder="1">
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-sm-6">
          <label>Order By</label>
          <div class="input-group-prepend">
            <div class="input-group-text">Nama</div>
            <input type="text" v-model="input.orderBy" class="form-control" placeholder="Sarkum/Panjul/ etc.">
          </div>
        </div>
        <div class="col-sm-6">
          <label>Alasan</label>
          <div class="input-group-prepend">
            <!-- <input type="text" v-model="input.alasan" class="form-control" placeholder="TPM/Improvement/Redtag/ etc."> -->
            <select class="custom-select" id="inputGroupSelect01" v-model="input.alasan">
            <option disabled>---Pilih Alasan---</option>
            <option value="TPM">TPM</option>
            <option value="Improvement">Improvement</option>
            <option value="Red Tag">Red Tag</option>
            <option value="Problem">Problem</option>
            <option value="Project">Project</option>
          </select>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <label>Foto</label>
        <uploadFile @file-name-emit="fileNameEmit" :propsNameImage="`${input.barang} ${input.type}`"/>
      </div>
    </div>
    <div class="container" style="margin-top: 30px">
      <button type="button" class="btn btn-primary" @click="submitBarang">Order Barang</button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import uploadFile from './uploadFile.vue'
import axios from 'axios'

export default {
  data() {
    return {
      input: {
        barang: '',
        line: '---Pilih Line---',
        mesin: '',
        type: '',
        jumlah: '',
        orderBy: '',
        alasan: '---Pilih Alasan---',
        image: ''
      },
      status: false,
      noticeFill: false
    }
  },
  methods: {
    ...mapActions([
      'orderBarangDB'
    ]),
    async submitBarang() {
      this.input.image = `${this.input.barang} ${this.input.type}`
      if(this.input.barang !== '' && this.input.line !== '---Pilih Line---' && this.input.mesin !== '' && this.input.jumlah !== '' && this.input.orderBy !== '' && this.input.alasan !== '---Pilih Alasan---') {
        await this.orderBarangDB(this.input)
        this.input = {
          barang: '',
          line: '',
          mesin: '',
          type: '',
          jumlah: '',
          orderBy: '',
          alasan: '',
          image: ''
        }
        let jsonTxt = {
          "to": "echEIPCc8GU:APA91bGPNOG7hBt8iuOVrafgkmuMaKYPepXyKwAUX3qmBzeUxM3MI_uoJ8qPy4aVMKx9tJLIX3ucdmzC8NyqKyrgSjTXvYwGCVws2eYkAVJemR7jYW88YrsZZLgKhm-Okqb9xFe5yiUX",
          "data": {
            "icon": "https://i.dlpng.com/static/png/2287605_preview.png",
            "title": "Spareparts Monitoring",
            "body": "Anyone to order"
          }
        }
        axios.post('https://fcm.googleapis.com/fcm/send',jsonTxt,
          {
            headers: {
              "content-type": "application/json", 
              "Authorization": "key=AIzaSyCvSJ5O4_nuGvhH-xJ6rYws_0AoSRdvjnU"
            }
          }
        ).then((res) => {
          console.log(res);
          
        }).catch(err => {
          console.log(err);
          
        })
        this.status = true
        this.noticeFill = false
      } else {
        this.status = false
        this.noticeFill = true
      }
    },
    fileNameEmit(value) {
      console.log('from Parents');
      // this.image = value
      this.image = value
      console.log(value)
    }
  },
  components: {
    uploadFile
  }
}
</script>

<style>

</style>
