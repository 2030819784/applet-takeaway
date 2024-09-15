<template>
  <!-- 采样 -->
  <view v-if="item">
    <view class="top">
      <view class="goods">
        <view class="goods_info">
          <view class="goods_image">
            <image :src="item?.list?.skuList[0]?.imgList[0]?.objName"></image>
          </view>
          <view class="goodsInfo">
            <view class="title">{{ item.list?.goodName }}</view>
            <view class="describe">{{ item.details }}</view>
          </view>
        </view>
        <view class="price">￥{{ item.actualPay || 0 }}</view>
      </view>
      <view class="orderInfo">
        <view class="Info">
          <view class="label">
            <text>订单编号：</text>
            <view class="Info">{{ item.orderNo }}</view>
          </view>
          <view class="label">
            <text>下单时间：</text>
            <view class="Info">{{ item.orderTime }}</view>
          </view>
          <view class="label">
            <text>下单人姓名：</text>
            <view class="Info">{{ item.name }}</view>
          </view>
          <view class="label">
            <text>电话：</text>
            <view class="Info">{{ item.phone }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-if="item.state == 20">
      <view class="item">
        <view class="left">采样店铺</view>
        <view class="right"> {{ item.list?.shopName }}</view>
      </view>
      <view class="item">
        <view class="left">采样店铺定位</view>
        <view class="right">{{ item.list?.shopDetailedAddress }}</view>
      </view>
      <view class="item">
        <view class="left">采样点现场照片</view>
        <view class="right">
          <button @click="showScenePhotoActionSheet">上传</button>
          <view v-for="image in addressList" :key="image">
            <image class="image" :src="image.path" mode="scaleToFill" />
            <!-- <video :src="image" class="image"></video> -->
          </view>
        </view>
      </view>
      <view class="item">
        <view class="left">被采样人身份确认</view>
        <view class="right">
          <button v-if="isComfirm">已确认</button>
          <button v-else @click="comfirmIdentity">去确认</button>
        </view>
      </view>
      <view class="item">
        <view class="left">样品照片</view>
        <view class="right">
          <button @click="showsamplePhotoActionSheet">上传</button>
          <view v-for="image in sampleList" :key="image">
            <image class="image" :src="image.path" mode="scaleToFill" />
            <!-- <video :src="image" class="image"></video> -->
          </view>
        </view>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">样品类型</view>
          <view class="right">
            <uni-data-select
              v-model="form.sampleMode"
              :localdata="samlingCategoryList"
              placeholder="请选择"
              :clear="true"
            ></uni-data-select>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-else-if="showUpdate">
      <view class="item">
        <view class="left">采样店铺</view>
        <view class="right"> {{ item.list?.shopName }}</view>
      </view>
      <view class="item">
        <view class="left">采样店铺定位</view>
        <view class="right">{{ item.list?.shopDetailedAddress }}</view>
      </view>
      <view class="item">
        <view class="left">采样点现场照片</view>
        <view class="right">
          <button @click="showScenePhotoActionSheet">上传</button>
          <view v-for="image in addressList" :key="image">
            <image class="image" :src="image.path" mode="scaleToFill" />
            <!-- <video :src="image" class="image"></video> -->
          </view>
        </view>
      </view>
      <view class="item">
        <view class="left">被采样人身份确认</view>
        <view class="right">
          <button v-if="isComfirm">已确认</button>
          <button v-else @click="comfirmIdentity">去确认</button>
        </view>
      </view>
      <view class="item">
        <view class="left">样品照片</view>
        <view class="right">
          <button @click="showsamplePhotoActionSheet">上传</button>
          <view v-for="image in sampleList" :key="image">
            <image class="image" :src="image.path" mode="scaleToFill" />
            <!-- <video :src="image" class="image"></video> -->
          </view>
        </view>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">样品类型</view>
          <view class="right">
            <uni-data-select
              v-model="form.sampleMode"
              :localdata="samlingCategoryList"
              placeholder="请选择"
              :clear="true"
            ></uni-data-select>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-else>
      <view class="item">
        <view class="left">采样店铺</view>
        <view class="right"> {{ item.list?.shopName }}</view>
      </view>
      <view class="item">
        <view class="left">采样店铺定位</view>
        <view class="right">{{ item.list?.shopDetailedAddress }}</view>
      </view>
      <view class="item">
        <view class="left">采样点现场照片</view>
        <view class="right">
          <view v-for="image in result?.samplingAddressImages" :key="image">
            <image class="image" :src="image.url" mode="scaleToFill" />
          </view>
        </view>
      </view>
      <view class="item">
        <view class="left">样品照片</view>
        <view class="right">
          <view v-for="image in result?.samplingImages" :key="image">
            <image class="image" :src="image.url" mode="scaleToFill" />
          </view>
        </view>
      </view>
    </view>

    <view class="button" @click="dispose" v-if="item.state == 20"> 确认处理 </view>
    <view class="button" @click="updataResult" v-else-if="showUpdate"> 确认修改 </view>
    <view class="button" @click="showUpdateView" v-else-if="item.state == 30"> 修改结果 </view>
  </view>
  <view>
    <u-action-sheet @select="selectSceneClick" :actions="list" :show="showScene"></u-action-sheet>
    <u-action-sheet
      @select="selectSamplePhotoClick"
      :actions="list"
      :show="showsamplePhoto"
    ></u-action-sheet>
  </view>
</template>

<script lang="ts" setup>
import type { departmentApparatusParams } from '@/types/equitment'
import { toRefs, defineProps, ref, render, toRaw, toRef, onBeforeMount, reactive } from 'vue'
import { useMemberStore } from '@/stores'
import { updateOrderListAPI } from '@/services/order'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { addSpecimenAPI, getSpecimenAPI, updataSpecimenOrderAPI } from '@/services/specime'
import { image, number } from '@/uni_modules/uv-ui-tools/libs/function/test'
import { getCloudPath } from '@/utils/getCloudPath'
import { log } from 'console'

const memberStore = useMemberStore()

//接收父组件传的数据
const props = defineProps({
  item: Object,
  comfirm: Object,
})
let isComfirm = ref(false)
const { item } = toRefs(props)
let showUpdate = ref(false)
let samlingCategoryList: any = [
  { value: 0, text: '毛发采样' },
  { value: 1, text: '污水采样' },
]
let form: any = ref({
  //采样点现场照片
  addressFileList: [],
  samplingTime: new Date(),
  taskDescription: '',
  //采样人自拍
  // samplingPersonImages: [],
  //样品照片
  sampleFileList: [],
  samplingShopId: useMemberStore().profile.shopInfoId,
})
const comfirmIdentity = () => {
  uni.showToast({
    icon: 'error',
    title: '开发中',
  })
  // uni.navigateTo({
  //   url:
  //     '/pages/list/comfirmIdentity/comfirmIdentity?userId=' +
  //     encodeURIComponent(JSON.stringify(props?.item?.userId)),
  // })
}
const list = [{ name: '照片' }, { name: '视频' }, { name: '取消' }]
let showScene = ref(false)
let showSamplerPhoto = ref(false)
let showsamplePhoto = ref(false)
const showScenePhotoActionSheet = () => {
  selectSceneImage()
}

const showsamplePhotoActionSheet = () => {
  selectsamplePhotoImage()
}
//现场
const selectSceneClick = (e: any) => {
  if (e.name == '照片') {
    selectSceneImage()
    showScene.value = false
  } else if (e.name == '视频') {
    selectSceneVideo()
    showScene.value = false
  } else {
    showScene.value = false
  }
}
//选择照片
let addressList: any = []
let sampleList: any = []
const selectSceneImage = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFiles: any = res.tempFiles
      addressList = tempFiles

      const imgs1 = addressList.map((item: any) => {
        return {
          name: 'address',
          filePath: item.path,
          size: item.size,
        }
      })

      Promise.all([imgs1.map((item: any) => uploadFile(1, item.name, item.filePath, item.size))])
        .then(() => {
          //图片上传完毕
          uni.showToast({
            icon: 'success',
            title: '所有图片已上传完成',
          })
        })
        .catch((fail) => {
          console.log(fail)
        })
    },
    fail: function (err) {
      console.log('选择文件失败', err)
    },
  })
}
//选择视频
const selectSceneVideo = () => {
  uni.chooseVideo({
    sourceType: ['album', 'camera'],
    camera: 'back',
    success: (res) => {
      const tempFilePaths: any = res.tempFilePath
      form.value.samplingAddressImages = tempFilePaths
    },
    fail: (error) => {},
  })
}
//样品
const selectSamplePhotoClick = (e: any) => {
  if (e.name == '照片') {
    selectsamplePhotoImage()
    showsamplePhoto.value = false
  } else if (e.name == '视频') {
    selectsamplePhotoVideo()
    showsamplePhoto.value = false
  } else {
    showsamplePhoto.value = false
  }
}
//选择照片
const selectsamplePhotoImage = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFiles: any = res.tempFiles
      sampleList = tempFiles
      const imgs2 = sampleList.map((item: any) => {
        return {
          name: 'sampling', //后台接收字段名
          filePath: item.path,
          size: item.size,
        }
      })
      Promise.all([imgs2.map((item: any) => uploadFile(2, item.name, item.filePath, item.size))])
        .then(() => {
          //图片上传完毕
          uni.showToast({
            icon: 'success',
            title: '所有图片已上传完成',
          })
        })
        .catch((fail) => {
          console.log(fail)
        })
    },
    fail: function (err) {
      console.log('选择文件失败', err)
    },
  })
}
//选择视频
const selectsamplePhotoVideo = () => {
  uni.chooseVideo({
    sourceType: ['album', 'camera'],
    camera: 'back',
    success: (res) => {
      const tempFilePaths: any = res.tempFilePath
      form.value.samplingImages = tempFilePaths
    },
    fail: (error) => {},
  })
}
const showUpdateView = () => {
  if (!uni.getStorageSync('Certification')) {
    uni.showToast({
      icon: 'error',
      title: '请实名',
    })
    uni.navigateTo({
      url: '/pages/personalInfo/personalInfo',
    })
  } else {
    showUpdate.value = true
  }
}
const updataResult = async () => {
  form.value.id = result.value.id
  if (form.value.addressFileList.length == 0) {
    uni.showToast({
      icon: 'error',
      title: '请上传现场照片',
    })
  } else if (form.value.sampleFileList.length == 0) {
    uni.showToast({
      icon: 'error',
      title: '请上传样品照片',
    })
  } else if (typeof form.value.sampleMode != 'number') {
    uni.showToast({
      icon: 'error',
      title: '请选择样品类型',
    })
  } else {
    const res = await updataSpecimenOrderAPI(form.value)
    if (res.code == 200) {
      uni.removeStorageSync('comfirm')
      uni.showToast({
        icon: 'success',
        title: '修改成功',
      })
      uni.switchTab({ url: '/pages/list/list' })
    }
  }
}
//确认处理，更新订单状态
const dispose = async () => {
  if (!uni.getStorageSync('Certification')) {
    uni.showToast({
      icon: 'error',
      title: '请实名',
    })
    uni.navigateTo({
      url: '/pages/personalInfo/personalInfo',
    })
  } else {
    form.value.orderId = props.item?.id
    form.value.userId = props.item?.userId
    form.value.detectionMode = props.item?.deliveryMode
    // form.value.detectionShopId = props.item?.shopInfoId
    if (form.value.addressFileList.length == 0) {
      uni.showToast({
        icon: 'error',
        title: '请上传现场照片',
      })
    } else if (form.value.sampleFileList.length == 0) {
      uni.showToast({
        icon: 'error',
        title: '请上传样品照片',
      })
    } else if (typeof form.value.sampleMode != 'number') {
      uni.showToast({
        icon: 'error',
        title: '请选择样品类型',
      })
    } else {
      const result: any = await addSpecimenAPI(form.value)
      if (result.code == 200) {
        uni.removeStorageSync('comfirm')
        uni.switchTab({
          url: '/pages/list/list',
        })
      }
    }
  }
}

