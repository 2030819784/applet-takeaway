<template>
  <view v-if="user">
    <!-- 订单管理-->
    <PageNavbar></PageNavbar>
    <view class="bg-top"></view>
    <view class="content">
      <view class="orderForm_tabs">
        <u-sticky>
          <u-tabs :list="tabsList" lineWidth="24" lineHight="6" lineColor="#fff" :activeStyle="{
            color: '#ffffff',
            fontWeight: '500',
            fontFamily: 'PingFang HK-Medium, PingFang HK',
            fontSize: '32rpx',
          }" :itemStyle="{
            paddingLeft: '15px',
            paddingRight: '15px',
            height: '64px',
            fontSize: '44rpx',
          }" :inactiveStyle="{ color: '#ffffff', fontWeight: '400', fontSize: '28rpx' }" :current="current"
            @change="changeCurrent"></u-tabs>
        </u-sticky>
      </view>
      <view>
        <view v-if="orderList?.length == 0">
          <u-empty mode="order"></u-empty>
        </view>
        <view class="orderForm_box" v-for="i in orderList" :key="i.id" @click="changeToOrderInfo(i)">
          <view class="orderForm_box1">
            <text>总数量：{{ i.totalNumber }}</text>
            <text>总价：￥{{ i.totalPrice }}</text>
            <text :style="{ color: i.status === 0 ? 'red' : '#01b575' }">{{ map.get(i.status) }}</text>
          </view>
          <view class="orderForm_box2" v-for="item in i.orderListDetailList" :key="item.id">
            <view class="item">
              <text style="padding-right: 24rpx">名称:</text>
              <text> {{ item.name }}</text>
            </view>
            <view class="item">
              <text style="padding-right: 24rpx">数量:</text>
              <text> {{ item.number }}</text>
            </view>
            <view class="item">
              <text style="padding-right: 24rpx">单价:</text>
              <text>￥{{ item.price }}</text>
            </view>
          </view>
          <view style="width: 100%;display: flex;">
            <view v-if="isShowComplete && current === 2" @click="openCompleteDialog(i.id)"
              style="flex: 1;height: 40rpx;text-align: left; margin-top: 20rpx;color: green;">
              制作完成
            </view>
            <view v-if="i.status === 1" @click="editAddress(i)"
              style="flex: 1;height: 40rpx;text-align: right; margin-top: 20rpx;color: red;">
              修改地址
            </view>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="alertDialog" type="dialog" :maskClick='false'>
      <view
        style="width: 600rpx;background: white;border-radius: 40rpx;display: flex;flex-direction: column;align-items: center;">
        <text style="display: block;margin: 140rpx;font-size: 22px;white-space: nowrap">{{ deliveryFee }}</text>
        <view style="display: flex;justify-content: space-around;width: 100%;">
          <button
            style="background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);flex: 1;border-radius: 0 0 40rpx 40rpx; color: white;"
            @click="addOrder">确认</button>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="completeDialog" type="dialog">
      <uni-popup-dialog confirmText="确认" content="确认制作完成吗?" @confirm="complete"></uni-popup-dialog>
    </uni-popup>


  </view>
</template>

<script setup lang="ts">
import PageNavbar from './PageNavbar.vue'
import { completeGoodsAPI, getuserOrderListAPI, paymentAPI, updateOrderAPI } from '@/services/order'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
//用户类型
const user = uni.getStorageSync('user')
const isShowComplete = ref(user.roles.some((item: any) => item.name === 'shoper'))

const tabsList = ref()
const current = ref(0)
//普通用户 商家
const tabsList1 = [
  {
    name: '全部',
  },
  {
    state: 'WFK',
    name: '未付款',
    status: 0,
  },
  {
    state: 'ZZZ',
    name: '制作中',
    status: 1,
  },
  {
    state: 'ZZWC',
    name: '制作完成',
    status: 2,
  },
  {
    state: 'PSZ',
    name: '配送中',
    status: 3,
  },
  {
    state: 'YSD',
    name: '已送达',
    status: 4,
  },
  {
    state: 'YWC',
    name: '已完成',
    status: 5,
  },
  {
    state: 'DDQX',
    name: '订单取消',
    status: 6,
  },
]



