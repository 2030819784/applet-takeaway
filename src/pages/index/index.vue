<script setup lang="ts">
import Customer from './pages/customer.vue'
import Rider from './pages/rider.vue'
import Business from './pages/business.vue'
import { useMemberStore } from '@/stores';

const memberStore = useMemberStore()
</script>

<template>
  <view>
    <Customer v-if="memberStore.profile.role === 'customer'"></Customer>
    <Rider v-if="memberStore.profile.role === 'rider'"></Rider>
    <Business v-if="memberStore.profile.role === 'business'"> </Business>
  </view>
</template>
