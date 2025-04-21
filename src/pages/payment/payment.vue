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
			<view style="margin-left: 50rpx">
				<text style="font-weight: 300">共 {{ dataDetail.totalNumber }} 件 </text><text>合计：<text
						style="color: red; font-size: 24rpx">￥<text style="font-size: 40rpx">{{ totalPrice }}</text>
					</text>
				</text>
			</view>
			<button @click="submitOrder">提交订单</button>
			<button @click="pindan" style="width: 100rpx;">拼</button>
		</view>
	</view>

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog cancelText="放弃" confirmText="确认付款" content="是否确认本次付款？" @confirm="addOrder"
			@close="dialogClose"></uni-popup-dialog>
	</uni-popup>

	<uni-popup ref="pindanDialog" type="dialog">
		<view
			style="width: 600rpx;height: 320rpx;background: white;border-radius: 40rpx;display: flex;flex-direction: column;align-items: center;">
			<text style=" font-size: 20px;padding: 20rpx;">
				拼单
			</text>
			<up-form style="padding: 20rpx;" labelPosition="left" labelWidth="160rpx">
				<up-form-item label="手机号:"><up-input v-model="pindanPhone" placeholder="请输入要拼单的手机号">
					</up-input>
				</up-form-item>
			</up-form>
			<view style="display: flex;justify-content: space-around;width: 100%;margin-top: 40rpx;">
				<button style="flex: 1;border-radius: 0 0  0 40rpx ;" @click="() => pindanDialog.close()">取消</button>
				<button
					style="background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);flex: 1;border-radius: 0 0 40rpx 0; color: white;"
					@click="addPindanOrder">确认</button>
			</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
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
	totalPrice.value = new Decimal(dataDetail.totalPrice).add(2).add(new Decimal((uni.getStorageSync('address').floor || 1 - 1) * 0.5))
})

onShow(() => {
	totalPrice.value = new Decimal(dataDetail.totalPrice).add(2).add(new Decimal((uni.getStorageSync('address').floor || 1 - 1) * 0.5))
})

const pindanPhone = ref<string | null>(null)

//控制付费弹出框
const alertDialog = ref()

//控制拼单弹出框
const pindanDialog = ref()

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


const submitOrder = async () => {
	let addressId = uni.getStorageSync('address').id
	const goodsData: any = {
		shopId: dataDetail.shopId,
		orderSubmitDetailList: toRaw(dataList.value),
		addressId,
		deliveryFee: new Decimal((uni.getStorageSync('address').floor || 1 - 1) * 0.5).add(2)
	}
	if (pindanPhone.value) goodsData.groupPhone = pindanPhone.value
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

const pindan = () => {
	pindanDialog.value.open()
}

const addPindanOrder = () => {
	if (!pindanPhone.value) {
		pindanDialog.value.close()
		return
	}

	if (!/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/.test(pindanPhone.value as string)) {
		uni.showToast({
			icon: 'error',
			title: '手机号格式错误'
		})
		return
	}
	pindanDialog.value.close()
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
			width: 200rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
			color: white;
			font-size: 0.9rem;
		}
	}
}
</style>