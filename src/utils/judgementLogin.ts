export const judgementLogin = (name: string) => {
  uni.showToast({ icon: 'error', title: '请前往登录' })
  setTimeout(() => {
    // 页面跳转
    uni.navigateTo({
      url: '/pages/login/login?name=' + name,
    })
  }, 500)
}
