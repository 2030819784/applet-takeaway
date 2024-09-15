<template>
  <!-- 检测 -->
  <view v-if="item">
    <view class="top">
      <view class="goods">
        <view class="goods_info">
          <view class="goods_image">
            <image :src="item.list?.skuList[0]?.imgList[0]?.objName"></image>
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
          <!-- <view class="label">
            <text>年龄：</text>
            <view class="Info">{{ item.age }}</view>
          </view> -->
        </view>
      </view>
    </view>
    <view class="center">
      <view class="item">
        <view class="left">采样店铺名称</view>
        <view class="right"> {{ item.list?.shopName || '无' }}</view>
      </view>
      <view class="item">
        <view class="left">采样店铺定位</view>
        <view class="right">{{ item.list?.shopDetailedAddress || '无' }}</view>
      </view>
      <view class="item">
        <view class="left">采样点现场照片</view>
        <view class="right">
          <view v-for="image in specime?.samplingAddressImages" :key="image">
            <image class="image" :src="image.url" mode="scaleToFill" />
          </view>
        </view>
      </view>
      <view class="item">
        <view class="left">样品照片</view>
        <view class="right">
          <view v-for="image in specime?.samplingImages" :key="image">
            <image class="image" :src="image.url" mode="scaleToFill" />
          </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-if="item.state == 50">
      <text class="title">检测结果</text>
      <view class="item">
        <textarea
          class="descirble"
          cols="30"
          rows="10"
          v-model="form.sampleDescription"
          placeholder="样品描述，非必填..."
        ></textarea>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">检测类型</view>
          <view class="right">
            <uni-data-select
              v-model="form.detectionType"
              :localdata="detectionCategoryList"
              placeholder="请选择"
              :clear="true"
              @change="changeDetectionType"
            ></uni-data-select>
          </view>
        </view>
      </view>
      <view class="item">
        <textarea
          class="descirble"
          cols="30"
          rows="10"
          v-model="form.describe"
          placeholder="结果描述,非必填..."
        ></textarea>
      </view>

      <view class="item">
        <view class="left">上传附件</view>
        <view class="right">
          <button @click="selectImages">上传文件</button>
          <view v-for="image in form.resultFileList" :key="image">
            <!-- 需要在真机上运行，无法在开发者工具中预览 -->
            <view style="overflow: auto" @click="cheakfile(image.objName)"
              >{{ image.name }}-下载</view
            >
            <!-- <image :src="image.path" mode="scaleToFill" /> -->
          </view>
        </view>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">报告名称</view>
          <view class="right">
            <input type="text" placeholder="请输入报告名称" name="" id="" v-model="form.name" />
          </view>
        </view>
      </view>
      <!-- 快检，毛发实验室检测 -->
      <view v-if="isShowQuickAndHair">
        <view class="item">
          <view class="select">
            <view class="left">检测结果</view>
            <view class="right">
              <uni-data-select
                direction="up"
                v-model="testResults"
                :localdata="testResultsList"
                placeholder="请选择"
                :clear="true"
                @change="changeTestResult"
              ></uni-data-select>
            </view>
          </view>
        </view>
        <view v-if="isShow">
          <view class="item">
            <view class="select">
              <view class="left">结果类别</view>
              <view class="right">
                <multipleSelect
                  :value="monIndex"
                  placeholder="请选择项目"
                  :options="monIndexList"
                  @change="changeMonIndex"
                  :zindex="0"
                >
                </multipleSelect>
                <input
                  v-if="state"
                  type="text"
                  placeholder="每次只能输入一种类型"
                  v-model="otherMessage"
                />
                <view @click="addMessage" class="flaot: right">添加</view>
              </view>
            </view>
          </view>
          <!-- <view class="item">
          <view class="left">量值</view>
          <view class="right"
            ><input placeholder="请输入量值" type="text" v-model="form.amount"
          /></view>
        </view> -->
        </view>
      </view>
      <!-- 污水实验室检测 -->
      <view v-if="isShowSewage">
        <view class="item">
          <view class="select">
            <view class="left">结果类别</view>
            <view class="right">
              <uni-data-select
                v-model="sewageCategory"
                :localdata="sewageCategoryList"
                placeholder="请选择"
                :clear="true"
                @change="selectSewageList"
              ></uni-data-select>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-else-if="showUpdate">
      <text class="title">检测结果</text>
      <view class="item">
        <textarea
          class="descirble"
          cols="30"
          rows="10"
          v-model="form.sampleDescription"
          placeholder="样品描述，非必填..."
        ></textarea>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">检测类型</view>
          <view class="right">
            <uni-data-select
              v-model="form.detectionType"
              :localdata="detectionCategoryList"
              placeholder="请选择"
              :clear="true"
              @change="changeDetectionType"
            ></uni-data-select>
          </view>
        </view>
      </view>
      <view class="item">
        <textarea
          class="descirble"
          cols="30"
          rows="10"
          v-model="form.describe"
          placeholder="结果描述，非必填..."
        ></textarea>
      </view>

      <view class="item">
        <view class="left">上传附件</view>
        <view class="right">
          <button @click="selectImages">上传文件</button>
          <view v-for="image in form.resultFileList" :key="image">
            <!-- 需要在真机上运行，无法在开发者工具中预览 -->
            <view style="overflow: auto" @click="cheakfile(image.objName)"
              >{{ image.name }}-下载</view
            >
            <!-- <image :src="image.path" mode="scaleToFill" /> -->
          </view>
        </view>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">报告名称</view>
          <view class="right">
            <input type="text" placeholder="请输入报告名称" name="" id="" v-model="form.name" />
          </view>
        </view>
      </view>
      <!-- 快检，毛发实验室检测 -->
      <view v-if="isShowQuickAndHair">
        <view class="item">
          <view class="select">
            <view class="left">检测结果</view>
            <view class="right">
              <uni-data-select
                direction="up"
                v-model="testResults"
                :localdata="testResultsList"
                placeholder="请选择"
                :clear="true"
                @change="changeTestResult"
              ></uni-data-select>
            </view>
          </view>
        </view>
        <view v-if="isShow">
          <view class="item">
            <view class="select">
              <view class="left">结果类别</view>
              <view class="right">
                <multipleSelect
                  :value="monIndex"
                  placeholder="请选择项目"
                  :options="monIndexList"
                  @change="changeMonIndex"
                  :zindex="0"
                >
                </multipleSelect>
                <input
                  v-if="state"
                  type="text"
                  placeholder="每次只能输入一种类型"
                  v-model="otherMessage"
                />
                <view @click="addMessage" class="flaot: right">添加</view>
              </view>
            </view>
          </view>
          <!-- <view class="item">
          <view class="left">量值</view>
          <view class="right"
            ><input placeholder="请输入量值" type="text" v-model="form.amount"
          /></view>
        </view> -->
        </view>
      </view>
      <!-- 污水实验室检测 -->
      <view v-if="isShowSewage">
        <view class="item">
          <view class="select">
            <view class="left">结果类别</view>
            <view class="right">
              <uni-data-select
                v-model="sewageCategory"
                :localdata="sewageCategoryList"
                placeholder="请选择"
                :clear="true"
                @change="selectSewageList"
              ></uni-data-select>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-else>
      <text class="title">检测结果</text>
      <view class="item">
        <view class="left">报告名称</view>
        <view class="right">
          {{ result?.reportName || '无' }}
        </view>
      </view>
      <view class="item">
        <view class="left">检测类型</view>
        <view class="right"> {{ result?.detectionType }} </view>
      </view>
      <view class="item">
        <view class="left">结果描述</view>
        <view class="right">
          {{ result?.describe || '无' }}
        </view>
      </view>
      <view class="item">
        <view class="left">检测结果</view>
        <view class="right"> {{ result?.detectionResult }} </view>
      </view>
      <view class="item">
        <view class="left">结果类别</view>
        <view class="right"> {{ result?.resultType }} </view>
      </view>
      <view class="item">
        <view class="left">附件</view>
        <view class="right">
          <view v-for="image in result?.files" :key="image">
            <!-- 需要在真机上运行，无法在开发者工具中预览 -->
            <view style="overflow: auto" @click="cheakfile(image.objName)"
              >{{ image.name }}-下载</view
            >
            <!-- <image :src="image.path" mode="scaleToFill" /> -->
          </view>
        </view>
      </view>
      <view>
        <!-- <view class="item">
          <view class="select">
            <view class="left">结果类别</view>
            <view class="right"></view>
          </view>
        </view> -->
      </view>
    </view>
    <view class="button" v-if="item.state == 50" @click="dispose"> 确认处理 </view>
    <view class="button" @click="updataResult" v-else-if="showUpdate"> 确认修改 </view>
    <view class="button" @click="showUpdateView" v-else-if="item.state == 60"> 修改结果 </view>
  </view>
  <view> </view>
