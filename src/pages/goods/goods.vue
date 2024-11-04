<template>
	<view class="goods">
		<view class="goods_image" :style="{ backgroundImage: `url(${goods.goodsPhoto})` }"
			style="background-size: cover; background-position: bottom center"></view>
		<view class="goods_price">
			<view class="price">{{ goods.shop.name }}</view>
			<view class="title">{{ goods.name }}</view>
		</view>
		<view class="goods_bottom">
			<view class="bottom1">
				<up-button text="去付款" color="orange" shape="circle" @click="openPopup"></up-button>
			</view>
		</view>
	</view>

	<u-popup :show="popupScene" @close="closePopup" mode="bottom" :closeable="true" :round="10"
		closeIconPos="top-right">
		<scroll-view :scroll-y="true">
			<view style="height: 1000rpx">
				<view class="top">
					<img :src="goods.goodsPhoto" style="height: 200rpx; width: 200rpx; margin: 20rpx" />
					<text>￥<text style="font-size: 60rpx">{{ goods.price }}</text>
					</text>
				</view>
				<view style="display: flex; flex-direction: row; justify-content: space-between; margin: 20rpx">
					<text>购买数量</text>
					<view style="width: 100rpx;margin-right: 40rpx;">
						<text class="interval" style="padding: 0 10rpx 0 10rpx" @click.stop="decrease">-</text>
						<text class="interval" style="padding: 0 10rpx 0 10rpx">{{ number }}</text>
						<text class="interval" style="padding: 0 10rpx 0 10rpx" @click.stop="increase">+</text>
					</view>
				</view>
				<view style="height: 120rpx; width: 100%"></view>
				<view class="bottom" style="position: fixed; bottom: 0; width: 100%; text-align: center">
					<text>现在付款,50分钟内送达</text>
					<button style="
              margin-top: 10rpx;
              border-radius: 10rpx;
              background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
            " @click="payGoods()">付款
					</button>
				</view>
			</view>
		</scroll-view>
	</u-popup>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import Decimal from 'decimal.js'

let goods: any = ref({})
onLoad((option: any) => {
	goods.value = JSON.parse(decodeURIComponent(option.good))
})

let popupScene = ref(false)

const openPopup = () => {
	popupScene.value = true
}

const closePopup = () => {
	popupScene.value = false
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
	const data: any = {
		shopName: goods.value.shop.name,
		name: goods.value.name,
		number: number.value,
		totalPrice: Decimal.mul(goods.value.price, number.value),
		price: goods.value.price,
		shopId: goods.value.shop.id,
		goodsId: goods.value.id,
		goodsPhoto: goods.value.goodsPhoto
	}
	uni.navigateTo({
		url: '/pages/payment/payment?goods=' + encodeURIComponent(JSON.stringify(data)),
	})
}

//加入购物车
// const addToCart = async () => {
// 	const data: any = {
// 		goodsName: goods.value.goodName,
// 		number: number.value,
// 		price: Decimal.mul(goods.value.price, number.value),
// 		shopId: goods.value.shopId,
// 		address: goods.value.shopDetailedAddress,
// 	}
// 	const result: any = await addCartAPI(data)
// 	if (result.code === 200) {
// 		popupScene.value = false
// 		uni.showToast({
// 			icon: 'success',
// 			title: '添加购物车成功',
// 		})
// 	} else {
// 		uni.showToast({
// 			icon: 'error',
// 			title: result.msg,
// 		})
// 	}
// }
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