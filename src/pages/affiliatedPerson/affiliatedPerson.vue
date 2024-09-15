<template>
  <!-- 联系人列表 -->
  <view class="page">
    <!-- <view v-if="list.length == 0">
      <u-empty mode="data"></u-empty>
    </view> -->
    <view class="list">
      <view class="content" v-for="item in form" :key="item.id">
        <view class="item">
          <view class="testItem">姓名：{{ item.name }}</view>
          <view class="center">
            <view class="member">
              <view class="idNo">性别：{{ item.gender }}</view>
              <view class="nickName">手机号：{{ item.phone }}</view>
              <view class="idNo">地址：{{ item.address }}</view>
            </view>
          </view>
          <view class="bottom" v-if="selectAddress">
            <view class="time" @click="select(item)">选择该地址</view>
          </view>
          <view class="bottom" v-else>
            <view class="result">
              <view class="title" @click="changeToDetialPage(item.id)">详情</view>
            </view>
            <view class="time" @click="deleteAffiliated(item.id)">删除</view>
          </view>
        </view>
      </view>
    </view>

    <view class="button" @click="addAffiliatedPerson"> 添加联系人 </view>
  </view>
</template>

<script lang="ts" setup>
import { deleteAffiliatedAPI, getAffiliatedListAPI } from '@/services/home'
import { useMemberStore } from '@/stores'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
let list: any = ref()
let form: any = ref()
let selectAddress = ref(false)
const changeToDetialPage = (id: any) => {
  // uni.navigateTo({
  //   url: '/pages/narcoticsReport/narcoticsRecord?id=' + encodeURIComponent(JSON.stringify(id)),
  // })
  uni.navigateTo({
    url:
      '/pages/affiliatedPerson/affiliatedDetial/affiliatedDetial?id=' +
      encodeURIComponent(JSON.stringify(id)),
  })
}
const query = {
  page: 1,
  pageSize: 0,
  userId: useMemberStore().profile.id,
}
const getAffiliatedList = async () => {
  const res: any = await getAffiliatedListAPI(query)
  form.value = res.data.list
  for (let key = 0; key < form.value.length; key++) {
    if (form.value[key]?.gender == 0) {
      form.value[key].gender = '女'
    } else if (form.value[key]?.gender == 1) {
      form.value[key].gender = '男'
    }
  }
}
const addAffiliatedPerson = () => {
  uni.navigateTo({
    url: '/pages/affiliatedPerson/addAffiliatedPerson/addAffiliatedPerson',
  })
}
const select = (item: any) => {
  // uni.navigateTo({
  //   url: '/pages/payment/payment?item=' + encodeURIComponent(JSON.stringify(item)),
  // })
  uni.setStorageSync('userAddress', item)
  uni.navigateBack()
}
const deleteAffiliated = async (id: any) => {
  const res: any = await deleteAffiliatedAPI(id)
  if (res.code == 200) {
    uni.showToast({
      icon: 'success',
      title: '删除成功',
    })
    getAffiliatedList()
  }
}
onLoad((option: any) => {
  getAffiliatedList()
  if (option.select) selectAddress.value = JSON.parse(decodeURIComponent(option.select))
})
onShow(() => {
  getAffiliatedList()
})
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(10deg, rgba(27, 193, 101, 0) 0%, #1bc172 28%, #43d180 50%);
  background-color: #fff;
  height: 100vh;
  position: relative;
  .list {
    padding-bottom: 50rpx;
    .content {
      margin: 0 24rpx;

      .item {
        width: 100%;
        // height: 328rpx;
        background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
        background-color: #fff;
        margin-bottom: 24rpx;
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        opacity: 1;
        padding: 32rpx;

        .testItem {
          height: 50rpx;
          font-size: 28rpx;
          font-family: PingFang HK-Medium, PingFang HK;
          font-weight: 500;
          color: #000000;
          line-height: 33rpx;
        }

        .line {
          margin-top: 24rpx;
          border-top: 1px dashed #000;
        }

        .center {
          display: flex;
          justify-content: space-between;

          .member {
            width: 80%;
            font-size: 28rpx;
            font-family: PingFang HK-Regular, PingFang HK;
            font-weight: 500;
            color: #000000;
            line-height: 33rpx;

            .nickName {
              height: 50rpx;
              margin-top: 24rpx;
            }

            .idNo {
              height: 50rpx;
              margin-top: 24rpx;
            }
          }

          .image {
            width: 20%;
            margin-top: 24rpx;
          }
        }

        .bottom {
          font-size: 26rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #333333;
          line-height: 30rpx;
          display: flex;
          justify-content: space-between;
          margin-top: 24rpx;

          .result {
            height: 50rpx;
            display: flex;
            justify-content: space-between;

            .title {
              color: #00b964;
            }

            .text {
              font-size: 32rpx;
              font-family: Alibaba PuHuiTi-Bold, Alibaba PuHuiTi;
              font-weight: bold;
              color: #00c17f;
              line-height: 38rpx;
            }
          }

          .time {
            color: red;
          }
        }
      }
    }
  }

  .button {
    position: fixed;
    background: #00b964;
    bottom: 0;
    width: 90%;
    height: 88rpx;
    margin-bottom: 20rpx;
    margin-left: 5%;
    border-radius: 50rpx 50rpx 50rpx 50rpx;
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #ffffff;
    line-height: 88rpx;
    display: flex;
    justify-content: center;
  }
}
</style>
