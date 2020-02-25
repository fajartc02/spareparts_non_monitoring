<template>
  <div style="margin-top: 50px">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">Search</span>
      </div>
      <input type="text" class="form-control" v-model="search" placeholder="Type Here ..." aria-label="Username" aria-describedby="basic-addon1">
      <!-- <button type="button" class="btn btn-success">Search</button> -->
    </div>
      <table class="table table-hover my-custom-scrollbar table-wrapper-scroll-y-x text-nowrap" style="width: 100%">
        <thead>
          <tr class="bg-primary">
            <th scope="col">Id</th>
            <th scope="col">Nama Barang</th>
            <th scope="col">Stock</th>
            <th scope="col">Harga</th>
            <th scope="col">Actions</th>
            <!-- <th>Upload</th> -->
          </tr>
        </thead>
          <tbody v-if="warungDB.length !== 0">
            <tr v-for="item in filterBarang" v-bind:key="item.id">
              <th scope="row">{{item.id}}</th>
              <td style="width: 500px">{{item.barang}}</td>
              <td style="width: 300px">{{item.stock}} pcs</td>
              <td style="width: 300px">Rp. {{item.harga}}</td>
              <td style="width: 800px">
                <button type="button" class="btn" @click="removeBarang(item.id, item.barang)">🗑️</button> | <button type="button" @click="updateBarang(item.id, item)" class="btn">✏️</button> | <button type="button" @click="addToCartBarang(item)" class="btn">🛒</button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr style="">
              <th colspan="4">{{status}}</th>
            </tr>
          </tbody>
      </table>
      <img :src="urlImage" alt="Image">
  </div>
</template>

<script>
import db from '../../firebaseConfig.js'
import Swal from 'sweetalert2'
// import { setInterval, setTimeout, clearTimeout } from 'timers';
import firebase from 'firebase'
import { mapActions } from 'vuex'
import { setInterval } from 'timers';

export default {
  data() {
    return {
      search: '',
      warungDB: [],
      status: 'Tidak Ada Data',
      urlImage: '',
    }
  },
  computed: {
    filterBarang() {
      if(this.search) {
        return this.warungDB.filter((item)=>{
          return item.barang.toLowerCase().match(this.search.toLowerCase());
        })
      } else {
        return this.warungDB
      }
    }
  },
  methods: {
    ...mapActions([
      'addToCart'
    ]),
    removeBarang(idBarang, namaBarang) {
      Swal.fire({
        title: `kamu mau hapus <br/> <b>${namaBarang}</b>?`,
        text: "Kamu tidak akan bisa membalikan kembali!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ya, hapus ini!'
      }).then((result) => {
        if (result.value) {
          this.warungDB = []
          Swal.fire(
            'Terhapus!',
            `${namaBarang} sudah di hapus.`,
            'success'
          )
          let userRef = db.ref('listBarang/' + idBarang);
          userRef.remove()
          // setInterval(() => {
          //   this.$router.go('/')
          // }, 2000)
        }
      })
    },
    async updateBarang(idBarang, objBarang) {
      const {value: formValues} = await Swal.fire({
        title: 'Edit Barang',
        html:
        `
          <div class="form-group">
            <label>Nama Barang</label>
            <input id="namaBarang" type="text" value="${objBarang.barang}" class="form-control" placeholder="Nama Barang">
            <small class="form-text text-muted">Masukan Nama Barang.</small>
          </div>
          <div class="form-group">
            <label>Harga</label>
            <div class="input-group-prepend">
              <div class="input-group-text">Rp.</div>
              <input id="hargaBarang" type="text" value="${objBarang.harga}" class="form-control" placeholder="Harga">
            </div>
          </div>
          <div class="form-group">
            <label>Stock</label>
            <div class="input-group-prepend">
              <input id="stockBarang" type="number" value="${objBarang.stock}" class="form-control" placeholder="Harga">
              <div class="input-group-text">Pcs</div>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
          let userRef = db.ref('listBarang/');
          userRef.child(`${idBarang}`).update({
            'barang': document.getElementById('namaBarang').value, 
            'harga': document.getElementById('hargaBarang').value,
            'stock': document.getElementById('stockBarang').value
          })
          return `
              Data Sudah Di rubah menjadi 
              ${document.getElementById('namaBarang').value}, 
              Harga: ${document.getElementById('hargaBarang').value}
              Stock: ${document.getElementById('stockBarang').value}
            `
        }
      })

      if (formValues) {
        Swal.fire(
          'Barang Sudah Di rubah',
          ` Barang: ${document.getElementById('namaBarang').value}, 
            Harga: Rp. ${document.getElementById('hargaBarang').value}, 
            Stock: ${document.getElementById('stockBarang').value}`,
          'success'
        )
        // setInterval(() => {
        //     this.$router.go('/')
        //   }, 1000)
      }
    },
    async getAllBarang() {
      const load = await (() => {
        if(this.warungDB.length !== 0) {
          this.status = 'Memuat ...'
        }
      })
      const collect = await db.ref('listBarang/').on('value', snapshoot => {
        let containerBarang = []
        this.warungDB = []
        if(snapshoot.val()) {
          Object.values(snapshoot.val()).forEach((itemBarang,i) => {
            itemBarang.id = Object.keys(snapshoot.val())[i]
            containerBarang.push(itemBarang)
          })
          this.warungDB = containerBarang
        }
      })
    },
    async addToCartBarang(item) {
      // console.log(barang);
      const {value: formValues} = await Swal.fire({
        title: 'Tambah Keranjang',
        html:
        `
          <div class="form-group" style="text-align: left">
            <label>Nama Barang</label>
            <p><small><b>${item.barang}</small></b></p>
          </div>
          <div class="form-group" style="text-align: left">
            <label>Harga</label>
            <div class="input-group-prepend">
              <p><small><b>Rp. ${item.harga}</small></b></p>
            </div>
            <div class="form-group">
              <label>Total Barang</label>
              <input id="totalBarang" value="1" type="number" class="form-control" placeholder="1" max="${item.stock}">
              <p><small>Sisa Stock: <b>${item.stock}</small></b></p>
            </div>
          </div>
        `,
        showCancelButton: true,
        // showConfirmButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
          item.total = document.getElementById('totalBarang').value
          if(+item.total <= +item.stock) {
            this.addToCart(item)
            return `Sudah di tambahkan ke Keranjang silahkan jajan lagi`
          } else {
            return Swal.fire(
            `Barang yang anda beli ${item.total} itu terlalu Banyak`,
            `Stock Hanya: ${item.stock} Pcs`,
            'error'
          )
          }
        }
      })
    }
  },
  mounted() {
    var storageRef = firebase.storage().ref()
    var thisRef = storageRef.child('led-scene-0.gif');
    thisRef.getDownloadURL().then((url) => {
    this.urlImage = url
    // Insert url into an <img> tag to "download"
    console.log(url);
    
    }).catch(function(error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
    this.getAllBarang()
  }
}
</script>

<style>
.my-custom-scrollbar {
  position: relative;
  width: 1000px;
  overflow: auto;
}
.table-wrapper-scroll-y-x {
  display: block;
}
</style>