//存储图片信息

const uploadFile = (type: number, name: string, filePath: string, size: number) => {
  wx.cloud.uploadFile({
    filePath,
    cloudPath: getCloudPath(filePath),
    success: (res) => {
      const uploadFileParam = {
        size,
        name,
        objName: getCloudPath(filePath),
      }
      if (type == 1) {
        form.value.addressFileList.push(uploadFileParam)
      } else if (type == 2) {
        form.value.sampleFileList.push(uploadFileParam)
      }
    },
    fail: (fail) => {
      uni.showToast({
        icon: 'fail',
        title: fail.errMsg,
      })
    },
  })
}

let result: any = ref()
const getSpecimen = async (orderId: any) => {
  const res: any = await getSpecimenAPI(orderId)
  if (res.code == 200) {
    result.value = res.data
  } else {
    uni.showToast({
      icon: 'error',
      title: res.msg,
    })
  }
}
onShow(() => {
  isComfirm.value = uni.getStorageSync('comfirm')
})
onBeforeMount(() => {
  getSpecimen(props.item?.id)
})
onLoad(() => {})
</script>

<style lang="scss">
.top {
  padding: 32rpx;
  margin: 0rpx 24rpx;
  background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
  background-color: #fff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  height: 656rpx;

  .goods {
    .goods_info {
      margin: 16rpx 32rpx 10rpx 32rpx;
      display: flex;
      justify-content: space-between;

      .goods_image {
        width: 120rpx;
        height: 120rpx;
        background: linear-gradient(328deg, #1bc172 0%, #43d180 100%);
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        margin-right: 28rpx;
      }

      .goodsInfo {
        width: 70%;

        .title {
          font-size: 28rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #000000;
          margin-bottom: 12rpx;
        }

        .describe {
          font-size: 24rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #999999;
          overflow: hidden;
        }
      }
    }

    .price {
      margin-right: 32rpx;
      float: right;
      font-size: 28rpx;
      font-family: PingFang HK-Medium, PingFang HK;
      font-weight: 500;
      color: #ff1535;
    }
  }

  .orderInfo {
    margin: 116rpx 32rpx 10rpx 32rpx;

    .Info {
      .label {
        margin-top: 26rpx;
        display: flex;
        justify-content: space-between;
        font-size: 26rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #999999;

        .Info {
          font-size: 26rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}

.bottom {
  padding: 32rpx;
  margin: 24rpx 32rpx 0 32rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  font-size: 28rpx;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 33rpx;

  .item {
    padding: 28rpx 0;
    border-bottom: 1rpx solid #eff0f2;

    .select {
      display: flex;
      justify-content: space-between;

      .left {
        width: 35%;
      }

      .right {
        width: 65%;
        align-items: center;
      }
    }

    .left {
      float: left;
      width: 35%;
    }

    .right {
      font-size: 28rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 550;
      color: #333333;
      line-height: 33rpx;

      .image {
        height: 170rpx;
        width: 65%;
      }
    }
  }
}

.button {
  background: #00b964;
  width: 90%;
  height: 88rpx;
  margin-top: 70rpx;
  margin-bottom: 56rpx;
  margin-left: 5%;
  border-radius: 50rpx 50rpx 50rpx 50rpx;
  font-size: 28rpx;
  font-family: PingFang HK-Medium, PingFang HK;
  font-weight: 500;
  color: #ffffff;
  line-height: 88rpx;
  display: flex;
  justify-content: center;
}
</style>
