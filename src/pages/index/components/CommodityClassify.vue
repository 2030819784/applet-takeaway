<template>
  <view class="commodityClassify">
    <view class="classifyTabs">
      <u-sticky>
        <u-tabs :list="list1" lineWidth="36" lineHight="6" lineColor="#00C17F" :activeStyle="{
          color: '#000000',
          fontWeight: '800',
          transform: 'scale(1.05)',
          fontSize: '28rpx',
        }" :itemStyle="{
          paddingLeft: '15px',
          paddingRight: '15px',
          height: '50px',
          fontSize: '28rpx',
        }" :inactiveStyle="{ color: '#000000', fontSize: '28rpx' }" :current="tabsCurrent"
          @change="changeCurrent"></u-tabs>
      </u-sticky>
    </view>
    <!-- <view v-if="list1?.length == 0">
      <u-empty mode="data"></u-empty>
    </view> -->
    <view v-if="resultItems?.list?.length == 0">
      <u-empty mode="data"></u-empty>
    </view>
    <view class="commodityDes" v-for="item in resultItems?.list" :key="item.id">
      <text @click="changeToGoodsDetail(item)">{{ item.name }}</text>
      <!-- <image :src="item.imgList[0]?.objName" @click="changeToGoodsDetail(item)"></image> -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { getGoodsCategoryListAPI, getGoodsListsAPI, getShopListAPI } from '@/services/home'
import type { goodsListParams } from '@/types/home'
import { onLoad, onShow, onTabItemTap } from '@dcloudio/uni-app'
import { onBeforeMount, ref } from 'vue'
//首页商品分类
const list1 = ref()

//当前高亮
let tabsCurrent = ref(0)
//首次渲染高亮名称
let categoryName: any = ref('')
//接收返回的商品列表
const resultItems = ref()
//获取商品列表参数
const goodsListquery: goodsListParams = {
  page: 1,
  pageSize: 0,
  categoryName: categoryName,
}
//获取商品分类
const getCategoryList = async () => {
  const result: any = await getGoodsCategoryListAPI('shop_type')
  if (result.code === 200) {
    const list = result.data[0].children
    list1.value = list.map((item: any) => Object.assign(item, { name: item.label }))
    getGoodsListItems(list1.value[0].id)
  }
}
//获取商铺列表
const getGoodsListItems = async (id: number) => {
  const result: any = await getShopListAPI(id)
  if (result.code === 200) {
    resultItems.value = result.data
  }
}
//切换高亮查询商品
const changeCurrent = (index: any) => {
  tabsCurrent.value = index.index
  if (tabsCurrent.value == index.index) goodsListquery.categoryName = index.name
  // getGoodsListItems()
}
//跳转到商品详情页面
const changeToGoodsDetail = (item: any) => {
  uni.navigateTo({
    url:
      '/pages/goods/goods?item=' +
      item.id +
      '&imgList=' +
      encodeURIComponent(JSON.stringify(item.imgList[0].objName)) +
      '&address=' +
      decodeURIComponent(JSON.stringify(item.shopDetailedAddress)),
  })
}

onShow(() => {
  tabsCurrent.value = 0
  getCategoryList()
})
// onLoad(() => {
//   getGoodsListItems()
// })
</script>

<style lang="scss" scoped>
.commodityClassify {
  .classifyTabs {
    width: 100%;
    height: 140rpx;
    background: linear-gradient(180deg, #e5fdf5 0%, rgba(255, 255, 255, 0) 99%);
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    opacity: 1;
  }

  // background-color: #27ba9b;
  .commodityDes {
    margin: 0 5% 30rpx 5%;
    height: 228rpx;
    background-color: white;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    background: #d9d9d9;
    box-shadow: 0rpx 8rpx 8rpx 0rpx #b3b3b3;
    border-radius: 8rpx 8rpx 8rpx 8rpx;
  }
}
</style>
