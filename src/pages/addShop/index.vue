<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="商铺名称:"><up-input v-model="shop.name"></up-input></up-form-item>
                <up-form-item label="商铺类别:">
                    <picker @change="getType" mode='selector' :value="index" :range="type.map(item => item.label)">
                        {{ type[index]?.label }}
                    </picker>
                </up-form-item>
                <up-form-item label="联系电话:"><up-input v-model="shop.phone"></up-input></up-form-item>
                <up-form-item label="商铺配送费:"><up-input v-model="shop.deliveryCost"></up-input></up-form-item>
                <up-form-item label="开业时间:"><up-input v-model="shop.openTime"></up-input></up-form-item>
                <up-form-item label="打烊时间:"><up-input v-model="shop.restTime"></up-input></up-form-item>
                <up-form-item label="商铺描述:"><up-input v-model="shop.description"></up-input></up-form-item>
                <up-form-item label="图片:">
                    <u-icon width="52rpx" height="52rpx" name="../../../../static/home/upload.png"
                        @click="chooseImage"></u-icon>
                </up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="取消" color="red" shape="circle" @click="cancel"></up-button>
            </view>
            <view class="bottom">
                <up-button text="确认" color="orange" shape="circle" @click="sure"></up-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { getGoodsCategoryListAPI } from '@/services/home'
import { addShopAPI } from '@/services/shop'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'


const shop: any = {
    name: '',
    phone: '',
    deliveryCost: '',
    openTime: '',
    restTime: '',
    description: '',
    photo: [],
    typeId: '',
}

const type: any = ref([])
const index = ref(0)


//获取商品分类
const getCategoryList = async () => {
    const result: any = await getGoodsCategoryListAPI('shop_type')
    if (result.code === 200) {
        type.value = result.data[0].children
        console.log(type.value)
    }
}

onLoad(() => {
    getCategoryList()
})

const getType = (item: any) => {
    index.value = item.detail.value
    shop.typeId = type.value[index.value].id
}

const chooseImage = () => {
    uni.chooseImage(
        {
            count: 1,
            success: (list) => {
                shop.photo = list
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
        files: shop.photo,
        name: shop.name,
        formData: shop,
        success: (result) => {
            console.log(result)
        },
        fail: (fail) => {
            uni.showToast({
                icon: 'error',
                title: '图片上传失败',
            })
        },
    })
}

const save = async () => {
    if (shop.typeId === '') shop.typeId = type.value[0].id
    const result = await addShopAPI(shop)
    console.log(result)
}

const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    // uploadImage()
    save()
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