<template>
	<view class="goods">
		<view class="goods_image" :style="{ backgroundImage: 'url(' + imgUrl + ')' }"
			style="background-size: cover; background-position: bottom center"></view>
		<view class="goods_price">
			<!-- <view class="price">￥{{ goods.price }}</view> -->
			<view class="price">{{ goods?.shopName }}</view>
			<view class="title">{{ goods?.goodName }}({{ goods.shopDetailAddress == null ? '采样' : '检测' }})</view>
		</view>
		<view class="goods_select">
			<view class="select">
				<text>选择</text>
				<view class="select_drop"></view>
			</view>
			<view class="address">
				<text>地址</text>
				<view class="select_drop"></view>
			</view>
		</view>
		<view class="goods_bottom">
			<view class="bottom1">
				<up-button text="去付款" color="orange" shape="circle" @click="openPopup(false)"></up-button>
			</view>
			<view class="bottom2">
				<up-button text="加入购物车" color="limegreen" shape="circle" @click="openPopup(true)"></up-button>
			</view>
		</view>
	</view>

	<u-popup :show="popupScene" @close="closePopup" mode="bottom" :closeable="true" :round="10"
		closeIconPos="top-right">
		<scroll-view :scroll-y="true">
			<view style="height: 1000rpx">
				<view class="top">
					<img :src="dataDetail.imgUrl" style="height: 100rpx; width: 100rpx; margin: 20rpx" />
					<!-- <text>￥{{dataDetail.price}}</text> -->
					<text>￥<text style="font-size: 60rpx">{{ dataDetail.price }}</text>
					</text>
				</view>
				<view class="center">
					<view style="display: flex; flex-direction: row; justify-content: space-between">
						<text style="margin-left: 20rpx">套餐类型{{ goods!.skuList?.length! }}</text>
						<text style="margin-right: 20rpx">列表</text>
					</view>
					<view style="display: flex; flex-direction: row; flex-flow: wrap">
						<view class="item" style="display: flex; flex-direction: column; width: 200rpx; margin: 20rpx"
							v-for="item in goods!.skuList" :key="item.skuId" @click="chooseDetail(item)">
							<img :src="item.imgList[0]?.objName" style="height: 200rpx; width: 200rpx" />
							<text style="width: 100%; word-break: break-all" v-for="(data, key) in item.skuValueList"
								:key="key">{{ data.specName }}: {{ data.specValue }}</text>
							<text style="position: relative; top: 0rpx; font-size: 20rpx">￥<text
									style="font-size: 30rpx">{{ item.price }}</text>
							</text>
						</view>
					</view>
				</view>
				<view style="display: flex; flex-direction: row; justify-content: space-between; margin: 20rpx">
					<text>购买数量</text>
					<view style="width: 100rpx">
						<text class="interval" style="padding: 0 10rpx 0 10rpx" @click.stop="decrease">-</text>
						<text class="interval" style="padding: 0 10rpx 0 10rpx">{{ number }}</text>
						<text class="interval" style="padding: 0 10rpx 0 10rpx" @click.stop="increase">+</text>
					</view>
				</view>
				<view style="height: 120rpx; width: 100%"></view>
				<view class="bottom" style="position: fixed; bottom: 0; width: 100%; text-align: center">
					<text>现在付款，48小时内发货</text>
					<button style="
              margin-top: 10rpx;
              border-radius: 10rpx;
              background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
            " @click="scene ? addToCart() : payGoods()">
						{{ scene ? '确认' : '付款' }}
					</button>

					<!-- 				<button v-if="scene==true" style="
					  margin-top: 10rpx;
					  border-radius: 10rpx;
					  background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
					" @click="addToCart">
								确认
							</button>
							<button v-else style="
							  margin-top: 10rpx;
							  border-radius: 10rpx;
							  background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
							" @click="payGoods">
								付款
							</button> -->
				</view>
			</view>
		</scroll-view>
	</u-popup>
</template>

