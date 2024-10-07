<template>
  <PageNavbar></PageNavbar>
  <view class="bg-top"></view>
  <view v-if="loading">
    <view v-if="items.length != 0">
      <view class="content">
        <text class="edit" @click="manageShop">编辑</text>
        <checkbox-group @change="checkboxChange" @touchstart="sceneComeBackStart" @touchend="sceneComeBackEnd">
          <label v-for="item in items" :key="item.id">
            <view class="shoplist">
              <checkbox class="round" :value="item.id" :checked="item.checked" style="width: 100%">
                <view class="item">
                  <view class="img-box">
                    <image class="img" :src="item.imgList[0]?.objName"></image>
                  </view>
                  <view class="item-right">
                    <text class="right-top">{{ item.goodsName }}({{
                      item.shopDetailedAddress == null ? '采样' : '检测'
                    }})</text>
                    <view class="right-bottom">
                      <view style="color: red">
                        <text style="font-size: 24rpx">￥</text>
                        <text style="font-size: 40rpx">{{ item.price }}</text>
                      </view>
                      <view style="color: #808080">
                        <text style="font-size: 20rpx">￥</text>
                        <text style="text-decoration: line-through">{{ item.price }}</text>
                      </view>
                      <!--       <view class="counter" v-if="item.scene && !showEdit">
                        <text class="interval" @click.stop="increase(item)">-</text>
                        <text class="interval">{{ item.number }}</text>
                        <text class="interval" @click.stop="decrease(item)">+</text>
                      </view>
                      <view class="counter" v-else @click.stop="item.scene = true">
                        x{{ item.number }}
                      </view> -->
                      <view class="counter"> x{{ item.number }} </view>
                    </view>
                  </view>
                </view>
              </checkbox>
            </view>
          </label>
        </checkbox-group>
      </view>
      <view style="height: 100rpx"> </view>
      <view class="bottom">
        <view class="content">
          <checkbox-group @change="selectAll">
            <label>
              <!-- :value="select.checked!" -->
              <checkbox class="round" :checked="select.checked!"></checkbox>
            </label>
          </checkbox-group>
          <view class="content-text">
            <text style="font-size: 28rpx; color: #999999">合计： </text>
            <text style="color: red; font-size: 24rpx">￥
              <text style="color: red; font-size: 48rpx">{{ totalPrice }}</text>
            </text>
          </view>
          <button v-if="!showEdit" class="pay-button" @click="payment" :disabled="finalData.length == 0">
            <text class="pay-text"> 去付款({{ totalNumber }}) </text>
          </button>
          <template v-else>
            <button class="sure-button" @click="cancelGoods">
              <text class="delete-text">取消</text>
            </button>
            <button class="delete-button" @click="deleteGoods">
              <text class="delete-text">删除</text>
            </button>
          </template>
        </view>
        <!-- <view class="content" v-else>
			<checkbox-group @change="selectAll">
				<label>
					<checkbox class="round" :value="select.checked!" :checked="select.checked!"></checkbox>
				</label>
			</checkbox-group>
			<text style="font-size: 28rpx; color: #999999">全选</text>
			<button class="sure-button" @click="sureGoods">
				<text class="delete-text">确认</text>
			</button>
			<button class="delete-button" @click="cancelGoods">
				<text class="delete-text">取消</text>
			</button>
		</view> -->
      </view>
    </view>
    <view class="content" v-else style="display: flex; align-items: center; justify-content: center; margin-top: 40%">
      <image src="../../static/images/none.png" style="height: 600rpx; width: 400rpx"></image>
      <view class="bottom">
        <button class="shop-button" @click="shop">去逛逛</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import PageNavbar from './PageNavbar.vue'
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { getCartListAPI, delteCartAPI, updateCartAPI } from '@/services/cart'
import { onPullDownRefresh, onTabItemTap, onShow } from '@dcloudio/uni-app'
import Decimal from 'decimal.js'

let loading = ref(false)
//下拉刷新
onPullDownRefresh(async () => {
  loading.value = false
  await getCartList()
  judgeMentChecked()
  uni.stopPullDownRefresh()
  select.checked = false
  loading.value = true
})
//点击tabbar刷新数据
onTabItemTap(async () => {
  loading.value = false
  select.checked = false
  await getCartList()
  judgeMentChecked()
  loading.value = true
})
//页面返回刷新
onShow(async () => {
  loading.value = false
  select.checked = false
  totalNumber.value = 0
  await getCartList()
  judgeMentChecked()
  loading.value = true
})