</template>

<script lang="ts" setup>
import { getdepartmentApparatusAPI } from '@/services/equitment'
import type { departmentApparatusParams } from '@/types/equitment'
import { defineProps, onBeforeMount, onBeforeUpdate, reactive, ref } from 'vue'
import { useMemberStore } from '@/stores'
import { addDetetionAPI, getDetetionAPI, updateDetetionAPI } from '@/services/detection'
import { onLoad } from '@dcloudio/uni-app'
import multipleSelect from '@/components/multipleSelect.vue'
import { getSpecimenAPI } from '@/services/specime'
import { getCloudPath } from '@/utils/getCloudPath'
import { number } from '@/uni_modules/uv-ui-tools/libs/function/test'
const memberStore = useMemberStore()
//接收父组件传的数据
const props = defineProps({
  item: Object,
})
let testResults = ref()
let sewageCategory = ref()
const state = ref(false)
let showUpdate = ref(false)
let monIndex = ref([0])
let selectList: any = []
let detectionCategoryList: any = [
  { value: 0, text: '医检' },
  { value: 1, text: '快检' },
  { value: 2, text: '毛发实验室检测' },
  { value: 3, text: '污水实验室检测' },
]

const cheakfile = (path: any) => {
  wx.cloud.downloadFile({
    fileID: 'cloud://prod-7g4vsnql4506ac04.7072-prod-7g4vsnql4506ac04-1320667663/' + path, // 文件的下载地址
    success: function (res) {
      wx.getFileSystemManager().saveFile({
        tempFilePath: res.tempFilePath,
        success: function (res) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.savedFilePath,
            success: (res) => {
              uni.showToast({
                title: '保存成功',
                icon: 'success',
              })
              console.log(res) // 文件保存到相册成功
            },
            fail: (fail) => {
              uni.showToast({
                title: '保存失败',
                icon: 'error',
              })
              console.error(fail) // 文件保存到相册失败
            },
          })
        },
        fail: function (err) {
          console.log('保存文件失败', err)
        },
      })
    },
    fail: function (err) {
      console.log('下载文件失败', err)
    },
  })
}

