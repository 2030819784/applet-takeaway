<template>
  <view class="invoiceDetail" v-if="selectInvoice.attachments">
    <view class="name">
      <text>发票名称：{{ selectInvoice.invoiceTitle || '无' }}</text>
    </view>
    <view class="name">
      <text>发票内容：{{ selectInvoice.content || '无' }}</text>
    </view>
    <view class="name">
      <text>发票代码：{{ selectInvoice.code || '无' }}</text>
    </view>
    <view class="name">
      <text>发票号码：{{ selectInvoice.invoiceNumber || '无' }}</text>
    </view>
    <view class="name">
      <text>详情：</text>
      <view class="imgList">
        <image
          v-for="item in selectInvoice.attachments"
          :key="item.id"
          :src="item.objName"
          @click="previewImage(item.id, selectInvoice.attachments)"
        ></image>
      </view>
    </view>
  </view>
  <view class="invoiceDetail" v-else>
    <view class="name">
      <text>暂无发票信息</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getOrderInvoiceDetailAPI } from '@/services/receipt'
var selectInvoice: any = ref({})

let time = ref()
onLoad(async (options: any) => {
  const result: any = await getOrderInvoiceDetailAPI(options!.orderId)
  if (result.code == 200) {
    selectInvoice.value = result.data
    uni.showToast({
      icon: 'success',
      title: result.msg,
    })
  }
})

const previewImage = (id: string, list: any[]) => {
  const imgList = list.map((item) => {
    item.objName = 'data:image/jpeg/png;base64,' + item.objName
    return item.objName
  })
  uni.previewImage({
    current: id,
    urls: imgList,
  })
}
</script>

<style lang="scss">
.invoiceDetail {
  margin: 20rpx 20rpx;

  .falback {
    margin-bottom: 30rpx;
    position: relative;
    bottom: 10rpx;
    z-index: 1;
  }

  .time {
    font-size: 40rpx;
    margin-bottom: 40rpx;
  }

  .name {
    font-size: 40rpx;
    margin-bottom: 40rpx;

    .imgList {
      display: flex;
      flex-wrap: wrap;

      image {
        border-radius: 20rpx;
        width: 230rpx;
        height: 300rpx;
        margin: 50rpx;
      }
    }
  }
}
</style>