const map = new Map([
  [0, '未付款'],
  [1, '制作中'],
  [2, '制作完成'],
  [3, '配送中'],
  [4, '已送达'],
  [5, '已完成'],
  [6, '订单取消'],
])
//根据用户权限判断tab
const select = () => {
  if (user.roles.length === 1 && user.roles[0].name === 'rider')
    tabsList.value = tabsList1.filter((item) => item.status === 0)
  else tabsList.value = tabsList1
}

const editAddress = (data: any) => {
  uni.setStorageSync('editOrder', data)
  uni.navigateTo({
    url: '/pages/address/index'
  })
}


const deliveryFee = ref('本次需付款')

onShow(() => {
  if (!user) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  }
  select()
  const status = uni.getStorageSync('orderStatus')

  if (status) {
    current.value = status
    changeSelect(status)
    getuserOrderList(status)
    uni.removeStorageSync('orderStatus')
  }

  else {
    current.value = 0
    getuserOrderList()
  }

  const data = uni.getStorageSync('editOrder')
  if (data && data.deliveryFee) {
    if (data.deliveryFee) {
      if (data.deliveryFee == 0) {
        uni.removeStorageSync('editOrder')
      }
      else {
        deliveryFee.value = '本次需付款' + data.deliveryFee + '元'
        updateOrderAddress({
          "addressId": data.addressListDTO.id,
          "deliveryFee": data.deliveryFee,
          "orderId": data.id
        })

      }
    }
    else {
      uni.removeStorageSync('editOrder')
    }
  }
})
//控制付费弹出框
const alertDialog = ref()

const completeDialog = ref()

//完成制作的订单id
const orderId = ref()

const openCompleteDialog = (id: string) => {
  orderId.value = id
  completeDialog.value.open()
}


// 更改地址
const updateOrderAddress = async (data: any) => {
  const res: any = await updateOrderAPI(data)
  if (res.code == 200) {
    alertDialog.value.open()
  }
  else {
    uni.showToast({
      icon: 'error',
      title: res.msg
    })
  }
}

const addOrder = async () => {
  const data = uni.getStorageSync('editOrder')
  const result: any = await paymentAPI(data.id)
  if (result.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '付款成功',
    })
    uni.removeStorageSync('editOrder')
    alertDialog.value.close()
  } else {
    uni.showToast({
      title: result.msg,
      icon: 'error'
    })
  }

}

const complete = async () => {
  const result: any = await completeGoodsAPI(orderId.value)
  if (result.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '状态变更成功',
    })
    getuserOrderList(1)
  } else {
    uni.showToast({
      title: result.msg,
      icon: 'error'
    })
  }
}

//切换订单状态
const changeCurrent = (item: any) => {
  current.value = item.status + 1
  getuserOrderList(item.status)
}
let orderList = ref()
//订单列表
const getuserOrderList = async (status?: number) => {
  const result: any = await getuserOrderListAPI(status)
  if (result.code === 200) orderList.value = result.data
}
const changeToOrderInfo = (item: any) => {
  if (item.status === 0) {
    uni.navigateTo({
      url: '/pages/waitOrder/waitOrder?item=' + encodeURIComponent(JSON.stringify(item))
    })
  }
}

const changeSelect = (status: string) => {
  tabsList.value.forEach((item: any, index: number) => {
    if (item.status === status) {
      current.value = index
      return
    }
  });
}

</script>
<style lang="scss" scoped>
.bg-top {
  position: absolute;
  z-index: -1;
  width: 750rpx;
  height: 120rpx;
  border-bottom-right-radius: 25rpx;
  border-bottom-left-radius: 25rpx;
  background-color: #01b575;
}

.content {
  margin-top: 40rpx;
  margin: 0rpx 25rpx;

  .orderForm_tabs {
    font-size: 32rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #ffffff;
    line-height: 38rpx;
  }

  .orderForm_box {
    margin: 24rpx;
    padding: 24rpx;
    background: #e5fdf5;
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #000000;

    .orderForm_box1 {
      padding: 24rpx;

      text {
        font-size: 32rpx;
        font-family: PingFang HK-Medium, PingFang HK;
        font-weight: 500;
        color: #000000;
        padding-left: 24rpx;
      }
    }

    .orderForm_box2 {
      padding-left: 24rpx;
      background: rgb(210, 235, 245);
      border-radius: 32rpx;

      .item {
        padding-top: 24rpx;
        border-radius: 32rpx 32rpx 32rpx 32rpx;
      }

      .item:last-child {
        padding-bottom: 24rpx;
      }
    }
  }
}
</style>