const changeMonIndex = (item: any, value: any) => {
  monIndex.value = value
  selectList = item
  form.value.resultType = []
  for (let key in selectList) {
    if (selectList[key].value != 3) {
      form.value.resultType.push(selectList[key].text)
    }
  }
  state.value = item.some((data: { value: number }) => {
    if (data.value == 3) {
      return true
    }
  })
}
const selectSewageList = () => {
  if (sewageCategory.value == 1) {
    form.value.resultType.push('污水')
  } else if (sewageCategory.value == 2) {
    form.value.resultType.push('正常')
  }
}
const addMessage = () => {
  if (otherMessage.value != '') {
    form.value.resultType.push(otherMessage.value)
    uni.showToast({
      title: '添加成功',
      icon: 'success',
    })
    monIndexList.push({ value: monIndexList.length, text: otherMessage.value })
    selectList.push({ value: monIndexList.length, text: otherMessage.value })
    otherMessage.value = ''
  }
}
const monIndexList = [
  { value: 0, text: '玛咖' },
  { value: 1, text: '冰毒' },
  { value: 2, text: '氯胺酮' },
  { value: 3, text: '其他' },
]

let otherMessage = ref('')

let form: any = ref({
  userId: useMemberStore().profile.id,
  shopInfoId: useMemberStore().profile.shopInfoId,
  orderId: '',
  //样品描述
  sampleDescription: '',
  //上传结果
  resultFileList: [],
  //结果描述
  describe: '',

  //结果类别
  resultType: [],
  //检测类型
  //结果类型
  detectionType: '',
  //量值
  // amount: '',
  //报告名称
  name: '',
})

//检测结果列表
let testResultsList: any = [
  {
    value: 1,
    text: '阴性',
  },
  {
    value: 2,
    text: '阳性',
  },
]
//污水检测
let sewageCategoryList: any = [
  {
    value: 1,
    text: '污水',
  },
  {
    value: 2,
    text: '正常',
  },
]
let isShow = ref(false)
let isShowQuickAndHair = ref(false)
let isShowSewage = ref(false)

