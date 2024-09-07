<template>
  <view>
    {{store.token}}
  </view>
</template>

<script setup lang="ts">
import { useLoginStore } from '@/store'
const store = useLoginStore()
</script>

<style lang="scss"></style>
