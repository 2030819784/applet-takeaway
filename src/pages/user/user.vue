<template>
  <scroll-view enable-back-to-top class="viewport" scroll-y>
    <view class="profile">
      <view class="overview">
        <view class="meta">
          <view class="nickname">
            {{ memberStore.profile.nickName }}
          </view>
          <view>
            <view class="userTypes">
              <view v-for="(item, index) in memberStore.profile.roles" :key="index" class="userType">{{ item.description
                }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 我的订单 -->
    <view class="orders">
      <view class="title">
        订单中心
        <view class="navigator" @click="changeToOrderPage">
          全部订单<text class="icon-right"></text>
        </view>
      </view>
      <!-- 订单 -->
      <view class="section">
        <view v-for="item in list1" :key="item.state" class="navigator" hover-class="none"
          @click="changeToOrderStatus(item)">
          <u-icon :name="item.icon" size="56rpx" class="section_icon"></u-icon>
          <text class="section_text">{{ item.text }}</text>
        </view>
      </view>
    </view>
    <!-- 其他应用 -->
    <view class="others" v-if="list2.length != 0">
      <view>管理</view>
      <view v-for="item in list2" :key="item.state" class="navigator" hover-class="none">
        <view class="other" @click="changeToOtherPage(item)">
          <u-icon :name="item.icon" size="56rpx" class="others_icon"></u-icon>
          <text class="others_text">{{ item.text }}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { useMemberStore, } from '@/stores'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const others = [
  { state: 0, text: '成为骑手', icon: '/static/user/manage.png' },
  { state: 1, text: '入驻平台', icon: '/static/user/manage.png' },
]

const map = new Map([
  [
    'user',
    {
      text: '用户',
      orderTypes: [
        { state: 0, text: '未付款', icon: '/static/user/toBePaid.png', status: 0 },
        { state: 1, text: '配送中', icon: '/static/user/payment.png', status: 2 },
        { state: 2, text: '已完成', icon: '/static/user/complete.png', status: 4 },
        { state: 3, text: '已取消', icon: '/static/user/complete.png', status: 5 },
      ],
    }],
  [
    'rider',
    {
      text: '骑手',
      orderTypes: [
        { state: 4, text: '配送中', icon: '/static/rider/payment.png', status: 2 },
        { state: 5, text: '已送达', icon: '/static/rider/complete.png', status: 3 },
        { state: 6, text: '已取消', icon: '/static/user/complete.png', status: 5 },
      ],
    }],
  [
    'shoper', {
      text: '商家',
      orderTypes: [
        { state: 7, text: '制作中', icon: '/static/rider/toBeReceived.png', status: 1 },
        { state: 8, text: '配送中', icon: '/static/rider/payment.png', status: 2 },
        { state: 9, text: '已送达', icon: '/static/rider/complete.png', status: 3 },
        { state: 10, text: '已完成', icon: '/static/rider/complete.png', status: 4 },
        { state: 11, text: '已取消', icon: '/static/user/complete.png', status: 5 },
      ]
    },
  ],
])
// 获取个人信息
const memberStore = useMemberStore()

const list1: any = ref([])
const list2: any = ref([])

//跳转到订单页面全部
const changeToOrderPage = () => {
  uni.switchTab({
    url: '/pages/list/list',
  })
}
const changeToOrderStatus = (item: any) => {
  //tabbar页面不能路由传参
  uni.setStorageSync('orderStatus', item.status)
  uni.switchTab({
    url: `/pages/list/list`,
  })
}

const changeToOtherPage = (item: any) => {
  if (item.text === '成为骑手') {
    uni.navigateTo({
      url: '/pages/rider/index'
    })
    return
  }
  if (item.text === '入驻平台' || item.text === '商铺管理') {
    uni.navigateTo({
      url: '/pages/shop/index'
    })
    return
  }
}
const hasExit = (list1, target) => {
  for (let i = 0; i < list1.length; i++) {
    if (list1[i].text === target.text)
      return false
  }
  return true
}

onShow(() => {
  if (!memberStore.profile.roles) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  }

  memberStore.profile.roles.forEach(item => {
    if (item.name === 'shoper') others[1].text = '商铺管理'
    if (item.name === 'rider') others.splice(0, 1)
  })
  list2.value = others

  if (memberStore.profile.roles.length === 1) {
    list1.value = map.get(memberStore.profile.roles[0].name)?.orderTypes
  }
  else {
    const temp1: any = []
    memberStore.profile.roles.forEach((item: any) => {

      map.get(item.name)!.orderTypes.forEach((value) => {
        if (hasExit(temp1, value)) {
          temp1.push(value)
        }
      })
    })
    list1.value = temp1

  }
})
</script>
<style lang="scss" scoped>
.viewport {
  height: 100%;
  background: linear-gradient(158deg, #cfe3fe 0%, #d4f0fc 55%, #f2f6f9 100%);
  background-size: 100% auto;
}

/* 用户信息 */
.profile {
  // height: 380rpx;

  .overview {
    display: flex;
    padding: 0 36rpx;
    color: #fff;
  }

  .avatar {
    margin-top: 146rpx;
    width: 133rpx;
    height: 133rpx;
    margin-left: 36rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .meta {
    margin-top: 146rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 266rpx;
    margin-bottom: 16rpx;
    font-size: 36rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .userTypes {
    display: flex;

    .userType {
      display: flex;
      justify-content: space-between;
      padding: 10rpx;
      height: 40rpx;
      max-width: 266rpx;
      margin-top: 24rpx;
      margin-bottom: 16rpx;
      margin-right: 20rpx;
      background: #ffffff;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      opacity: 1;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #00c17f;
      align-items: center;
    }
  }
}

/* 我的订单 */
.orders {
  background: linear-gradient(180deg, #e5fdf5 0%, rgba(255, 255, 255, 0) 99%);
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 33rpx;

    .navigator {
      height: 34rpx;
      font-size: 24rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 28rpx;
      float: right;
    }
  }

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 10rpx;
    flex-wrap: wrap;
    flex-direction: row;

    .navigator {
      width: 200rpx;
      margin-top: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .section_icon {
        margin-left: 20rpx;
      }

      .section_text {}
    }

    .contact {
      text-align: center;
      font-size: 24rpx;
      color: #333;

      &::before {
        display: block;
        font-size: 60rpx;
        color: #ff9545;
      }

      &::after {
        border: none;
      }
    }
  }
}

.others {
  background: #ffffff;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  height: 374rpx;

  .navigator {
    width: 25%;
    height: 50%;
    float: left;
    margin-top: 20rpx;

    .other {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .others_text {
        overflow: hidden;
        font-size: 26rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}
</style>