let select = reactive({ checked: false })

const selectAll = () => {
  select.checked = !select.checked
  finalData.length = 0
  totalNumber.value = 0
  for (let key in items.value) {
    if (select.checked) {
      items.value[key].checked = true
      finalData.push(items.value[key])
      totalNumber.value += items.value[key].number
    } else {
      items.value[key].checked = false
    }
  }
}
let items: any = ref([])
var finalData: any = reactive([])

const totalNumber = ref(0)

const totalPrice = computed(() => {
  let price: any = 0
  for (let key in finalData) {
    price = Decimal.add(price, Decimal.mul(finalData[key].price, finalData[key].number))
  }
  return price
})

const checkboxChange = (e: any) => {
  if (e.detail.value.length == items.value.length) {
    select.checked = true
  } else {
    select.checked = false
  }
  totalNumber.value = 0
  finalData.length = 0

  for (let index in items.value) {
    if (e.detail.value.includes(items.value[index].id.toString())) {
      items.value[index].checked = true
      finalData.push(items.value[index])
      totalNumber.value += items.value[index].number
    } else {
      items.value[index].checked = false
    }
  }
}

const increase = (item: any) => {
  if (item.number > 1) {
    item.number -= 1
    updateCartAPI(item)
    if (finalData.includes(item)) {
      totalNumber.value -= 1
    }
  }
}
const decrease = (item: any) => {
  item.number += 1
  updateCartAPI(item)
  if (finalData.includes(item)) {
    totalNumber.value += 1
  }
}

const getCartList = async () => {
  loading.value = false
  const result: any = await getCartListAPI()
  if (result.code === 200) {
    if (result.data.list.length == 0) {
      items.value = result.data.list
      showEdit.value = false
      return
    }
    items.value = result.data.list.filter((item: any) => item.state == 0)
    items.value.forEach((item: any) => (item.scene = false))
    loading.value = true
  }
}

const judgeMentChecked = () => {
  finalData.length = 0
  for (let key in items.value) {
    if (items.value[key].checked == true) {
      totalNumber.value += items.value[key].number
      finalData.push(items.value[key])
    } else {
      items.value[key].checked == false
    }
  }
}

onBeforeMount(async () => {
  await getCartList()
  judgeMentChecked()
})

//判断购买的商品是否是一个采样点一个检测点
const judgeMentGoods = () => {
  if (uni.getStorageSync('roles').isGovernmentStaff && uni.getStorageSync('sample')) {
    if (finalData[0].shopDetailedAddress) {
      return true
    } else {
      uni.showToast({
        icon: 'error',
        title: '请选择一个检测点',
      })
      return false
    }
  }

  if (finalData.length > 2) {
    uni.showToast({
      icon: 'error',
      title: '最多选择两个商品',
    })
    return false
  } else if (finalData.length == 2) {
    let first = false //采样点
    let second = false //检测点
    for (let key in finalData) {
      finalData[key].shopDetailedAddress == null ? (first = true) : (second = true)
    }
    if (first && second) {
      return true
    } else if (first == false) {
      uni.showToast({
        icon: 'error',
        title: '请选择一个采样点',
      })
      return false
    } else if (second == false) {
      uni.showToast({
        icon: 'error',
        title: '请选择一个检测点',
      })
      return false
    }
  }
  return true
}

const payment = () => {
  if (judgeMentGoods()) {
    const price = totalPrice.value
    let checkAddress = ''
    if (finalData.length > 1) {
      //同时购买采样和检测商品
      for (let key in finalData) {
        if (finalData[key].shopDetailedAddress != null)
          checkAddress = finalData[key].shopDetailedAddress
      }
    } else if (finalData.length == 1)
      //只购买一件商品
      checkAddress = finalData[0].shopDetailedAddress

    uni.navigateTo({
      url:
        '/pages/payment/payment?cart=' +
        encodeURIComponent(JSON.stringify(finalData)) +
        '&totalPrice=' +
        JSON.stringify(price) +
        '&totalNumber=' +
        JSON.stringify(totalNumber.value) +
        '&checkAddress=' +
        decodeURIComponent(JSON.stringify(checkAddress)),
    })
  }
}

let showEdit = ref(false)

const manageShop = () => {
  if (!showEdit.value) {
    select.checked = false
    items.value.forEach((item: any) => (item.checked = false))
    judgeMentChecked()
    showEdit.value = true
  }
}

