<template>
  <view class="bg-top">
    <view class="search">
      <view class="search_input" @click="selectCity">
        <view class="address">
          <u-icon width="28rpx" height="28rpx" name="../../../../static/home/address.png"></u-icon>
          <text class="address_text">{{ address }}</text>
          <u-icon width="16rpx" height="16rpx" name="../../../../static/home/dropDown.png"></u-icon>
        </view>
        <view class="line"></view>
        <input type="text" v-model="search" class="input" />
      </view>
    </view>
  </view>
  <!--  <view class="select">
    <uni-data-select v-model="select1" :localdata="selectData1" @change="changeSelect1" placeholder="请选择"
      style="width: 33%; text-align: center" :clear="true"></uni-data-select>
    <uni-data-select v-model="select2" :localdata="selectData2" @change="changeSelect2" placeholder="请选择"
      style="width: 33%; text-align: center" :clear="true"></uni-data-select>
    <uni-data-select v-model="select3" :localdata="selectData3" @change="changeSelect3" placeholder="请选择"
      style="width: 33%; text-align: center" :clear="true"></uni-data-select>
  </view> -->
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import { onShow } from '@dcloudio/uni-app'
const address = ref('')

onShow(() => {
  address.value = uni.getStorageSync('address').name
})

const selectCity = () => {
  uni.chooseLocation({
    type: 'gcj02',
    geocode: true,
    success: (res) => {
      uni.setStorageSync('address', {
        latitude: res.latitude,
        longitude: res.longitude,
        name: res.name,
        address: res.address,
      })
    },
    fail: (err) => {
      console.log(err)
    },
  })
}

let search: string = ''

let select1: any = ref()

let selectData1: any = [
  { value: 0, text: '哈哈' },
  { value: 1, text: '足球' },
  { value: 2, text: '游泳' },
]

let select2: any = ref()
let selectData2: any = [
  { value: 0, text: '哈哈' },
  { value: 1, text: '足球' },
  { value: 2, text: '游泳' },
]

let select3: any = ref()
let selectData3: any = [
  { value: 0, text: '哈哈' },
  { value: 1, text: '足球' },
  { value: 2, text: '游泳' },
]

const emit = defineEmits(['select'])

const selectList = ['', '', '']

const changeSelect1 = (e: any) => {
  if (typeof e == 'string') {
    select1.value = null
  }
  selectList[0] = confirmValue(select1.value, selectData1)
  emit('select', selectList)
}
const changeSelect2 = (e: any) => {
  if (typeof e == 'string') {
    select2.value = null
  }
  selectList[1] = confirmValue(select2.value, selectData2)
  emit('select', selectList)
}
const changeSelect3 = (e: any) => {
  if (typeof e == 'string') {
    select3.value = null
  }
  selectList[2] = confirmValue(select3.value, selectData3)
  emit('select', selectList)
}

const confirmValue = (value: number, data: any) => {
  if (value == null || value == undefined) {
    return ''
  }
  for (let key in data) {
    if (data[key].value == value) {
      return data[key].text
    }
  }
  return ''
}
</script>

<style lang="scss">
.bg-top {
  z-index: -1;
  width: 750rpx;
  height: 160rpx;
  background-color: #01b575;

  .search {
    padding-top: 42rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .search_input {
      width: 624rpx;
      height: 64rpx;
      background: #ffffff;
      border-radius: 200rpx 200rpx 200rpx 200rpx;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .address {
        margin-left: 20rpx;
        display: flex;

        .address_text {
          height: 34rpx;
          font-size: 24rpx;
          font-family: PingFang TC-Medium, PingFang TC;
          font-weight: 500;
          white-space: nowrap;
          color: #090909;
          margin: 0 2rpx;
        }
      }

      .line {
        width: 0rpx;
        height: 21rpx;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        margin: 0 10rpx;
        opacity: 1;
        border: 1rpx solid #999999;
      }

      .input {
        width: 70%;
      }
    }
  }
}

.select {
  display: flex;
}
</style>
