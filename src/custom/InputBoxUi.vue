<script setup lang="ts">
defineProps<{
  label?: string
  icon?: string
  type?: string
  min?: number
  max?: number
  placeholder?: string
  value?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  input: [value: string]
}>()
</script>

<template>
  <label class="box">
    <span v-if="label || icon" class="box__label">
      <span v-if="icon" class="box__icon">{{ icon }}</span>
      <span v-if="label">{{ label }}</span>
    </span>
    <input
      class="box__input"
      :type="type ?? 'number'"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      @input="emit('input', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.box__label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
}

.box__icon {
  line-height: 1;
}

.box__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.4rem 0.55rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 0.875rem;
}

.box__input:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}
</style>
