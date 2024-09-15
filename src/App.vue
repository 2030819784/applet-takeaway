<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
  wxCloud()
})

const wxCloud = () => {
  // wx.cloud = new wx.cloud.Cloud({
  // 	resourceAppid: 'WXAAA', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
  // 	resourceEnv: 'prod-001', // 微信云托管的环境ID
  // })
  wx.cloud.init({
    traceUser: true,
    env: 'prod-7g4vsnql4506ac04', //写自己配置的后台环境
  })
}
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '../node_modules/uview-plus/index.scss';
// 字体图标
@import '@/styles/fonts.scss';

view,
navigator,
input,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 两行省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

checkbox.round .wx-checkbox-input,
checkbox.round .uni-checkbox-input {
  border-radius: 100upx;
}
</style>
