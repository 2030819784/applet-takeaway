<template>
  <!-- 采样 -->
  <view class="page">
    <view class="top">
      <view class="topTitle">任务描述</view>
      <textarea
        v-model="form.taskDescription"
        class="descirble"
        cols="30"
        rows="10"
        placeholder="任务描述..."
      ></textarea>
    </view>
    <view class="bottom">
      <view class="item">
        <view class="left">采样点名称</view>
        <view class="right" @click="chooseName">
          <input type="text" placeholder="点击选择采样点" v-model="form.samplingAddress"
        /></view>
      </view>
      <view class="item">
        <view class="left">采样点定位</view>
        <view class="right" @click="chooseAddress">
          <input type="text" placeholder="点击选择采样点定位" v-model="form.samplingShopAddress"
        /></view>
      </view>
      <view class="item">
        <view class="left">采样点现场照片</view>
        <view class="right">
          <button @click="selectSceneImage">上传</button>
          <view v-for="image in addressList" :key="image">
            <image class="image" :src="image.path" mode="scaleToFill" />
            <!-- <video :src="image" class="image"></video> -->
          </view>
        </view>
      </view>
      <!-- <view class="item">
        <view class="left">采样人身份确认</view>
        <view class="right">
          <button @click="comfirmIdentity" v-show="show1 == 0">去确认</button>
          <button v-show="show1 == 1">已确认</button>
        </view>
      </view> -->
      <view class="item">
        <view class="left">样品照片</view>
        <view class="right">
          <button @click="selectsamplePhotoImage">上传</button>
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
      <view class="item">
        <view class="select">
          <view class="left">检测方式</view>
          <view class="right">
            <uni-data-select
              v-model="form.detectionMode"
              :localdata="detectionModeList"
              placeholder="请选择"
              :clear="true"
            ></uni-data-select>
          </view>
        </view>
      </view>
    </view>
    <view class="button" v-if="form.detectionMode == 1" @click="buyDeectionMode()">
      购买检测商品
    </view>
    <view class="button" v-else-if="form.detectionMode == 0" @click="dispose"> 确认处理 </view>
  </view>
  <view>
    <u-action-sheet @select="selectSceneClick" :actions="list" :show="showScene"></u-action-sheet>
    <!-- <u-action-sheet
      @select="selectSamplerPhotoClick"
      :actions="list"
      :show="showSamplerPhoto"
    ></u-action-sheet> -->
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
import { onLoad } from '@dcloudio/uni-app'
import { addSpecimenOrderAPI } from '@/services/specime'
import { useMemberStore, useSample } from '@/stores'
import { getCloudPath } from '@/utils/getCloudPath'
import { log } from 'console'

let detectionModeList: any = [
  { value: 0, text: '自检' },
  { value: 1, text: '外送' },
]
const address = ref('')
const name = ref('')
let samlingCategoryList: any = [
  { value: 0, text: '毛发采样' },
  { value: 1, text: '污水采样' },
]
let form = ref<any>({
  taskDescription: '',
  //采样点名称
  samplingAddress: '',
  //采样点定位
  samplingShopAddress: '',
  //采样点现场照片
  addressFileList: [],
  //样品照片
  sampleFileList: [],
  //检测方式
  detectionMode: null,
  userId: useMemberStore().profile.id,
  samplingShopId: useMemberStore().profile.shopInfoId,
  // samplingShopId:name,
})
// 0 去确认 1已确认
let show1 = ref(0)
let show2 = ref(0)
const list = [{ name: '照片' }, { name: '视频' }, { name: '取消' }]
let showScene = ref(false)
let showSamplerPhoto = ref(false)
let showsamplePhoto = ref(false)
const buyDeectionMode = () => {
  useSample().setsample(form.value)

  uni.switchTab({ url: '/pages/index/index' })
}
const chooseName = () => {
  getLocation()
}
const chooseAddress = () => {
  getLocation()
}
// const comfirmIdentity = () => {
//   uni.navigateTo({
//     url: '/pages/list/comfirmIdentity/comfirmIdentity',
//   })
// }
const showScenePhotoActionSheet = () => {
  showScene.value = true
}
const showSamplerPhotoPhotoActionSheet = () => {
  showSamplerPhoto.value = true
}
const showsamplePhotoActionSheet = () => {
  // showsamplePhoto.value = true
  selectSceneImage()
}
//现场
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
      form.value.addressFileList = tempFilePaths
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
      form.value.sampleFileList = tempFilePaths
    },
    fail: (error) => {},
  })
}

//确认处理，更新订单状态
//确认处理，更新订单状态
const dispose = async () => {
  if (form.value.detectionMode == 0) {
    form.value.detectionShopAddress = form.value.samplingShopAddress
  }
  // form.value.samplingTime = new Date()
  // form.value.uploadFileList = uploadFileList
  if (!form.value.samplingAddress) {
    uni.showToast({
      icon: 'error',
      title: '请选择采样点',
    })
  } else if (form.value.addressFileList.length == 0) {
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
    const result: any = await addSpecimenOrderAPI(form.value)
    if (result.code == 200) {
      uni.switchTab({
        url: '/pages/list/list',
      })
    }
  }
}
//存储图片信息
let uploadFileList: any = []

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
const getLocation = () => {
  uni.chooseLocation({
    type: 'gcj02',
    geocode: true,
    success: (res) => {
      form.value.samplingShopAddress = res.address
      form.value.samplingAddress = res.name
    },
    fail: (fail) => {},
  })
}

onBeforeMount(() => {})
onLoad(() => {
  // getLocation()
})
</script>

<style lang="scss">
.page {
  background: linear-gradient(10deg, rgba(27, 193, 101, 0) 0%, #1bc172 28%, #43d180 50%);

  .top {
    margin: 0 32rpx 32rpx 32rpx;

    .topTitle {
      margin: 0 24rpx 24rpx 0;
      font-size: 28rpx;
      font-family: PingFang HK-Regular, PingFang HK;
      font-weight: 400;
      color: #000000;
    }

    .descirble {
      width: 90%;
      padding: 32rpx;
      background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
      background-color: #fff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
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
}
</style>
