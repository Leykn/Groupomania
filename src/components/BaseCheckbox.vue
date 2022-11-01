<template>  
    <el-checkbox
      v-model="value"
    >
      <slot></slot>
    </el-checkbox>
  </template>
  
  <script>
    export default {
      props: {
        modelValue: { 
          type: Boolean,
          required: true
        }
      },
      emits: ['update:modelValue'],
      computed: {
        value: {
          get() {
            return this.modelValue;
          },
          set(value) {
            this.$emit('update:modelValue', value)
          }
        }
      }
    }
  </script>
  
  <style lang="scss" scoped>
    .el-checkbox {
      display: block;
    }
  </style>