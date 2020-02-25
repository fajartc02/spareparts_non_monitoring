<template>
  <div>
    <div class="input-group-prepend">
      <input type="file" placeholder="select your file" id="files">
      <button type="button" @click="uploadFile">Upload</button>
    </div>
    <div class="progress">
      <div class="progress-bar text-dark" role="progressbar" :style="`width:${progress}%`" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">{{progress}}%</div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Swal from 'sweetalert2'
export default {
  name: 'upload',
  data() {
    return {
      progress: '0',
      fileName: ''
    }
  },
  methods: {
    uploadFile() {
      var storageRef = firebase.storage().ref();
      var file = document.getElementById("files").files[0];
      // console.log(file);
      console.log(this.propsNameImage);
      
      var thisRef = storageRef.child(this.propsNameImage);
      this.onHandleFileName(file.name)
      thisRef.put(file).then((snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.progress = `${progress}`
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
        if(this.progress === '100') {
          // this.progress = '0'
          Swal.fire(
            'File Sudah Terupload',
            `Foto: ${file.name}`,
            'success'
          )
        }
        // console.log(`Foto ${file.name} sudah di upload`);
      });
    },
    onHandleFileName(event) {
      this.$emit('file-name-emit', event)
    }
  },
  props: {
    propsNameImage: String
  }
}
</script>

<style>

</style>
