<template>
  <div class="about">
    <van-button type="info" szie="mini" @click="show = true">按钮</van-button>
    <gdMap v-model="show" :btnTop="10"></gdMap>
  </div>
</template>
<script>
import gdMap from '../components/gdMap.vue'
export default{
  components: {
    gdMap
  },
  data(){
    return {
      show: false
    }
  },
  mounted(){
    const arr = [{key: 'aaa', value: 1}, {key: 'bbb', value: 2}]
    console.log(this.getObj(arr), 'obj')
  },
  methods: {
    getObj(arr){
        let obj = {}
        arr.forEach(i=> obj[i.key] = i.value)
        return obj
      }
  }
}
</script>
