<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="商铺名称:"><up-input v-model="shop.name"
                        placeholder="请输入商铺名称"></up-input></up-form-item>
                <up-form-item label="商铺类别:">
                    <picker @change="getType" mode='selector' :value="index" :range="type.map(item => item.label)">
                        {{ type[index]?.label }}
                    </picker>
                </up-form-item>
                <up-form-item label="联系电话:"><up-input v-model="shop.phone"
                        placeholder="请输入联系电话"></up-input></up-form-item>
                <up-form-item label="商铺配送费:">
                    <picker @change="selectDeliveryCost" mode='selector' :value="shop.deliveryCost" :range="price">
                        {{ shop.deliveryCost }}
                    </picker>
                </up-form-item>
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
                <up-form-item label="商铺描述:"><up-input v-model="shop.description"
                        placeholder="请输入商铺描述"></up-input></up-form-item>
                <up-form-item label="图片:">
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
import { getUserInfoAPI } from '@/services/user';
import { useMemberStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'


const shop: any = reactive({
    name: '',
    phone: '',
    deliveryCost: 0,
    openTime: '09:01',
    restTime: '21:01',
    description: '',
    typeId: '',
})
const shopPhoto = ref('')
const type: any = ref([])
const index = ref(0)
const price = ref(Array.from(new Array(21), (item, index) => item = index))


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

onLoad(() => {
    getCategoryList()
})

const getType = (item: any) => {
    index.value = item.detail.value
    shop.typeId = type.value[index.value].id
}

const selectDeliveryCost = (item: any) => {
    shop.deliveryCost = item.detail.value
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
        success: () => {
            uni.showToast({
                title: '商铺创建成功',
                icon: 'success'
            })
            judgeRole()
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

const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    if (!shop.name) {
        uni.showToast({
            icon: 'error',
            title: '请输入商铺名称'
        })
        return
    }
    if (!shop.phone) {
        uni.showToast({
            icon: 'error',
            title: '请输入联系电话'
        })
        return
    }
    if (!/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/.test(shop.phone)) {
        uni.showToast({
            icon: 'error',
            title: '手机号格式错误'
        })
        return
    }
    if (!shopPhoto.value) {
        uni.showToast({
            icon: 'error',
            title: '请上传图片'
        })
        return
    }
    uploadImage()
}

const judgeRole = async () => {
    const user = uni.getStorageSync('user')
    const result = user.roles.some((item) => item.name === 'shoper')
    if (!result) {
        const res: any = await getUserInfoAPI()
        if (res.code === 200) {
            user.roles = res.data.roles
            const memberStore = useMemberStore()
            memberStore.setProfile(user)
        }
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
