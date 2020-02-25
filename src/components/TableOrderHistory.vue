<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">Search</span>
      </div>
      <input type="text" class="form-control" v-model="search" placeholder="Type Here ..." aria-label="Username" aria-describedby="basic-addon1">
      
    </div>
    <download-excel
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "data_order_history.xls">
      <button type="button" class="btn btn-primary">Excel Download</button>
    </download-excel>
    <table class="table table-hover my-custom-scrollbar table-wrapper-scroll-y-x text-nowrap" style="width: 100%">
      <thead>
        <tr class="bg-primary">
          <th scope="col">Id</th>
          <th scope="col">Nama Barang</th>
          <th scope="col">Line</th>
          <th scope="col">Mesin</th>
          <th scope="col">Type</th>
          <th scope="col">Jumlah</th>
          <th scope="col">Order By</th>
          <th scope="col">Alasan</th>
          <th scope="col">Receive By</th>
          <th scope="col">Vendor</th>
          <th scope="col">Ilustration</th>
          <th scope="col">Re-Order</th>
          <th scope="col">Actions</th>
          <!-- <th>Upload</th> -->
        </tr>
      </thead>
        <tbody v-if="barangDB.length !== 0">
          <tr v-for="item in filterBarang" v-bind:key="item.id">
            <th scope="row">{{item.id}}</th>
            <td style="width: 500px">{{item.barang}}</td>
            <td style="width: 300px">{{item.line}}</td>
            <td style="width: 300px">{{item.mesin.toUpperCase()}}</td>
            <td style="width: 300px">{{item.type}}</td>
            <td style="width: 300px">{{item.jumlah}}</td>
            <td style="width: 300px">{{item.orderBy}}</td>
            <td style="width: 300px">{{item.alasan}}</td>
            <!-- condition Waiting -->
            <td style="width: 300px" v-if="item.receiveBy">
              {{item.receiveBy}}
            </td>
            <td style="width: 300px" v-else>
              On Progress
            </td>
            <!-- Vendor Exists -->
            <td style="width: 300px" v-if="item.vendor">
              {{item.vendor}}
            </td>
            <td style="width: 300px" v-else>
              Tidak Ada Vendor
            </td>
            <td style="width: 300px">
              <button @click="viewImage(item.image)" class="btn-outline-primary">View</button>
            </td>
            <td style="width: 300px">
              <button @click="reOrderBarang(item)" class="btn-outline-primary">Re-Order</button>
            </td>
            <td style="width: 300px">
              <button @click="editOrder(item.id, item)" class="btn">✏️</button> | <button @click="removeBarang(item.id, item)" class="btn">🗑️</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr style="">
            <th colspan="4">{{status}}</th>
          </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
