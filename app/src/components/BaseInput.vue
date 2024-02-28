<script setup lang="ts">
import {computed, defineProps, withDefaults} from "vue";

interface Props {
  hint: string,
  label: string,
  passwordInput?: boolean,
  type?: 'text' | 'number' | 'password' | 'email',
}

const props = withDefaults(defineProps<Props>(), {
  hint: 'Hint placeholder',
  label: 'Value placeholder',
  passwordInput: false,
  type: 'text',
});

const isPwd = computed(function (){
  return props.type !== 'text';
});

</script>

<template>
  <q-input
    outlined
    :hint="hint"
    :label="label"
    :type="type"
    lazy-rules
    class="font-ubuntu"
    color="primary"
  >
    <template v-if="passwordInput" v-slot:append>
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="$emit('togglePassword')"
      />
    </template>
  </q-input>
</template>

<style scoped>

</style>