const selectImages = () => {
  uni.chooseMessageFile({
    count: 9,
    type: 'file',
    success: function (res) {
      const tempFiles: any = res.tempFiles
      form.value.detectionResultImages = tempFiles
      const imgs1 = form.value.detectionResultImages.map((item: any) => {
        return {
          name: item.name,
          filePath: item.path,
          size: item.size,
        }
      })

      Promise.all([imgs1.map((item: any) => uploadFile(item.name, item.filePath, item.size))])
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
let specime: any = ref()
const getSpecimen = async (orderId: any) => {
  const res: any = await getSpecimenAPI(orderId)
  if (res.code == 200) {
    specime.value = res.data
  }
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
  if (typeof form.value.detectionType != 'number') {
    uni.showToast({
      icon: 'error',
      title: '请选择检测类型',
    })
  } else if (form.value.detectionType == 1 || form.value.detectionType == 2) {
    if (typeof testResults.value != 'number') {
      uni.showToast({
        icon: 'error',
        title: '请选择检测结果',
      })
    } else if (testResults.value == 2) {
      if (form.value.resultType.length == 0) {
        uni.showToast({
          icon: 'error',
          title: '请选择结果类别',
        })
      } else {
        form.value.id = result.value.id
        const res = await updateDetetionAPI(form.value)
        if (res.code == 200) {
          uni.showToast({
            icon: 'success',
            title: '修改成功',
          })
          uni.switchTab({ url: '/pages/list/list' })
        }
      }
    }
  } else if (form.value.detectionType == 3) {
    if (form.value.resultType.length == 0) {
      uni.showToast({
        icon: 'error',
        title: '请选择结果类别',
      })
    } else {
      form.value.id = result.value.id
      const res = await updateDetetionAPI(form.value)
      if (res.code == 200) {
        uni.showToast({
          icon: 'success',
          title: '修改成功',
        })
        uni.switchTab({ url: '/pages/list/list' })
      }
    }
  } else if (form.value.detectionType == 0) {
    form.value.id = result.value.id
    const res = await updateDetetionAPI(form.value)
    if (res.code == 200) {
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
    if (typeof form.value.detectionType != 'number') {
      uni.showToast({
        icon: 'error',
        title: '请选择检测类型',
      })
    } else if (form.value.detectionType == 1 || form.value.detectionType == 2) {
      if (typeof testResults.value != 'number') {
        uni.showToast({
          icon: 'error',
          title: '请选择检测结果',
        })
      } else if (testResults.value == 2) {
        if (form.value.resultType.length == 0) {
          uni.showToast({
            icon: 'error',
            title: '请选择结果类别',
          })
        } else {
          const result: any = await addDetetionAPI(form.value)
          if (result.code == 200) {
            uni.switchTab({
              url: '/pages/list/list',
            })
          }
        }
      } else {
        const result: any = await addDetetionAPI(form.value)
        if (result.code == 200) {
          uni.switchTab({
            url: '/pages/list/list',
          })
        }
      }
    } else if (form.value.detectionType == 3) {
      if (form.value.resultType.length == 0) {
        uni.showToast({
          icon: 'error',
          title: '请选择结果类别',
        })
      } else {
        const result: any = await addDetetionAPI(form.value)
        if (result.code == 200) {
          uni.switchTab({
            url: '/pages/list/list',
          })
        }
      }
    } else if (form.value.detectionType == 0) {
      const result: any = await addDetetionAPI(form.value)
      if (result.code == 200) {
        uni.switchTab({
          url: '/pages/list/list',
        })
      }
    }
  }
}

const uploadFile = (name: string, filePath: string, size: number) => {
  wx.cloud.uploadFile({
    filePath,
    cloudPath: getCloudPath(filePath),
    success: (res) => {
      const uploadFileParam = {
        size,
        name,
        objName: getCloudPath(filePath),
      }
      form.value.resultFileList.push(uploadFileParam)
    },
    fail: (fail) => {
      uni.showToast({
        icon: 'fail',
        title: fail.errMsg,
      })
    },
  })
}

//选择检测类型
const changeDetectionType = (e: any) => {
  form.value.resultType = []
  if (form.value.detectionType == 1 || form.value.detectionType == 2) {
    isShowQuickAndHair.value = true
    isShowSewage.value = false
  } else if (form.value.detectionType == 3) {
    isShowSewage.value = true
    isShowQuickAndHair.value = false
  } else if (form.value.detectionType == 0) {
    isShowSewage.value = false
    isShowQuickAndHair.value = false
  }
}
//选择检测结果
const changeTestResult = (e: any) => {
  if (e == 2) {
    isShow.value = true
  } else if (e == 1) {
    isShow.value = false
  }
}

let result: any = ref()
const getDetetion = async (orderId: any) => {
  const res: any = await getDetetionAPI(orderId)
  if (res.code == 200) {
    result.value = res.data
    if (result.value.detectionType == 0) {
      result.value.detectionType = '医检'
    } else if (result.value.detectionType == 1) {
      result.value.detectionType = '快检'
    } else if (result.value.detectionType == 2) {
      result.value.detectionType = '毛发实验室检测'
    } else if (result.value.detectionType == 3) {
      result.value.detectionType = '污水实验室检测'
    }
  }
}
onBeforeMount(() => {
  form.value.orderId = props.item?.id
  form.value.skuId = props.item?.skuId
  form.value.spuId = props.item?.spuId
  form.value.resultType = monIndex
  getSpecimen(props.item?.id)
  if (props.item?.state == 60) {
    getDetetion(props.item?.id)
  }
  // getdepartmentApparatus()
  // form.orderId = item.orderId
})
onLoad(() => {})
onBeforeUpdate(() => {})
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

.center {
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

    .descirble {
      margin: 24rpx;
      background-color: #c9ebe0;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      opacity: 1;
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

  .title {
    font-size: 32rpx;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 38rpx;
  }

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
