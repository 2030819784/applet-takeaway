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
              <view @click="cancelRole(item)" v-for="(item, index) in memberStore.profile.roles" :key="index"
                class="userType">{{ item.description
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
import { deleteRiderAPI } from '@/services/rider'
import { deleteShopRoleAPI } from '@/services/shop'
import { getUserInfoAPI } from '@/services/user'
import { useMemberStore } from '@/stores'
import { onShow } from '@dcloudio/uni-app'
import { nextTick } from 'process'
import { ref } from 'vue'

let others = [
  { state: 0, text: '成为骑手', icon: '/static/user/takeOrder.png' },
  { state: 1, text: '入驻平台', icon: '/static/user/registe.png' },
  { state: 2, text: '地址管理', icon: '/static/user/address.png' },
]


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
  if (item.text === '前往接单') {
    uni.navigateTo({
      url: '/pages/takeOrder/index'
    })
    return
  }
  if (item.text === '入驻平台' || item.text === '商铺管理') {
    uni.navigateTo({
      url: '/pages/shop/index'
    })
    return
  }
  if (item.text === '地址管理') {
    uni.navigateTo({
      url: '/pages/address/index'
    })
    return
  }
  if (item.text === '分类管理') {
    uni.navigateTo({
      url: '/pages/labelList/index'
    })
    return
  }
}


onShow(() => {
  if (!memberStore.profile.roles) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  }
  sureRole()
})


const sureRole = () => {
  others = [
    { state: 0, text: '成为骑手', icon: '/static/user/takeOrder.png' },
    { state: 1, text: '入驻平台', icon: '/static/user/registe.png' },
    { state: 2, text: '地址管理', icon: '/static/user/address.png' },
  ]
  memberStore.profile.roles.forEach((item: any) => {
    if (item.name === 'rider') {
      others[0].text = '前往接单'
    }
    if (item.name === 'shoper') {
      others[1].text = '商铺管理'
    }
    if (item.name === 'admin') {
      others.push({ state: 3, text: '分类管理', icon: '/static/user/label.png' },)
    }
  })
  nextTick(() => {
    list2.value = others
  })

  list1.value = [
    { state: 0, text: '未付款', icon: '/static/user/waitPay.png', status: 0 },
    { state: 1, text: '制作中', icon: '/static/user/creating.png', status: 1 },
    { state: 2, text: '制作完成', icon: '/static/user/done.png', status: 2 },
    { state: 3, text: '配送中', icon: '/static/user/dealing.png', status: 3 },
    { state: 4, text: '已送达', icon: '/static/user/send.png', status: 4 },
    { state: 5, text: '已完成', icon: '/static/user/complete.png', status: 5 },
    { state: 6, text: '订单取消', icon: '/static/user/cancel.png', status: 6 }
  ]
}

const cancelRole = (item: any) => {
  if (item.name === 'rider') {
    uni.showModal({
      title: '提示',
      content: '是否注销骑手',
      success: function (res) {
        if (res.confirm) {
          deleteRider()
        }
      }
    });
    return
  }
  if (item.name === 'shoper') {
    uni.showModal({
      title: '提示',
      content: '是否注销商家',
      success: function (res) {
        if (res.confirm) {
          deleteShop()
        }
      }
    });
    return
  }
}

const deleteRider = async () => {
  const res: any = await deleteRiderAPI()
  if (res.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '注销成功'
    })
    const res: any = await getUserInfoAPI()
    if (res.code === 200) {
      const user = uni.getStorageSync('user')
      user.roles = res.data.roles
      const memberStore = useMemberStore()
      memberStore.setProfile(user)
      sureRole()
      uni.reLaunch({
        url: '/pages/user/user'
      })
    }
  } else {
    uni.showToast({
      title: '注销失败',
      icon: 'error'
    })
  }
}

const deleteShop = async () => {
  const res: any = await deleteShopRoleAPI()
  if (res.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '注销成功'
    })
    const res: any = await getUserInfoAPI()
    if (res.code === 200) {
      const user = uni.getStorageSync('user')
      user.roles = res.data.roles
      const memberStore = useMemberStore()
      memberStore.setProfile(user)
      sureRole()
      uni.reLaunch({
        url: '/pages/user/user'
      })
    }
  } else {
    uni.showToast({
      title: '注销失败',
      icon: 'error'
    })
  }
}

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
