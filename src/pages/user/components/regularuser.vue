<template>
	<scroll-view enable-back-to-top class="viewport" scroll-y>
		<view class="profile">
			<view class="overview">
				<view>
					<navigator url="/pages/personalInfo/personalInfo" open-type="navigate"
						hover-class="navigator-hover">
						<image class="avatar" mode="aspectFill"></image>
					</navigator>
				</view>
				<view class="meta">
					<view class="nickname">
						{{ memberStore.profile.nickname }}
					</view>
					<view v-if="memberStore.profile.roles.length > 2">
						<view class="userTypes">
							<view class="userType"> {{ memberStore.profile.roles[0].description }} </view>
							<view class="userType"> {{ memberStore.profile.roles[1].description }} </view>
						</view>
					</view>
					<view v-else>
						<view class="userTypes" v-for="userType in memberStore.profile.roles" :key="userType.id">
							<view class="userType"> {{ userType.description }} </view>
						</view>
					</view>
					<view class="userType" @click="checkroles">查看我的所有角色</view>
				</view>
			</view>
		</view>
		<!-- 我的订单 -->
		<view class="orders" v-show="memberStore.profile.roles[0].id != 6">
			<view class="title">
				订单中心
				<view class="navigator" @click="changeToOrderPage">
					全部订单<text class="icon-right"></text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="section">
				<view v-for="item in orderTypes" :key="item.state" class="navigator" hover-class="none"
					@click="changeToOrderStatus(item)">
					<u-icon :name="item.icon" size="56rpx" class="section_icon"></u-icon>
					<text class="section_text">{{ item.text }}</text>
				</view>
			</view>
		</view>
		<!-- 其他应用 -->
		<view class="others">
			<view>管理</view>
			<view v-for="item in others" :key="item.state" class="navigator" hover-class="none">
				<view class="other" @click="changeToOtherPage(item)">
					<u-icon :name="item.icon" size="56rpx" class="others_icon"></u-icon>
					<text class="others_text">{{ item.text }}</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
import { useMemberStore, useOrderType, useOtherTypes } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import { onBeforeMount } from 'vue'

const orderTypes = [
	{ state: 0, text: '待支付', icon: '/static/user/toBePaid.png' },
	{ state: 1, text: '配送中', icon: '/static/user/payment.png' },
	{ state: 2, text: '已完成', icon: '/static/user/complete.png' },
]
const others = [
	{ state: 1, text: '运输中', icon: '/static/user/pendingProcessing.png' },
	// { state: 2, text: '未检测', icon: '/static/user/detecting2.png' },
	{ state: 3, text: '已完成', icon: '/static/user/complete2.png' },
	{ state: 4, text: '全部订单', icon: '/static/user/all.png' },
	{ state: 5, text: '商品管理', icon: '/static/user/manage.png' },
	{ state: 6, text: '我的发票', icon: '/static/user/invoice.png' },
]

// 获取个人信息
const memberStore = useMemberStore()
const isRoles = uni.getStorageSync('roles')
const checkroles = () => {
	uni.navigateTo({
		url: '/pages/roles/roles',
	})
}
//跳转到订单页面全部
const changeToOrderPage = () => {
	uni.switchTab({
		url: '/pages/list/list',
	})
}
const changeToOrderStatus = (item: any) => {
	useOrderType().setOrderTypes(item)
	uni.switchTab({
		url: `/pages/list/list`,
	})
}

const changeToOtherPage = (item: any) => {
	if (item.state == 5) {
		uni.showToast({
			icon: 'error',
			title: '策划中!',
		})
	} else if (item.state == 6) {
		uni.navigateTo({
			url: '/pages/receipt/receipt',
		})
	} else if (item.state == 7) {
		if (isRoles.isGovernmentStaff) {
			uni.navigateTo({
				url: '/pages/governmentAgencies/index',
			})
		} else {
			uni.showToast({
				icon: 'error',
				title: '您没有这个权限！',
			})
		}
	} else {
		useOtherTypes().setOtherType(item)
		uni.switchTab({
			url: `/pages/list/list`,
		})
	}
}
onLoad(() => { })
onBeforeMount(() => { })
</script>
<style lang="scss" scoped>
page {
	height: 100vh;
	background-color: #f7f7f8;
}

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
		.userType {
			display: flex;
			justify-content: space-between;
			padding: 10rpx;
			height: 40rpx;
			max-width: 266rpx;
			margin-top: 24rpx;
			margin-bottom: 16rpx;
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

		.navigator {
			margin-left: 20rpx;
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