<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-primary">
    <a class="navbar-brand" href="/">
      <img src="http://www.iconarchive.com/download/i65762/jommans/emluator/My-Computer.ico" width="30" height="30" class="d-inline-block align-top" alt="">
      Spareparts Monitoring
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
        </li>
        <!-- <li class="nav-item">
          <a class="nav-link" href="/tambah">Tambah Barang</a>
        </li> -->
        <li class="nav-item">
          <a class="nav-link" href="/order">Order Barang</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/orderHistory">Order History</a>
        </li>
        <!-- <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Keranjangku <b>{{myCart.length > cartStore ? myCart.length : cartStore}}</b>
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown" style="width: 400px">
            <div style="text-align:center">
              <p style=""><b>Daftar Belanjaan</b></p>
              <table class="table table-hover my-custom-scrollbar table-wrapper-scroll-y-x text-nowrap">
                <thead>
                  <th>Nama Barang</th>
                  <th>Harga Barang</th>
                  <th>Total Qty</th>
                  <th>Total Harga</th>
                  <th>Actions</th>
                </thead>
                <tbody>
                  <tr v-if="storeBarang.length === 0">
                    <td colspan="5">Tidak Ada Barang</td>
                  </tr>
                  <tr v-for="item in storeBarang" v-bind:key="item.id">
                    <td>{{item.barang}}</td>
                    <td>Rp. {{item.harga}}</td>
                    <td>{{item.total}}</td>
                    <td>Rp. {{item.total * item.harga}}</td>
                    <td>
                      <button type="button" class="btn" @click="removeFromCart(item.id, item.barang)">🗑️ Hapus</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="dropdown-divider"></div>
            <div class="container" style="text-align: center">
              <p class="dropdown-item">Total Semuanya: Rp. {{'0'}}</p>
              <button class="btn btn-primary" type="button">Bayar</button>
            </div>
          </div>
        </li> -->
        <li class="nav-item">
          <a class="nav-link" href="/about">About</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import db from '../../firebaseConfig'
import Swal from 'sweetalert2'

export default {
  name: 'Navbar',
  data() {
    return {
      myCart: [],
      lengthCartBefore: 0,
      cartStore: 0
    }
  },
  computed: {
    ...mapState(['cart']),
    storeBarang() {
      // don't you call methode data firebase .on in this computed, because this make recursive
      if(this.cart.length === 0) { //bug please fix this
        // this.cart.push(this.myCart)
        // console.log(this.cart);
        this.lengthCartBefore = this.myCart.length
        console.log(this.lengthCartBefore);
        return this.myCart  
      } else {
        if(this.cart.length === 1) {
          console.log('lengthcart');
          
          console.log(this.lengthCartBefore);
          console.log(this.myCart);
          this.cartStore = this.myCart.slice(this.lengthCartBefore).length - 1
          return this.myCart.splice(this.lengthCartBefore)
        } else {
          return this.cart
        }
      }
    }
  },
  methods: {
    async collectCart() {
      let containerCart = []
      const load = await (() => {
        })
      const collect = await db.ref('myCart/').on('value', snapshoot => {
        this.myCart = []
        if(snapshoot.val()) {
          Object.values(snapshoot.val()).forEach((itemBarang,i) => {
            itemBarang.id = Object.keys(snapshoot.val())[i]
            containerCart.push(itemBarang)
          })
          // console.log(this.myCart);
          this.myCart = containerCart
          // return this.myCart
        }
      })
    },
    removeFromCart(idBarang, namaBarang) {
      Swal.fire({
        title: `kamu mau hapus <br/> <b>${namaBarang}</b> dari keranjang?`,
        text: "Barang Akan Hilang!",
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
          this.myCart.splice(0)
          let userRef = db.ref('myCart/' + idBarang);
          userRef.remove()
          // setInterval(() => {
          //   this.$router.go('/')
          // }, 2000)
        }
      })
    }
  },
  mounted() {
    this.collectCart()
  }
}
</script>

<style scoped>
.my-custom-scrollbar {
  position: relative;
  width: 100%;
  overflow: auto;
}
.table-wrapper-scroll-y-x {
  display: block;
}
</style>
