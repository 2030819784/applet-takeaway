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
                <up-form-item label="开业时间:">
                    <picker mode="time" :value="shop.openTime" @change="changeOpenTime">
                        <view class="uni-input">{{ shop.openTime }}</view>
                    </picker>
                </up-form-item>
                <up-form-item label="打烊时间:">
                    <picker mode="time" :value="shop.restTime" @change="changeRestTime">
                        <view class="uni-input">{{ shop.restTime }}</view>
                    </picker>
                </up-form-item>
                <up-form-item label="商铺描述:"><up-input v-model="shop.description"></up-input></up-form-item>
                <up-form-item label="商铺图片:">
                    <view style="display: flex;">
                        <image v-if="shopPhoto" style="border-radius: 20rpx;width: 200rpx;height: 200rpx;margin: 20rpx;"
                            :src="shopPhoto"></image>
                        <u-icon width="52rpx" height="52rpx" name="../../../../static/home/upload.png"
                            @click="chooseImage">
                        </u-icon>
                    </view>
                </up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="删除" color="red" shape="circle" @click="deleteShop"></up-button>
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
import { getGoodsCategoryListAPI, getShopMessageAPI } from '@/services/home'
import { deleteShopAPI } from '@/services/shop';
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'


const shop: any = reactive({
    name: '',
    phone: '',
    deliveryCost: '',
    openTime: '09:01',
    restTime: '21:01',
    description: '',
    typeId: '',
    shopId: '',
})

const shopPhoto = ref('')
const type: any = ref([])
const index = ref(0)

//获取商品分类
const getCategoryList = async () => {
    const result: any = await getGoodsCategoryListAPI('shop_type')
    if (result.code === 200) {
        type.value = result.data[0].children
    } else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }
}

const changeOpenTime = (e) => {
    shop.openTime = e.detail.value
}
const changeRestTime = (e) => {
    shop.restTime = e.detail.value
}

onLoad(({ shopId }) => {
    getCategoryList()
    shop.shopId = shopId
    getShopDetail(shopId)
})

const getShopDetail = async (id: string) => {
    const result: any = await getShopMessageAPI(id)
    if (result.code === 200) {
        type.value.forEach((item, ix) => {
            if (item.id === result.data.typeId) {
                index.value = ix
                return
            }
        })
        shop.typeId = result.data.ix
        shopPhoto.value = result.data.shopPhoto
        for (let key in result.data) {
            shop[key] = result.data[key]
        }
    } else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }

}

const getType = (item: any) => {
    index.value = item.detail.value
    shop.typeId = type.value[index.value].id
}

const chooseImage = () => {
    uni.chooseImage(
        {
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                shopPhoto.value = res.tempFilePaths.toString()
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
    if (shop.typeId === '') shop.typeId = type.value[0].id
    uni.uploadFile({
        url: 'http://localhost:8081/shop/register',
        filePath: shopPhoto.value,
        name: 'shopPhoto',
        formData: shop,
        header: { "Content-Type": "multipart/form-data" },
        success: (result) => {
            uni.showToast({
                title: '商铺修改成功',
                icon: 'success'
            })
            setTimeout(() => {
                uni.navigateBack()
            }, 500)
        },
        fail: (fail) => {
            console.log(fail, shop)
            uni.showToast({
                icon: 'error',
                title: '图片上传失败',
            })
        },
    })
}

const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    uploadImage()
}

const deleteShop = async () => {
    const result = await deleteShopAPI(shop.shopId)
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
