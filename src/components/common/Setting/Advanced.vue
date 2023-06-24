<script lang="ts" setup>
import { ref } from 'vue'
import { NInput } from 'naive-ui'
import { useSettingStore } from '@/store'
const settingStore = useSettingStore()

const systemMessage = ref(settingStore.systemMessage ?? '')
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.role') }}</span>
        <div class="flex-1">
          <NInput v-model:value="systemMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" disabled />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0 w-[120px]">使用说明</div>
        <div class="flex-1">鉴于本产品用途，System Prompt不予更改，为此带来的不便，敬请谅解！</div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0 w-[120px]">勘误反馈</div>
        <div class="flex-1">若网站出现任何问题，请联系邮箱20270244@tsinglan.cn，若账号出现任何问题，也请联系该邮箱。严禁将本服务用于非法用途，使用时请遵守当地法律法规。</div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0 w-[120px]">赞助</div>
        <div class="flex-1">基本服务免费提供，赞助请点击<a class="text-blue-500" href="#">赞助链接</a></div>
      </div>
    </div>
  </div>
</template>
