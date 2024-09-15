<template>
  <view v-if="loading">
    <view class="total" v-if="dataList.length != 0">
      <view v-for="item in dataList" :key="item.id" class="list" @click="changtToDetail(item)">
        地址：{{ item.detailedAddress }}
      </view>
    </view>
    <view
      class="content"
      v-else
      style="display: flex; align-items: center; justify-content: center; margin-top: 40%"
    >
      <image src="../../static/images/none.png" style="height: 600rpx; width: 400rpx"></image>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getWaitLogisticAPI } from '@/services/logistics'
import { useMemberStore } from '@/stores'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const loading = ref(false)

onLoad(() => {
  getWaitLogistic()
})
//页面返回刷新数据
onShow(() => {
  getWaitLogistic()
})
const dataList = ref<any>([])

let list1: any = []
const getWaitLogistic = async () => {
  loading.value = false
  uni.showLoading({ mask: true })
  const data = { state: 30, shopInfoId: useMemberStore().profile.shopInfoId }
  const result: any = await getWaitLogisticAPI(data)
  if (result.code == 200) {
    list1 = result.data.list.filter(
      (item: { deliveryMode: number; detailedAddress: string }) =>
        item.deliveryMode == 1 && item.detailedAddress,
    )
    dataList.value = list1
  }
  uni.hideLoading()
  loading.value = true
}

const changtToDetail = (data: any) => {
  const list = dataList.value.filter(
    (item: { detailedAddress: string }) => item.detailedAddress == data.detailedAddress,
  )
  uni.navigateTo({
    url:
      '/pages/logisticDetail/logisticDetail?list=' +
      encodeURIComponent(JSON.stringify(list)) +
      '&id=' +
      data.list.shopInfoId +
      '&data=' +
      encodeURIComponent(JSON.stringify(data)),
  })
}
</script>

<style lang="scss">
.total {
  position: absolute;
  width: 100%;
  background: #f3f5f4;
  min-height: 100%;

  .list {
    margin: 0 auto;
    border-radius: 20rpx;
    background: #ffffff;
    width: 600rpx;
    height: 80rpx;
    margin-top: 40rpx;
    padding: 20rpx;

    text {
      display: block;
      padding: 20rpx;
    }
  }
}

.content {
  margin-top: 40rpx;
  margin: 0rpx 25rpx;
}
</style>