import db from '../../firebaseConfig'
import Swal from 'sweetalert2'
import firebase from 'firebase'
import { mapActions } from 'vuex'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'OrderHistory',
  data() {
    return {
      barangDB: [],
      status: 'Tidak Ada History',
      search: '',
      auth: '',
      json_fields: {
          'Nama Barang': 'barang',
          'Line': 'line',
          'Machine': 'mesin',
          'Type' : 'type',
          'Jumlah': 'jumlah',
          'Order By': 'orderBy',
          'Alasan': 'alasan',
          'Vendor': 'vendor'
      },
      json_data: []
    }
  },
  computed: {
    filterBarang() {
      if(this.search) {
        return this.barangDB.filter((item)=>{
          return item.barang.toLowerCase().match(this.search.toLowerCase());
        })
      } else {
        return this.barangDB
      }
    }
  },
  components: {
    'download-excel': JsonExcel
  },
  methods: {
    ...mapActions([
      'orderBarangDB'
    ]),
    reOrderBarang(objBarang) {
      Swal.fire(
        `Re-Order ${objBarang.barang} Success`,
        'Barang Sudah Ada Di Home',
        'success'
      )
      this.orderBarangDB(objBarang)
    },
    getAllBarang() {
        db.ref('orderFinished/').on('value', snapshoot => {
        let containerBarang = []
        this.barangDB = []
        let containerExcel = []
        if(snapshoot.val()) {
          Object.values(snapshoot.val()).map((itemBarang,i) => {
            itemBarang.id = Object.keys(snapshoot.val())[i]
            containerBarang.push(itemBarang)
            containerExcel.push({
              'barang': `${itemBarang.barang}`,
              'line': `'${itemBarang.line}'`,
              'machine': `'${itemBarang.mesin}'`,
              'type' : `'${itemBarang.type}'`,
              'jumlah': `'${itemBarang.jumlah}'`,
              'orderBy': `'${itemBarang.orderBy}'`,
              'alasan': `'${itemBarang.alasan}'`,
              'vendor': `'${itemBarang.vendor}'`
            })
          })
          this.barangDB = containerBarang
          this.json_data = containerBarang
        }
      })
    },
    async removeBarang(idBarang, objBarang) {
      await Swal.fire({
        title: 'Authorization',
        html: 
        `
          <div class="form-group">
            <label>Password</label>
            <input id="passwordAuth" type="password" class="form-control" placeholder="Password">
            <small class="form-text text-muted">Masukan Password.</small>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: async () => {
          await Swal.fire({
            title: `kamu mau hapus <br/> <b>${objBarang.barang}</b>?`,
            text: "Kamu tidak akan bisa membalikan kembali!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ya, hapus ini!'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Terhapus!',
                `${objBarang.barang} sudah di hapus.`,
                'success'
              )
              let userRef = db.ref('orderFinished/' + idBarang);
              userRef.remove()
            }
          })
        }
      })
    },
    async editOrder(idBarang, objBarang) {
      await Swal.fire({
        title: 'Authorization',
        html: 
        `
          <div class="form-group">
            <label>Password</label>
            <input id="passwordAuth" type="password" class="form-control" placeholder="Password">
            <small class="form-text text-muted">Masukan Password.</small>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: async () => {
          this.auth = document.getElementById('passwordAuth').value
          if(this.auth === 'staff') {
            const {value: formValues} = await Swal.fire({
              title: 'Edit Barang',
              html:
              `
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-6">
                      <label>Nama Barang</label>
                      <input id="namaBarang" type="text" value="${objBarang.barang}" class="form-control" placeholder="Nama Barang">
                    </div>
                    <div class="col-sm-6">
                      <label>Type</label>
                      <div class="input-group-prepend">
                        <input id="type" type="text" value="${objBarang.type}" class="form-control" placeholder="Type">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-6">
                      <label>Line</label>
                      <input id="line" type="text" value="${objBarang.line}" class="form-control" placeholder="Line">
                    </div>
                    <div class="col-sm-6">
                      <label>Mesin</label>
                      <div class="input-group-prepend">
                        <input id="mesin" type="text" value="${objBarang.mesin}" class="form-control" placeholder="Mesin">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-6">
                      <label>Jumlah</label>
                      <input id="jumlah" type="number" value="${objBarang.jumlah}" class="form-control" placeholder="Jumlah">
                    </div>
                    <div class="col-sm-6">
                      <label>Order By</label>
                      <div class="input-group-prepend">
                        <input id="orderBy" type="text" value="${objBarang.orderBy}" class="form-control" placeholder="Nama">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-sm-6">
                      <label>Alasan</label>
                      <input id="alasan" type="text" value="${objBarang.alasan}" class="form-control" placeholder="Alasan">
                    </div>
                    <div class="col-sm-6">
                      <label>Receive By</label>
                      <div class="input-group-prepend">
                        <input id="receiveBy" type="text" value="${objBarang.receiveBy}" class="form-control" placeholder="Nama">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12">
                      <label>Vendor</label>
                      <input id="vendor" type="text" value="${objBarang.vendor}" class="form-control" placeholder="Alasan">
                    </div>
                  </div>
                </div>
              `,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              focusConfirm: false,
              preConfirm: () => {
                let userRef = db.ref('orderBarang/');
                userRef.child(`${idBarang}`).update({
                  'barang': document.getElementById('namaBarang').value, 
                  'type': document.getElementById('type').value,
                  'line': document.getElementById('line').value,
                  'mesin': document.getElementById('mesin').value,
                  'line': document.getElementById('line').value,
                  'jumlah': document.getElementById('jumlah').value,
                  'orderBy': document.getElementById('orderBy').value,
                  'alasan': document.getElementById('alasan').value,
                  'receiveBy': document.getElementById('receiveBy').value,
                  'vendor': document.getElementById('vendor').value,
                })
              }
            })
      
            if (formValues) {
              await Swal.fire(
                'Barang Sudah Di rubah',
                'Edited',
                'success'
              )
            }
          }
        }
      })
    },
    viewImage(imageBarang) {
      console.log(imageBarang);
      
      if(imageBarang !== '') {
        var storageRef = firebase.storage().ref()
        var thisRef = storageRef.child(`${imageBarang}`);
        thisRef.getDownloadURL().then((url) => {
        this.urlImage = url
        // Insert url into an <img> tag to "download"
        console.log(url);
        Swal.fire({
          // title: 'Sweet!',
          // text: 'Modal with a custom image.',
          imageUrl: `${this.urlImage}`,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: `${imageBarang}`,
          animation: false
        })
        }).catch(function(error) {

          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              return Swal.fire(
                'Tidak Ada Gambar',
                `${error.code}`,
                'error'
              )
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
      } else {
        Swal.fire([
          'Tidak Ada Gambar',
          '',
          'error'
        ])
      }
    }
  },
  mounted() {
    this.getAllBarang()
  }
}
</script>

<style>

</style>
