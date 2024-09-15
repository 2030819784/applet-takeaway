<!-- <template>
  <view class="page">
    <view class="content">
      <view class="top">
        <view class="item">
          <view class="left">姓名</view>
          <view class="right">
            <input v-model="form.name" placeholder="请输入真实姓名" />
          </view>
        </view>
        <view class="item">
          <view class="left">身份证</view>
          <view class="right">
            <input v-model="form.idcard" placeholder="请输入身份证号" />
          </view>
        </view>
        <view class="item">
          <view class="left">人脸识别</view>
          <view class="right">
            <button @click="OpenCamera">打开摄像头</button>
          </view>
        </view>
      </view>
    </view>
    <view>
      <button @click="commfirmIdentty()" style="background: #4fe84f; margin-top: 100rpx">
        识别
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { commfirmIdenttyAPI } from '@/services/user'
import { getCloudPath } from '@/utils/getCloudPath'
import { log } from 'console'
import { useComfirm } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'

const form = ref({
  name: '',
  idcard: '',
  path: '',
})

let uploadFileParam = {
  objName: '',
  size: 0,
}

const OpenCamera = () => {
  if (form.value.name && form.value.idcard) {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res: any) => {
        const size = res.tempFiles[0].size
        const objName = getCloudPath(res.tempFiles[0].path)
        wx.cloud.uploadFile({
          filePath: res.tempFiles[0].path,
          cloudPath: objName,
          success: (res: any) => {
            uni.showToast({
              icon: 'success',
              title: '上传成功',
            })
            //图片上传云端成功
            uploadFileParam.size = size
            uploadFileParam.objName = objName
          },
          fail: (fail) => {
            uni.showToast({
              icon: 'error',
              title: fail.errMsg,
            })
          },
        })
      },
    })
  } else if (!form.value.name) {
    uni.showToast({
      icon: 'error',
      title: '请填写姓名',
    })
  } else if (!form.value.idcard) {
    uni.showToast({
      icon: 'error',
      title: '请填写身份证号',
    })
  }
}
let data = {
  uploadFileParam,
  faceRecognitionParam: form.value,
  userId: '',
}
const commfirmIdentty = async () => {
  uni.showToast({
    icon: 'error',
    title: '功能开发中',
  })
  // const result: any = await commfirmIdenttyAPI(data)
  // if (result.code == 200) {
  //   uni.showToast({
  //     icon: 'success',
  //     title: '人脸识别成功',
  //   })
  //   useComfirm().setComfirm(true)
  //   uni.navigateBack({
  //     delta: 1,
  //   })
  // } else {
  //   uni.showToast({
  //     icon: 'error',
  //     title: result.msg,
  //   })
  // }
}
onLoad((option: any) => {
  data.userId = JSON.parse(decodeURIComponent(option.userId))
})
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(10deg, rgba(27, 193, 101, 0) 0%, #1bc172 28%, #43d180 50%);
  background-color: #fff;
  height: 100vh;

  .content {
    margin: auto 24rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 33rpx;

    .top {
      // height: 410rpx;
      background: #ffffff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;

      .item {
        padding: 28rpx 32rpx;
        border-bottom: 1rpx solid #eff0f2;

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
  }
}
</style> -->