const clearPrice = () => {
  judgeMentChecked()
  totalNumber.value = 0
  select.checked = false
}

const cancelGoods = () => {
  items.value.forEach((item: any) => {
    item.scene = false
    item.checked = false
  })
  clearPrice()
  showEdit.value = false
}

const shop = () => {
  uni.reLaunch({
    url: '/pages/index/index',
  })
}

const deleteGoods = async () => {
  let cartIdList: number[] = []
  finalData.forEach((item: any) => {
    cartIdList.push(item.id)
  })
  const result: any = await delteCartAPI(cartIdList)
  if (result.code == 200) {
    uni.showToast({
      icon: 'success',
      title: '删除订单成功',
    })
  }
  loading.value = false
  await getCartList()
  clearPrice()
  loading.value = true
}

let clientY: number = 0
let moveY: number = 0
const sceneComeBackStart = (e: any) => {
  clientY = e.changedTouches[0].clientY
}
const sceneComeBackEnd = (e: any) => {
  moveY = Math.abs(e.changedTouches[0].clientY - clientY)
  if (moveY > 20 && !showEdit.value) {
    items.value.forEach((item: any) => {
      if (item.scene == true) {
        item.scene = false
      }
    })
  }
  clientY = e.changedTouches[0].clientY
}
</script>

<style lang="scss">
page {
  background-color: whitesmoke;
}
</style>
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

  .edit {
    color: white;
    position: relative;
    top: -35rpx;
  }

  .shoplist {
    width: 702rpx;
    height: 240rpx;
    border-radius: 32rpx;
    margin-bottom: 22rpx;
    padding: 40rpx 0rpx 40rpx 32rpx;
    background: linear-gradient(#dcfae0, 3%, white);

    .item {
      margin-left: 20rpx;
      display: flex;

      .img-box {
        width: 160rpx;
        height: 160rpx;
        border-radius: 16rpx;
        background: linear-gradient(328deg, #1bc172 0%, #43d180 100%);
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
          width: 148rpx;
          height: 148rpx;
        }
      }

      .item-right {
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .right-top {
          font-size: 28rpx;
          font-family: PingFang HK-Medium, PingFang HK;
          font-weight: 600;
          color: #000000;
        }

        .right-bottom {
          width: 400rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }

  .counter {
    float: right;
    text-align: center;
    width: 200rpx;

    .interval {
      padding-left: 10rpx;
      padding-right: 10rpx;
    }

    // .number {
    // 	transition-property: all;
    // 	transition-duration: 0.5s;
    // }

    // .interval:hover {
    // 	border-style: solid;
    // 	border-width: 1px;
    // 	color: red;
    // }
  }
}

.bottom {
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  border-bottom: solid 1rpx whitesmoke;
  height: 120rpx;
  padding-top: 20rpx;
  background-color: white;

  .shop-button {
    position: fixed;
    width: 200rpx;
    height: 80rpx;
    background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
    border-radius: 200rpx 200rpx 200rpx 200rpx;
    font-size: 28rpx;
    font-family: PingFang HK-Regular, PingFang HK;
    font-weight: 400;
    color: #ffffff;
    margin-left: 500rpx;
    line-height: 80rpx;
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;

    .content-text {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pay-button {
      width: 280rpx;
      height: 80rpx;
      background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
      border-radius: 200rpx 200rpx 200rpx 200rpx;

      .pay-text {
        font-size: 28rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #ffffff;
        line-height: 80rpx;
      }
    }

    .delete-button {
      width: 200rpx;
      margin-left: 10rpx;
      margin-right: 10rpx;
      height: 80rpx;
      background: red;
      border-radius: 200rpx 200rpx 200rpx 200rpx;

      .delete-text {
        font-size: 28rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #ffffff;
        line-height: 80rpx;
      }
    }

    .sure-button {
      margin-right: 10rpx;
      width: 200rpx;
      height: 80rpx;
      background: #3acd7d;
      border-radius: 200rpx 200rpx 200rpx 200rpx;

      .delete-text {
        font-size: 28rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #ffffff;
        line-height: 80rpx;
      }
    }

    text {
      white-space: nowrap;
    }

    button {
      margin-right: 5%;
      white-space: nowrap;
      color: white;
      font-size: 0.8rem;
      border-radius: 30rpx;
    }
  }
}
</style>
