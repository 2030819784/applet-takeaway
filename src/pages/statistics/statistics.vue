<template>
  <!-- <SelectCity @select="getSelectOption"></SelectCity> -->
  <view class="content">
    <map
      :id="mapId"
      style="width: 100%; height: 100vh"
      :show-location="true"
      :latitude="selfCoordinate.latitude"
      :markers="addressList"
      :longitude="selfCoordinate.longitude"
      @markertap="markertap"
      @callouttap="callouttap"
      @regionchange="regionchange"
      :min-scale="minScale"
      :max-scale="maxScale"
    >
    </map>
  </view>
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import QQMapWX from '../../utils/javaSDK/qqmap-wx-jssdk.js'
import { sendCityDataAPI, getCityDataListAPI } from '@/services/statistics'
import { ref } from 'vue'
const mapsdk = new QQMapWX({ key: 'W7BBZ-GG66T-P36XE-L6LFR-UVPRF-RCBOU' })
const mapId = 1
const minScale = 3
const maxScale = 13
var content: any = {}
const selfCoordinate = uni.getStorageSync('address')
onReady(() => {
  content = uni.createMapContext('mapId', this)
  reverseGeocoder(selfCoordinate.latitude, selfCoordinate.longitude, 13)
})

let list: any = []

const getCityList = () => {
  mapsdk.getCityList({
    success: function (res: any) {
      //成功后的回调

      const list1 = res.result[0]
      const list2 = res.result[1]
      const list3 = res.result[2]

      for (let key in list1) {
        list1[key].pId = 0
        list1[key].areaCode = list1[key].id
        list1[key].name = list1[key].fullname
        list1[key].latitude = list1[key].location.lat
        list1[key].longitude = list1[key].location.lng

        disposeData(parseInt(list1[key].id), list1[key].cidx[0], list1[key].cidx[1], list2)
        delete list1[key].id
      }

      for (let key in list2) {
        list2[key].areaCode = list2[key].id
        list2[key].name = list2[key].fullname
        list2[key].latitude = list2[key].location.lat
        list2[key].longitude = list2[key].location.lng

        if (list2[key].cidx) {
          disposeData(parseInt(list2[key].id), list2[key].cidx[0], list2[key].cidx[1], list3)
        }
        delete list2[key].id
      }
      for (let key in list3) {
        list3[key].areaCode = list3[key].id
        list3[key].name = list3[key].fullname
        list3[key].latitude = list3[key].location.lat
        list3[key].longitude = list3[key].location.lng
        delete list3[key].id
      }

      list = list1.concat(list2).concat(list3)
      sendCityData()
    },
    fail: function (error: any) {
      console.error(error)
    },
    // complete: function (res : any) {
    // 	console.log(res);
    // }
  })
}

const sendCityData = async () => {
  const result = await sendCityDataAPI(list)
}

const disposeData = (pId: number, startIndex: number, endIndex: number, list: any) => {
  for (let key = startIndex; key <= endIndex; key++) {
    list[key].pId = pId
  }
}

//获取详细数据
const getChildrenCity = (id: number) => {
  mapsdk.getDistrictByCityId({
    id,
    success: (res: any) => {
      console.log(res)
    },
    fail: (msg: any) => {
      console.log(msg)
    },
  })
}
//存储上一次点击点的位置
let lastAddress: any = {
  city: '',
  district: '',
  province: '',
  scale: 13,
  change: false,
}
//逆地址解析
const reverseGeocoder = (latitude: number, longitude: number, scale: number) => {
  const data = {
    location: {
      latitude,
      longitude,
    },
    get_poi: 1,
  }
  mapsdk.reverseGeocoder({
    ...data,
    success: (res: any) => {
      const data = {
        scale,
        province: res.result.address_component.province,
        city: res.result.address_component.city,
        district: res.result.address_component.district,
      }
      //判断是不是第一次调用
      if (lastAddress.change == false) {
        Object.assign(lastAddress, res.result.address_component)
        lastAddress.change = true
        getCityDataList(data)
      } else {
        //判断缩放级别区间是否发生改变
        if (judgementScale(lastAddress.scale, res.scale) == false) {
          getCityDataList(data)
          Object.assign(lastAddress, res.result.address_component)
        } else {
          //判断省市区位置是否发生改变
          if (judgementAddress(lastAddress, data) == false) {
            getCityDataList(data)
            Object.assign(lastAddress, res.result.address_component)
          }
        }
      }
    },

    fail: (err: any) => {
      console.log(err)
    },
  })
}

//地图标记点点击事件
const markertap = (e: any) => {
  console.log(e)
}
//地图标签点击事件
const callouttap = (e: any) => {
  console.log(e)
}

//rotate:旋转角度
//skew:倾斜角度

//地图视野移动时触发
const regionchange = (e: any) => {
  if (e.type == 'end') {
    const data = e.detail.centerLocation
    reverseGeocoder(data.latitude, data.longitude, e.detail.scale)
  }
}

//判断缩放级别是否发生改变
const judgementScale = (scale1: number, scale2: number) => {
  if (scale1 <= 5.5 && scale2 <= 5.5) {
    return true
  } else if (scale1 <= 7.5 && scale2 <= 7.5) {
    return true
  } else if (scale1 <= 13 && scale2 <= 13) {
    return true
  } else {
    return false
  }
}
//判断地址是否发生改变
const judgementAddress = (address1: any, address2: any) => {
  if (
    address1.province + address1.city + address1.district ==
    address2.province + address2.city + address2.district
  ) {
    return true
  } else {
    return false
  }
}

//获取城市列表
const getCityDataList = async (data: any) => {
  const result: any = await getCityDataListAPI(data)
  if (result.code == 200) {
    for (let key in result.data) {
      Object.assign(result.data[key], JSON.parse(JSON.stringify(mapMessage)))
      result.data[key].id = key
      result.data[key].callout.content =
        result.data[key].name +
        ': ' +
        result.data[key].drugPeople +
        '/' +
        result.data[key].totalPeople
    }
    addressList.value = result.data
  }
}

const addressList = ref([])

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
</script>

<style lang="scss"></style>
