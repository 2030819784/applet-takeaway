<template>
  <!-- <SelectCity @select="getSelectOption"></SelectCity> -->
  <view class="content">
    <map
      :mapId="mapId"
      style="width: 100%; height: 100vh"
      :show-location="true"
      :latitude="selfCoordinate.latitude"
      :markers="addressList"
      :longitude="selfCoordinate.longitude"
      @markertap="markertap"
      @callouttap="callouttap"
    >
    </map>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import QQMapWX from '../../utils/javaSDK/qqmap-wx-jssdk.js'
const mapsdk = new QQMapWX({ key: 'W7BBZ-GG66T-P36XE-L6LFR-UVPRF-RCBOU' })
const mapId = 2
const addressList = ref<any>([])
const mapMessage = {
  width: 20, //宽
  height: 30, //高
  alpha: 0.5, //透明度
  callout: {
    content: '', //文本
    color: '#ffffff', //文字颜色
    fontSize: 14, //文本大小
    borderRadius: 15, //边框圆角
    borderWidth: '10',
    bgColor: '#3BCE7D', //背景颜色
    display: 'ALWAYS', //常显
  },
}
onLoad((options) => {
  const list = JSON.parse(decodeURIComponent(options!.addressList))
  const id = options!.id
  for (let key in list) {
    const data = Object.assign(list[key], JSON.parse(JSON.stringify(mapMessage)))
    if (data.id == id) {
      data.callout.bgColor = '#e51860' //背景颜色改变了,但没有生效
      selfCoordinate.latitude = data.shopLatitude
      selfCoordinate.longitude = data.shopLongitude
    }
    data.markerId = parseInt(key) + 1
    data.longitude = data.shopLongitude
    data.latitude = data.shopLatitude
    data.callout.content = data.name
    addressList.value.push(data)
  }
})
//下拉框选择事件
// const getSelectOption = (list : []) => {
// 	//后续请求
// 	console.log(list)
// }

const selfCoordinate = {
  latitude: null,
  longitude: null,
}

//地图标记点点击事件
const markertap = (e: any) => {
  changeToDetail(e.markerId)
}
//地图标签点击事件
const callouttap = (e: any) => {
  changeToDetail(e.markerId)
}

const changeToDetail = (id: number) => {
  for (let key in addressList.value) {
    if (addressList.value[key].id == id) {
      uni.navigateTo({
        url:
          '/pages/shops/shops?item=' +
          id +
          '&name=' +
          JSON.stringify(addressList.value[key].name) +
          '&detailedAddress=' +
          encodeURIComponent(JSON.stringify(addressList.value[key].detailedAddress)),
      })
    }
  }
}
</script>

<style lang="scss"></style>
