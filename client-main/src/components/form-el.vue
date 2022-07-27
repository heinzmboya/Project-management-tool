<script setup lang="ts">
import {
  ElButton,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElMain,
} from 'element-plus'

const props = defineProps<{
  capture: Function
}>()

const mail = ref('')

</script>

<template>
  {{ mail }}
  <el-container>
    <el-header />
    <el-main class="w-md mx-auto">
      <div class="container-center">
        <h2>Welcome!</h2>
        <div>Enter your email address to start free trial</div>

        <el-form ref="form">
          <el-form-item>
            <label>Email</label>
            <el-input
              v-model="mail"
              placeholder="Email"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="text-gray-700"
              @click="props.capture(mail); mail = ''"
            >
              Create my Holic account
            </el-button>
          </el-form-item>
        </el-form>
        <div>
          <span>Already have an enamel account?</span>
          <router-link to="/login" class="link">
            Log in
          </router-link>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped></style>
