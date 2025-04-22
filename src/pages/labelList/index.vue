<template>
    <view class="list">
        <view v-for="item in labelList" :key=item.id class="item">
            <view style="flex:1;text-align: center;line-height:100rpx ;">
                <text>
                    {{ item.label }}
                </text>
            </view>
            <view style="width: 160rpx;">
                <up-button text="删除" color="red" shape="circle" @click="deleteLabel(item.id)"></up-button>
            </view>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="新增分类" color="green" shape="circle" @click="sure"></up-button>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { deleteGoodsCategoryListAPI, getGoodsCategoryListAPI } from '@/services/home'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'


const labelList: any = ref([])

const getLabelList = async () => {
    const result: any = await getGoodsCategoryListAPI('shop_type')
    if (result.code === 200) {
        const list = result.data[0].children
        labelList.value = list.map((item: any) => Object.assign(item, { name: item.label }))
    } else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }
}

const sure = () => {
    uni.navigateTo({
        url: '/pages/addType/index',
    })
}

const deleteLabel = async (id: string) => {
    const res: any = await deleteGoodsCategoryListAPI(id)
    if (res.code === 200) {
        uni.showToast({
            title: '删除成功',
            icon: 'success'
        })
        getLabelList()
    } else {
        uni.showToast({
            title: res.msg,
            icon: 'error'
        })
    }
}


onShow(() => {
    getLabelList()
})

</script>
<style scoped lang="scss">
.list {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 32rpx;

    .item {
        width: 100%;
        height: 100rpx;
        display: flex;
        margin: 40rpx 0;
        border-radius: 20rpx;
        background: #F2F1F1;
        justify-content: center;
        align-items: center;
    }

    .footer {
        margin-top: 6rpx;
        height: 100rpx;
        margin-top: auto;
        display: flex;
        justify-content: center;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        width: 710rpx;


        .bottom {
            width: 40%;
            height: 80rpx;
            margin: 0 15rpx;
        }
    }
}
</style>
