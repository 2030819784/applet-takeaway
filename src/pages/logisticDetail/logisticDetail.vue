<template>
  <view class="total">
    <view v-for="item in list" :key="item.id" class="list">
      <text class="name">商品名称：{{ item.list.goodName }}</text>
      <text class="name">商品数量：{{ item.number }}</text>
      <text class="name">订单编号：{{ item.orderNo }}</text>
    </view>
    <view class="bottom">
      <button @click="place">物流下单</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useMapStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { logisticPlaceAPI, getAddressAPI } from '@/services/logistics'
const list = ref<any>([])

const mapStpre = useMapStore()
onLoad((option) => {
  list.value = JSON.parse(decodeURIComponent(option!.list))
  const data = JSON.parse(decodeURIComponent(option!.data))
  message2.address = data.detailedAddress
  message2.contact = data.contacts
  message2.mobile = data.phone
  getAddress(option!.id)
  message1.address = mapStpre.address
})

//寄件方信息
const message1 = {
  address: '',
  contact: '',
  contactType: 1, //寄件方
  mobile: '',
}
//到件方
const message2 = {
  address: '',
  contact: '',
  contactType: 2, //到件方
  mobile: '',
}

const getAddress = async (id: number) => {
  const result: any = await getAddressAPI(id)
  if (result.code == 200) {
    message1.contact = result.data.contacts
    message1.mobile = result.data.phone
  }
}

const place = async () => {
  const goodsNameList: any = []
  const orderNoList: string[] = []
  for (let key in list.value) {
    goodsNameList.push({ name: list.value[key].list.goodName })
    orderNoList.push(list.value[key].orderNo)
  }
  const data = {
    cargoDetails: goodsNameList,
    contactInfoList: [{ ...message1 }, { ...message2 }],
    language: 'zh-CN',
    orderNoList,
  }
  const result: any = await logisticPlaceAPI(data)
  if (result.code == 200) {
    uni.showToast({
      icon: 'success',
      title: result.msg,
      mask: true,
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } else {
    uni.showToast({
      icon: 'error',
      title: result.msg,
    })
  }
}
</script>

<style lang="scss">
.total {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background: #f3f5f4;

  .list {
    margin: 0 auto;
    border-radius: 20rpx;
    background: #ffffff;
    width: 600rpx;
    margin-top: 20rpx;

    .name {
      display: block;
      padding: 10rpx;
    }
  }

  .bottom {
    background-color: white;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    height: 100rpx;
    border-radius: 20rpx 20rpx 0 0;
    justify-content: center;
    align-items: center;

    button {
      position: relative;
      left: 200rpx;
      background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
      border-radius: 40rpx;
      width: 240rpx;
      height: 70rpx;
      text-align: center;
      line-height: 70rpx;
      color: white;
      font-size: 0.9rem;
    }
  }
}
</style>
