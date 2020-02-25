<template>
  <div style="margin-top: 50px">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <!-- <p>{{token}}</p> -->
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
            <th scope="col">Line</th>
            <th scope="col">Mesin</th>
            <th scope="col">Type</th>
            <th scope="col">Jumlah</th>
            <th scope="col">Order By</th>
            <th scope="col">Alasan</th>
            <th scope="col">Receive By</th>
            <th scope="col">Planning Arrived</th>
            <th scope="col">Status</th>
            <th scope="col">Ilustration</th>
            <th scope="col">Proccess</th>
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
              <!-- condition Waiting Planning-->
              <td style="width: 300px" v-if="item.planningArrived">
                <p v-if="item.dateCond" class="blinking">
                  {{item.planningArrived}}
                </p>
                <p v-else>
                  {{item.planningArrived}}
                </p>
              </td>
              <td style="width: 300px" v-else>
                On Progress
              </td>

                <!-- status order -->
              <td v-if="!item.planningArrived" style="width: 300px">
                <p class="text-warning">Waiting Received</p>
              </td>
              <td style="width: 300px" v-else>
                <p class="text-danger" v-if="item.dateCond">
                  Delay
                </p>
                <p class="text-primary" v-else>
                  On Progress Order
                </p>
              </td>

              <td style="width: 300px">
                <button @click="viewImage(item.image)" class="btn-outline-primary">View</button>
              </td>
              <!-- condition ordered -->
              <td style="width: 300px" v-if="item.planningArrived">
                <button @click="orderFinished(item.id, item)" class="btn-outline-success">Order Finished</button>
              </td>
              <td style="width: 300px" v-else>
                <button @click="updateOrder(item.id, item)" class="btn-outline-primary">Proccess</button>
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
      <!-- <img :src="urlImage" alt="Image"> -->
      
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
      barangDB: [],
      status: 'Tidak Ada Data',
      urlImage: '',
      auth: '',
      dateCond: '',
      token: ''
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
  methods: {
    ...mapActions([
      'addToCart',
      'orderFinishedDB'
    ]),
    async orderFinished(idBarang, barang) {
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
          console.log(barang);
          if(this.auth === 'staff') {
            this.orderFinishedDB(barang)
          }
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
              this.barangDB = []
              Swal.fire(
                'Terhapus!',
                `${objBarang.barang} sudah di hapus.`,
                'success'
              )
              let userRef = db.ref('orderBarang/' + idBarang);
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
                    <div class="col-sm-6">
                      <label>Vendor</label>
                      <input id="vendor" type="text" value="${objBarang.vendor}" class="form-control" placeholder="Alasan">
                    </div>
                    <div class="col-sm-6">
                      <label>PR Number</label>
                      <input id="pr" type="number" value="${objBarang.pr}" class="form-control" placeholder="PR No. ...">
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
                  'pr': document.getElementById('pr').value
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
    async updateOrder(idBarang, objBarang) {
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
          console.log(typeof this.auth);
          
          if(this.auth === 'staff') {
          const {value: formValues} = await Swal.fire({
          title: 'Process Order',
          html:
          `
            <div class="text-justify">
              <div class="row">
                <div class="col-sm-6">
                  <h5>Nama Barang</h5>
                  <p class="text-justify">${objBarang.barang}.</p>
                </div>
                <div class="col-sm-6">
                  <h5>Type</h5>
                  <p class="text-justify">${objBarang.type}.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <h5>Line</h5>
                  <p class="text-justify">${objBarang.line}.</p>
                </div>
                <div class="col-sm-6">
                  <h5>Mesin</h5>
                  <p class="text-justify">${objBarang.mesin}.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <h5>Jumlah</h5>
                  <p class="text-justify">${objBarang.jumlah}.</p>
                </div>
                <div class="col-sm-6">
                  <h5>Order By</h5>
                  <p class="text-justify">${objBarang.orderBy}.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <h5>Alasan</h5>
                  <p class="text-justify">${objBarang.alasan}.</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <h5>Receive By</h5>
                  <input id="receiveBy" type="text" placeholder="Your Name..." value=""/>
                </div>
                <div class="col-sm-6">
                  <h5>Planning Arrived</h5>
                  <input id="planningArrived" type="date" value=""/>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <h5>Vendor</h5>
                  <input id="vendor" type="text" placeholder="Vendor Name ..."/>
                </div>
                <div class="col-sm-6">
                  <h5>PR Number</h5>
                  <input id="pr" type="number" placeholder="PR Number ..."/>
                </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          focusConfirm: false,
          preConfirm: () => {
            let userRef = db.ref('orderBarang/');
            console.log(document.getElementById('vendor').value);
            userRef.child(`${idBarang}`).update({
              'barang': `${objBarang.barang}`,
              'type': `${objBarang.type}`,
              'line': `${objBarang.line}`,
              'mesin': `${objBarang.mesin}`,
              'jumlah': `${objBarang.jumlah}`,
              'orderBy': `${objBarang.orderBy}`,
              'alasan': `${objBarang.alasan}`,
              'receiveBy': document.getElementById('receiveBy').value,
              'planningArrived': document.getElementById('planningArrived').value,
              'vendor': document.getElementById('vendor').value,
              'pr': document.getElementById('pr').value
            })
            return `
                Order ${objBarang.barang} Will be Processed!
              `
              }
            })
          }
        }
      })
    },
    async getAllBarang() {
      const load = await (() => {
        if(this.barangDB.length !== 0) {
          this.status = 'Memuat ...'
        }
      })
      this.token = localStorage.getItem('tokenMessage')
      const collect = await db.ref('orderBarang/').on('value', snapshoot => {
        let containerBarang = []
        this.barangDB = []
        if(snapshoot.val()) {
          Object.values(snapshoot.val()).forEach((itemBarang,i) => {
            if(itemBarang.planningArrived) {
              let planningDateStr = itemBarang.planningArrived.split('-')
              let planningDate = new Date(planningDateStr[0], planningDateStr[1]-1, +planningDateStr[2] , 23, 59, 59, 0)
              console.log('planning');
              console.log(JSON.stringify(planningDate));
              console.log('Now');
              console.log(JSON.stringify(new Date()));
              console.log(JSON.stringify(new Date()) < JSON.stringify(planningDate));
              // when Now > Planning ===> False (Delay)
              itemBarang.dateCond = JSON.stringify(new Date()) > JSON.stringify(planningDate)
            }
            itemBarang.id = Object.keys(snapshoot.val())[i]
            containerBarang.push(itemBarang)
          })
          this.barangDB = containerBarang
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
          html: `<a href="${this.urlImage}" target="_blank">${imageBarang}.jpg</a>`,
          imageUrl: `${this.urlImage}`,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: `${imageBarang}`,
          animation: false
        })
        }).catch(function(error) {
          console.log('error');
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              return Swal.fire(
                'Tidak Ada Gambar',
                `${error.code}`,
                'error'
              )
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
              // console.log('masuk');
              break;
          }
        });
      } else {
        
      }
    }
  },
  mounted() {
    this.getAllBarang()
  },
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
.blinking{
    animation:blinkingText 0.8s infinite;
}
@keyframes blinkingText{
    0%{     color: #ff0000;    }
    49%{    color: transparent; }
    50%{    color: transparent; }
    99%{    color:transparent;  }
    100%{   color: #ff0000;    }
}
</style>
