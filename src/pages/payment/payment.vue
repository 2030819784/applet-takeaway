<template>
	<view class="total">
		<Address></Address>
		<view class="goods">
			<view class="item" v-for="item in dataList" :key="item.id">
				<view class="img-box">
					<image class="img" :src="item.goodsPhoto"></image>
				</view>
				<view class="item-right">
					<text class="right-top">{{ dataDetail.shopName }}</text>
					<text class="right-center">{{ item.name }}</text>
					<view class="right-bottom">
						<view style="color: red">
							<text style="font-size: 24rpx">￥</text>
							<text style="font-size: 40rpx">{{ item.price }}</text>
						</view>
						<view class="counter"> x {{ item.number }} </view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 100rpx"> </view>
		<view class="bottom">
			<view style="margin-left: 100rpx">
				<text style="font-weight: 300">共 {{ dataDetail.totalNumber }} 件 </text><text>合计：<text
						style="color: red; font-size: 24rpx">￥<text style="font-size: 40rpx">{{ totalPrice }}</text>
					</text>
				</text>
			</view>
			<button @click="addCaiYangOrder">提交订单</button>
		</view>
	</view>

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog cancelText="放弃" confirmText="确认付款" content="是否确认本次付款？" @confirm="addOrder"
			@close="dialogClose"></uni-popup-dialog>
	</uni-popup>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, toRaw } from 'vue'
import type { goodsListType } from '@/types/payment'
import { submitAPI, paymentAPI } from '@/services/order'
import Decimal from 'decimal.js'
import Address from '@/components/address'



const dataList = ref<goodsListType[]>([])

type dataType = {
	totalNumber: number
	totalPrice: Decimal
	address: string
	checkAddress: string
	price: number
	shopId: number | string
	shopName: string
}
const dataDetail: dataType = {
	totalNumber: 0,
	totalPrice: new Decimal(0),
	address: '',
	checkAddress: '',
	price: 0,
	shopId: 0,
	shopName: ''
}

const totalPrice = ref<Decimal>()

onLoad(async (options) => {
	const data = JSON.parse(decodeURIComponent(options!.goods))
	dataList.value = [data]
	dataDetail.shopId = data.shopId
	dataDetail.shopName = data.shopName
	dataDetail.totalNumber = data.number
	dataDetail.totalPrice = new Decimal(data.totalPrice)
	dataDetail.price = data.price
	dataDetail.address = data.address
	totalPrice.value = new Decimal(dataDetail.totalPrice)
})


//控制弹出框
const alertDialog = ref()

const orderId = ref('null')

const addOrder = async () => {
	const result: any = await paymentAPI(orderId.value)
	if (result.code === 200) {
		uni.showToast({
			icon: 'success',
			title: '付款成功',
		})
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/list/list',
			})
		}, 1000)
	} else {
		uni.showToast({
			title: result.msg,
			icon: 'error'
		})
	}

}


const addCaiYangOrder = async () => {
	const goodsData = {
		shopId: dataDetail.shopId,
		orderSubmitDetailList: toRaw(dataList.value)
	}
	const result: any = await submitAPI(goodsData)
	if (result.code === 200) {
		alertDialog.value.open()
		orderId.value = result.data.orderId
	} else {
		uni.hideLoading()
		uni.showToast({
			title: result.msg,
			icon: 'error',
		})
	}
}

const dialogClose = () => {
	const item = {
		id: orderId.value,
		totalNumber: dataDetail.totalNumber,
		totalPrice: dataDetail.totalPrice,
		orderListDetailList: toRaw(dataList.value)
	}
	uni.navigateTo({
		url: '/pages/waitOrder/waitOrder?item=' + encodeURIComponent(JSON.stringify(item)),
	})
}
</script>

<style lang="scss">
.total {
	background: #f5f5f5;
	width: 100%;
	height: 100%;
	position: absolute;

	.goods {
		background: white;
		border-radius: 20rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		width: 700rpx;

		.item {
			margin-left: 20rpx;
			display: flex;

			.img-box {
				width: 160rpx;
				height: 160rpx;
				border-radius: 16rpx;
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
					margin-top: 10rpx;
				}

				.right-center {
					font-size: 28rpx;
					font-weight: 200;
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

		.sent {
			display: flex;
			width: 680rpx;
			margin-left: auto;

			.serve {
				width: 200rpx;
				display: block;
				font-weight: 400;
				font-size: 1.1rem;
				line-height: 100rpx;
			}

			.desc {
				width: 400rpx;
				text-align: end;
				margin-right: auto;
				font-weight: 600;
				line-height: 100rpx;
			}
		}

		.list {
			.labelList {
				display: flex;
				margin: 50rpx 0 50rpx 30rpx;
				border-radius: 20rpx;
				width: 90%;
				background: #effdf1;

				.orderList {
					text {
						display: block;
						margin: 20rpx 0 20rpx 0;
					}

					text:first-child {
						margin-top: 30rpx;
					}

					text:last-child {
						margin-top: 30rpx;
					}
				}
			}
		}
	}

	.bottom {
		background-color: white;
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		height: 100rpx;
		border-radius: 20rpx 20rpx 0 0;
		justify-content: center;
		align-items: center;

		button {
			background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
			border-radius: 40rpx;
			width: 240rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
			color: white;
			font-size: 0.9rem;
		}
	}
}
</style>