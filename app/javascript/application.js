// Entry point for the build script in your package.json
import Vue from 'vue'
import App from './App.vue'

const drum_machine_el = document.getElementById('drum_machine')

if (drum_machine_el) {
  new Vue({
    render: h => h(App),
    el: drum_machine_el,
    data: {
      message: 'Hello Vue!'
    },
    mounted() {
      console.log('mounted')
    }
  })
}