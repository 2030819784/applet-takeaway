<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="商品名称:"><up-input v-model="goods.name"
                        placeholder="请输入商品名称"></up-input></up-form-item>
                <up-form-item label="商品单价:"><up-input v-model="goods.price"
                        placeholder="0.00"></up-input></up-form-item>
                <up-form-item label="是否上架:">
                    <picker @change="getPutAway" mode='selector' :value="putAway" :range="['否', '是']">
                        {{ putAway }}
                    </picker>
                </up-form-item>
                <up-form-item label="商品图片:">
                    <view style="display: flex;">
                        <image style="border-radius: 20rpx;width: 200rpx;height: 200rpx;margin: 20rpx;"
                            :src="goodsPhoto"></image>
                        <u-icon width="52rpx" height="52rpx" name="../../../../static/home/upload.png"
                            @click="chooseImage">
                        </u-icon>
                    </view>
                </up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="删除" color="red" shape="circle" @click="deleteGoods"></up-button>
            </view>
            <view class="bottom">
                <up-button text="放弃修改" color="green" shape="circle" @click="cancel"></up-button>
            </view>
            <view class="bottom">
                <up-button text="确认修改" color="orange" shape="circle" @click="sure"></up-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { deleteGoodsAPI } from '@/services/shop';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue'


const goods: any = reactive({
    name: '',
    price: undefined,
    isPutaway: 0,
    id: '',
})

const goodsPhoto = ref('')

const putAway = ref("是")

const getPutAway = (item: number) => {
    putAway.value = item.detail.value === "0" ? "否" : "是"
    goods.isPutaway = Number(item.detail.value)
}

const chooseImage = () => {
    uni.chooseImage(
        {
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                goodsPhoto.value = res.tempFilePaths.toString()
            },
            fail: () => {
                uni.showToast({
                    icon: 'error',
                    title: '图片选择失败',
                })
            }
        },

    )
}


const uploadImage = () => {
    uni.uploadFile({
        url: 'http://localhost:8081/goods/save',
        filePath: goodsPhoto.value,
        name: 'goodsPhoto',
        formData: goods,
        header: { "Content-Type": "multipart/form-data" },
        success: (result) => {
            uni.showToast({
                title: '商品修改成功',
                icon: 'success'
            })
            setTimeout(() => {
                uni.navigateBack()
            }, 500)
        },
        fail: (fail) => {
            uni.showToast({
                icon: 'error',
                title: '图片上传失败',
            })
        },
    })
}


onLoad(({ data }) => {
    const goodsDetail = JSON.parse(decodeURIComponent(data))
    for (const key in goods) {
        goods[key] = goodsDetail[key]
    }
    goodsPhoto.value = goodsDetail.goodsPhoto
})

const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    uploadImage()
}

const deleteGoods = async () => {
    const result = await deleteGoodsAPI(goods.id)
    if (result.code === 200) {
        uni.showToast({
            title: '删除成功',
            icon: 'success'
        })
        setTimeout(() => {
            uni.navigateBack()
        }, 500)
    } else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }
}
</script>
<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    padding: 40rpx;
    background: linear-gradient(180deg, #e5fdf5 50%, rgba(255, 255, 255, 0) 99%);

    text {
        margin: 20rpx;
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
