<template>
    <view class="main">
        <up-form labelPosition="left">
            <up-form-item label="名称:"><up-input v-model="goods.name"></up-input></up-form-item>
            <up-form-item label="单价:"><up-input v-model="goods.price"></up-input></up-form-item>
            <up-form-item label="图片:"></up-form-item>
        </up-form>
    </view>
</template>
<script lang="ts" setup>
const goods = {
    name: '',
    price: '',
    photo: ''
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
}
</style>