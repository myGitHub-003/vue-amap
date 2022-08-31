<template>
  <div>
    <van-popup v-model="value" position="bottom">
      <div class="bg-out">
          <div class="top-button" :style="{'padding-top': btnTop + 'px'}">
            <van-button type="info" style="pointer-events: all;" size="small" plain @click.stop="$emit('change', false)">取消</van-button>
            <van-button type="info" style="pointer-events: all;" size="small" @click.stop="confirm">确认</van-button>
          </div>
          <!--  -->
          <div class="amap-loading" v-if="mapLoading">
            <van-loading />
          </div>
          <!--  -->
          <el-amap
            class="amap-box"  
            :vid="'amap-vue'"
            :amap-manager="amapManager"
            :zoom="zoom"
            :center="center"
            :events="events">
            <el-amap-marker
            :position="center"
            :events="marker"
          />
        </el-amap>
        <!-- <div> -->
          <van-search
              v-model.trim="searchData.keywords"
              background="#fff"
              placeholder="请搜索名称"
            />
            <div class="listClass">
              <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                  <div v-for="(item, index) in options" :key="index" class="itemClass" @click="onFinish(item)">
                    <div>
                      {{item.name}}
                      <div class="addresClass">{{item.address}}</div>
                    </div>
                    <div v-show="item.type == 2">✓</div>
                  </div>
              </van-list>
          </div>
        <!-- </div> -->
      </div>
    </van-popup>
  </div>
</template>
<script>
import axios from 'axios'
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap';
const amapManager = new AMapManager();
// 截留函数
const delay = (() => {
  let timer = null
  return (callback, ms) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
export default{
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    btnTop: {
      type: Number,
      default: 10
    }
  },
  data(){
    const that = this
    return{
      map: null,
      mapLoading: false,
      loading: true,
      finished: true,
      options: [],
      zoom: 18, // 缩放
      center: [121.59996, 31.197646], // 居中
      amapManager,
      events: {
        init() {
          that.mapLoading = true
          lazyAMapApiLoaderInstance.load().then(() => {
            that.initMap()
          })
        },
        click(e){
          that.markerClick(e)
        }
      },
      marker: {
        click(e){
          that.markerClick(e)
        }
      },
      searchData: {
        keywords: '',
        page_size: 10, // 分页条数
        page_num: 0 // 分页页数
      },
      itemObj: {}
    }
  },
   watch: {
    'searchData.keywords'() {
      delay(() => {
        this.getiptseach()
      }, 300)
    }
  },
  mounted(){
  },
  methods: {
    // 确认
    confirm(){
      this.$emit('change', false)
    },
    // 初始化 获取地图实例
    initMap(){
      this.mapLoading = false
      this.map = amapManager.getMap() // 获取地图实例
    },
    // 事件
    markerClick(e){
      this.center = [e.lnglat.lng, e.lnglat.lat]
      this.getAddress(e.lnglat.lng, e.lnglat.lat)
    },
    // 根据经纬度 逆向解析地址
    getAddress(lng, lat) {
      axios.get(`https://restapi.amap.com/v3/geocode/regeo?key=363576ee97cbaace02c25af9173790c5&location=${lng}, ${lat}`).then(res => {
        if (res.data.status == '1') {
          const obj = res.data.regeocode
          this.itemObj = obj
          console.log(res.data.regeocode, 'res');
        }
      })
    },
     getiptseach() {
      this.searchData.page_num = 0
      this.loading = true
      this.finished = false
      this.options = []
      this.onLoad()
    },
    onLoad() {
      this.searchData.page_num += 1
      this.getHotel()
    },
    // 获取酒店名称
    getHotel() {
      if (!this.searchData.keywords) {
        this.options = []
        this.loading = true
        this.finished = true
        this.searchData.page_num = 0
        return false
      }
      const obj = this.searchData
      axios.get(`https://restapi.amap.com/v5/place/text?key=363576ee97cbaace02c25af9173790c5&keywords=${obj.keywords}&city=${obj.city}&citylimit=true&page_size=30&page_num=${obj.page_num}`).then(res => {
        if (res.data.status == '1') {
          res.data.pois.map((v, index) => {
            v.type = index == 0 ? 2 : 1
            this.options.push(v)
          })
          this.map.center = res.data.pois.length > 0 ? res.data.pois[0].location.split(',') : this.map.center
          this.loading = false
          if (res.data.pois.length < 10) {
            this.finished = true
          }
        }
      })
    },
    // 搜索
    onFinish(row) {
      console.log(row)
      this.itemObj = JSON.parse(JSON.stringify(row))
      this.map.center = row.location.split(',')
      this.options.forEach(v => {
        v.type = 1
        if (v.id == row.id) {
          v.type = 2
        }
      })
    }
  }
}
</script>
<style scoped>
.bg-out{
  width: 100%;
  height: 100vh;
  position: relative;
}
.top-button{
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  z-index: 9999;
  pointer-events: none;
}
.amap-loading{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.amap-box{
  width: 100%;
  height: 500px;
}
.listClass{
  box-sizing: border-box;
  padding: 0 .6rem;
  height: calc(100vh - 630px);
  overflow-y: auto;
  margin-top: 20px;
}
.itemClass{
  width: 100%;
  font-size: 24px;
  margin-bottom: 30px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.addresClass{
  font-size: 20px;
  color: #aaa;
}
/* 去掉 地图 logo */
::v-deep .amap-logo {
  display: none;
  opacity: 0 !important;
}
::v-deep .amap-copyright {
  opacity: 0;
}
</style>