<script setup lang="ts">
	import { addCartAPI } from '@/services/cart'
	import { getGoodsDetailMessageAPI } from '@/services/home'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import Decimal from 'decimal.js'

	let goods : any = ref({})

	const imgUrl = ref('')

	onLoad((option : any) => {
		getDetail(parseInt(option.item))
		imgUrl.value = JSON.parse(decodeURIComponent(option.imgList))
	})
	const getDetail = async (data : number) => {
		const result : any = await getGoodsDetailMessageAPI(data)
		goods.value = result.data
	}

	let scene = true
	const dataDetail : any = ref({})

	let popupScene = ref(false)

	const openPopup = (state : boolean) => {
		scene = state
		if (goods.value.skuList.length != 0) {
			dataDetail.value = goods.value.skuList[0]!
			dataDetail.value.imgUrl = goods.value.skuList[0]!.imgList[0]?.objName
		}
		popupScene.value = true
	}

	const closePopup = () => {
		popupScene.value = false
	}

	const chooseDetail = (item : any) => {
		dataDetail.value = item
		dataDetail.value.imgUrl = item.imgList[0]?.objName
	}

	let number = ref(1)
	const decrease = () => {
		if (number.value > 1) number.value -= 1
	}

	const increase = () => {
		number.value += 1
	}

	// const useMember = useMemberStore()
	//付款
	const payGoods = async () => {
		const data : any = {
			goodsName: goods.value.goodName,
			number: number.value,
			price: Decimal.mul(dataDetail.value.price, number.value),
			skuId: dataDetail.value.skuId,
			spuId: goods.value.id,
			shopInfoId: goods.value.shopInfoId,
			imgUrl: dataDetail.value.imgUrl,
			address: goods.value.shopDetailedAddress,
		}
		console.log(data.address)
		uni.navigateTo({
			url: '/pages/payment/payment?goods=' + encodeURIComponent(JSON.stringify(data)),
		})
	}

	//加入购物车
	const addToCart = async () => {
		const data : any = {
			goodsName: goods.value.goodName,
			number: number.value,
			price: Decimal.mul(dataDetail.value.price, number.value),
			skuId: dataDetail.value.skuId,
			spuId: goods.value.id,
			shopInfoId: goods.value.shopInfoId,
		}
		const result : any = await addCartAPI(data)
		if (result.code === 200) {
			popupScene.value = false
			uni.showToast({
				icon: 'success',
				title: '添加购物车成功',
			})
		} else {
			uni.showToast({
				icon: 'error',
				title: result.msg,
			})
		}
	}
</script>

<style lang="scss" scoped>
	.goods {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background-color: #f2f5f5;

		.goods_image {
			height: 750rpx;
			margin: 10rpx 0;
			// background-image: url('../../static/tabs/home_default.png');
		}

		.goods_price {
			margin: 24rpx 24rpx;
			background-color: #ffffff;
			height: 164rpx;
			border-radius: 10rpx;
			padding: 15rpx 15rpx;

			.price {
				color: red;
				font-size: 54rpx;
			}

			.title {
				margin-left: 22rpx;
				margin-right: 22rpx;
				margin-top: 10rpx;
				font-size: 32rpx;
				font-family: PingFang HK-Medium, PingFang HK;
				font-weight: 500;
				color: #000000;
				overflow: hidden;
			}
		}

		.goods_select {
			margin: 24rpx 24rpx;
			background-color: #ffffff;
			height: 160rpx;
			border-radius: 10rpx;
			padding: 15rpx 15rpx;

			.select {
				margin: 0 28rpx;
				height: 50%;
				margin: 5rpx 0;
				color: #969696;
				font-size: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.select_drop {
					width: 85%;
					height: 40rpx;
					overflow: hidden;
					font-size: 28rpx;
					font-family: PingFang HK-Regular, PingFang HK;
					font-weight: 400;
					color: #000000;
				}
			}

			.address {
				margin: 0 28rpx;
				height: 50%;
				margin: 5rpx 0;
				color: #969696;
				font-size: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.select_drop {
					width: 85%;
					height: 40rpx;
					overflow: hidden;
					font-size: 28rpx;
					font-family: PingFang HK-Regular, PingFang HK;
					font-weight: 400;
					color: #000000;
				}
			}
		}

		.goods_bottom {
			background-color: #ffffff;
			margin-top: 6rpx;
			height: 164rpx;
			margin-top: auto;
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 0;
			width: 100%;

			.bottom1 {
				width: 45%;
				height: 80rpx;
				margin: 0 15rpx;
			}

			.bottom2 {
				width: 45%;
				height: 80rpx;
				margin: 0 15rpx;
			}
		}
	}
</style>