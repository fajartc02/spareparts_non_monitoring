import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebaseConfig'
import Swal from 'sweetalert2'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: []
  },
  mutations: {
    ADD_BARANG(state, payload) {
      // state.namaBarang = payload.barang
      // state.hargaBarang = payload.harga
      console.log(payload.barang);
      state.cart.push(payload)
      console.log(state.cart);
    }
  },
  actions: {
    tambahBarangDB(context, data) {
      db.ref(`listBarang/`).push({
        barang: data.barang,
        harga: data.harga,
        stock: data.stock
      })
    },
    orderBarangDB(context, data) {
      console.log(data);
      
      db.ref('orderBarang/').push({
        barang: data.barang,
        line: data.line,
        mesin: data.mesin,
        type: data.type,
        jumlah: data.jumlah,
        orderBy: data.orderBy,
        alasan: data.alasan,
        image: data.image
      })
    },
    addToCart(context, data) {
      console.log('===> From Store');
      db.ref('myCart/').push({
        barang: data.barang,
        harga: data.harga,
        total: data.total
      })
      console.log(data);
      // data.total = 1 // temporary
      context.commit('ADD_BARANG', data)
    },
    async orderFinishedDB(context, data) {
      await db.ref('orderFinished/').push({
        barang: data.barang,
        line: data.line,
        mesin: data.mesin,
        type: data.type,
        jumlah: data.jumlah,
        orderBy: data.orderBy,
        alasan: data.alasan,
        image: data.image,
        receiveBy: data.receiveBy,
        vendor: data.vendor
      })
      console.log(data.id);
      
      let userRef = db.ref('orderBarang/' + data.id);
      await userRef.remove()
      await Swal.fire(
        'Barang Sudah Sampai',
        'success'
      )
    }
  }
})
