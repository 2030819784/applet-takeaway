<template>
	<view class="total">
		<Address @saveShops="saveShops" @getShops="getShops" ref="son"></Address>
		<view class="goods">
			<view class="item" v-for="item in dataList" :key="item.id">
				<view class="img-box">
					<image class="img" :src="item.imgUrl"></image>
				</view>
				<view class="item-right">
					<text class="right-top">{{ item.goodsName }}</text>
					<text class="right-center">{{ item.goodsName }}</text>
					<view class="right-bottom">
						<view style="color: red">
							<text style="font-size: 24rpx">￥</text>
							<text style="font-size: 40rpx">{{ item.price }}</text>
						</view>
						<view class="counter"> x {{ item.number }} </view>
					</view>
				</view>
			</view>
			<view class="sent" v-if="goodsType">
				<text class="serve">配送服务</text>
				<view class="desc">
					<text @click="changePayMethod">{{ payMethod ? '快递' : '自送' }}</text>
				</view>
			</view>
			<view class="list" v-if="!goodsType && !jianceId">
				<text style="position: relative; top: 30rpx; left: 30rpx">检测订单列表</text>
				<radio-group @change="getGoods">
					<label v-for="(item, index) in jianCeList" :key="item.orderNo" class="labelList">
						<radio style="margin: 13rpx 0 0 10rpx" :value="item.id" :checked="index == current" />
						<view class="orderList">
							<text>商品名:{{ item.goodsName }}</text>
							<text>商品价格:{{ item.price }}</text>
							<text>订单编号:{{ item.orderNo }}</text>
							<text>手机号:{{ item.phone }}</text>
							<text>时间:{{ item.orderTime }}</text>
						</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view style="height: 100rpx"> </view>
		<view class="bottom">
			<view style="margin-left: 100rpx">
				<text style="font-size: 20rpx; font-weight: 300">共{{ dataDetail.totalNumber }}件</text><text>合计：<text
						style="color: red; font-size: 24rpx">￥<text style="font-size: 40rpx">{{ totalPrice }}</text>
					</text>
				</text>
			</view>
			<button v-if="goodsType" @click="addOrder">提交订单</button>
			<button v-else @click="addCaiYangOrder">提交订单</button>
		</view>
	</view>

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog cancelText="放弃" confirmText="继续付款" content="是否放弃本次付款？" @confirm="addOrder"
			@close="dialogClose"></uni-popup-dialog>
	</uni-popup>
</template>

<script lang="ts" setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { onMounted, ref } from 'vue'
	import type { goodsListType } from '@/types/payment'
	import type { WXAllOrderType } from '@/types/order'
	import { submitAPI } from '@/services/order'
	import { preOrderAPI, getLogisticeFeeAPI } from '@/services/orderLogistics'
	import Decimal from 'decimal.js'
	import Address from '@/components/address'
	import { addSpecimenOrderAPI } from '@/services/specime'
	import { getUnSampleCheckOrderListAPI } from '@/services/order'
	import { useMemberStore } from '@/stores'
	const saveShops = () => {
		uni.setStorageSync('shop', {
			dataList: dataList.value,
			dataDetail: {
				totalNumber: dataDetail.totalNumber,
				totalPrice: dataDetail.totalPrice,
				address: dataDetail.address,
			},
		})
	}

	const getShops = () => {
		const shop = uni.getStorageSync('shop')
		dataList.value = shop.dataList
		dataDetail.totalNumber = shop.dataDetail.totalNumber
		dataDetail.totalPrice = shop.dataDetail.totalPrice
		dataDetail.address = shop.dataDetail.address
		totalPrice.value = new Decimal(dataDetail.totalPrice)
		if (payMethod.value) {
			totalLogisticsFee = new Decimal(0)
			logisticsFee = new Decimal(0)
			//计算邮费
			preOrder()
		}
	}

	//判断跳转来源(购物车(true)还是商品购买(false))
	let state : boolean = false
	//判断购买的是检测商品true还是采样商品fasle
	let goodsType = true
	const dataList = ref<goodsListType[]>([])

	type dataType = {
		totalNumber : number
		totalPrice : Decimal
		address : string
		checkAddress : string
	}
	const dataDetail : dataType = {
		totalNumber: 0,
		totalPrice: new Decimal(0),
		address: '',
		checkAddress: '',
	}

	let logisticsFee = new Decimal(0)

	const totalPrice = ref<Decimal>()

	onLoad(async (options) => {
		if (options!.cart) {
			state = true
			dataList.value = JSON.parse(decodeURIComponent(options!.cart))
			dataDetail.totalNumber = JSON.parse(options!.totalNumber)
			dataDetail.totalPrice = new Decimal(JSON.parse(options!.totalPrice))
			dataDetail.checkAddress = JSON.parse(decodeURIComponent(options!.checkAddress))
			goodsType = dataDetail.checkAddress == null ? false : true
		} else if (options!.goods) {
			state = false
			const data = JSON.parse(decodeURIComponent(options!.goods))
			dataList.value = [data]
			dataDetail.totalNumber = data.number
			dataDetail.totalPrice = new Decimal(data.price)
			dataDetail.address = data.address
			goodsType = dataDetail.address == null ? false : true
		}
		totalPrice.value = new Decimal(dataDetail.totalPrice)
	})

	onMounted(() => {
		if (!goodsType && !jianceId) {
			//单独出现的采样商品，并且不是从预约订单页面跳转过来的
			getJianCeData()
		}
		if (payMethod.value && goodsType) {
			//计算邮费
			preOrder()
		}
	})

	//快递方式 (0 自邮 1 快递)
	const payMethod = ref(1)
	//改变快递方式
	const changePayMethod = () => {
		uni.showLoading({ mask: true })
		payMethod.value = payMethod.value ? 0 : 1
		if (payMethod.value) {
			//计算邮费
			preOrder()
		} else {
			totalPrice.value = Decimal.sub(totalPrice.value!, Decimal.div(totalLogisticsFee, 100))
			logisticsFee = new Decimal(0)
			totalLogisticsFee = new Decimal(0)
		}
		uni.hideLoading()
	}

	let orderId = ''

	//生成32位数随机id （nanoid uuid导入失败）
	const randomString = () => {
		let str = 'ABCDEFGHIJKIMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let num = ''
		for (let i = 0; i < 32; i++) {
			num += str.charAt(Math.floor(Math.random() * str.length))
		}
		return num
	}

	//预下单
	const preOrder = async () => {
		if (state) {
			order(dataDetail.checkAddress)
		} else {
			order(dataDetail.address)
		}
	}

	const son = ref<any>(null)

	const order = async (address : string) => {
		orderId = randomString()
		const data = {
			contactInfoList: [
				{
					address: son.value.address,
					contactType: 1,
				},
				{
					address,
					contactType: 2, //收件方
				},
			],
			expressTypeId: 2,
			orderId,
		}
		const result : any = await preOrderAPI(data)
		if (result.code === 200) {
			getLogisticeFee()
		} else {
			uni.showToast({
				icon: 'error',
				title: result.msg,
			})
		}
	}
	let totalLogisticsFee = new Decimal(0)

	//查询邮费
	const getLogisticeFee = async () => {
		const result : any = await getLogisticeFeeAPI(orderId)
		if (result.code == 200) {
			for (let key in result.data) {
				logisticsFee = Decimal.add(logisticsFee, new Decimal(result.data[key].value))
			}
			totalLogisticsFee = totalLogisticsFee.add(logisticsFee)
			totalPrice.value = Decimal.add(totalPrice.value!, Decimal.div(logisticsFee, 100))
		} else {
			uni.showToast({
				icon: 'error',
				title: result.msg,
			})
		}
	}

	//控制弹出框
	const alertDialog = ref()

	const totalData : WXAllOrderType = {
		orderNo: '',
		response: {
			appId: '',
			noceStr: '',
			packageVal: '',
			package: '',
			paySign: '',
			signType: '',
			timeStamp: '',
		},
	}

	let goodsData = {}

	const addOrder = async () => {
		uni.showLoading({ mask: true })
		if (state) {
			//购物车
			const cartIds = []
			for (let key in dataList.value) {
				cartIds.push(dataList.value[key].id)
			}
			goodsData = {
				cartIds,
				deliveryMode: payMethod.value, //快递方式
				fromCart: true,
				logisticsFee: totalLogisticsFee, //物流费用
				orderCreateParams: dataList.value,
				totalPrice: totalPrice.value!.toString(),
			}
		} else {
			//商品直付
			goodsData = {
				deliveryMode: payMethod.value, //快递方式
				fromCart: false,
				logisticsFee: totalLogisticsFee, //物流费用
				orderCreateParams: dataList.value,
				totalPrice: totalPrice.value!.toString(),
			}
		}
		const result : any = await submitAPI(goodsData)
		if (result.code == 200) {
			totalData.response = result.data.response
			totalData.orderNo = result.data.orderNo
			totalData.response.package = totalData.response.packageVal
			if (uni.getStorageSync('sample')) {
				const data = {
					...uni.getStorageSync('sample'),
					orderNo: result.data.orderNo,
				}
				const results = await addSpecimenOrderAPI(data)
				if (results.code == 200) uni.removeStorageSync('sample')
			}

			uni.requestPayment({
				...(totalData.response as any),
				success: async () => {
					uni.hideLoading()
					uni.showToast({
						title: '购买成功',
						icon: 'success',
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/list/list',
						})
					}, 1000)
				},
				fail: (err : any) => {
					if (JSON.stringify(err).includes('fail cancel')) {
						alertDialog.value.open()
						uni.hideLoading()
					} else {
						uni.hideLoading()
						uni.showToast({
							title: result.datas.msg,
							icon: 'error',
						})
					}
				},
			})
		} else {
			uni.hideLoading()
			uni.showToast({
				title: result.msg,
				icon: 'error',
			})
		}
	}
	//检测订单列表
	let jianCeList = ref<any>([])

	const jianceId = uni.getStorageSync('orderId') ? true : false

	const memberStore = useMemberStore()
	const getJianCeData = async () => {
		const result : any = await getUnSampleCheckOrderListAPI({
			userId: memberStore.profile.id,
		})

		if (result.code == 200) jianCeList.value = result.data.list
		if (result.data.list.length == 0) {
			uni.showToast({
				icon: 'error',
				title: '请购买检测商品',
			})

			setTimeout(() => {
				uni.switchTab({
					url: '/pages/index/index',
				})
			}, 1000)
		}
	}
	let current = 0
	//获取选中的检测商品
	const getGoods = (item : any) => {
		for (let i = 0; i < jianCeList.value.length; i++) {
			if (jianCeList.value[i].id === item.detail.value) {
				current = i
				break
			}
		}
	}

	const addCaiYangOrder = async () => {
		uni.showLoading({ mask: true })
		const goodsData = {
			deliveryMode: 0, //快递方式
			fromCart: false,
			logisticsFee: 0, //物流费用
			orderCreateParams: dataList.value,
			totalPrice: totalPrice.value!.toString(),
			orderId: null,
		}
		//如果缓存中存在检测商品id，则自动绑定采样商品
		if (jianceId) goodsData.orderId = uni.getStorageSync('orderId')
		//手动选择的检测商品
		else goodsData.orderId = jianCeList.value[current].id

		const result : any = await submitAPI(goodsData)
		if (result.code == 200) {
			totalData.response = result.data.response
			totalData.orderNo = result.data.orderNo
			totalData.response.package = totalData.response.packageVal
			uni.requestPayment({
				...(totalData.response as any),
				success: async () => {
					uni.hideLoading()
					uni.showToast({
						title: '购买成功',
						icon: 'success',
					})
					//从缓存中删除该检测订单
					if (uni.getStorageSync('orderId')) uni.removeStorageSync('orderId')
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/list/list',
						})
					}, 1000)
				},
				fail: (err : any) => {
					if (JSON.stringify(err).includes('fail cancel')) {
						alertDialog.value.open()
						uni.hideLoading()
					} else {
						uni.hideLoading()
						uni.showToast({
							title: result.datas.msg,
							icon: 'error',
						})
					}
				},
			})
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
			dataList: dataList.value, //商品信息数组
			goodsPrice: dataDetail.totalPrice, //商品总价
			logisticsFee, //运费
			orderNo: totalData.orderNo, //订单编号
			totalPrice: totalPrice.value, //最终付款价格
			payMethod: payMethod.value,
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