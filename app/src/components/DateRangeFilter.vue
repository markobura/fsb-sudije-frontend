<template>
  <q-input outlined :hint="hint" lazy-rules readonly v-model="dateDisplay" dense>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer" color="primary">
        <q-popup-proxy
          @before-show="updateProxy"
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="proxyDate" mask="DD.MM.YYYY" range @update:model-value="save">
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Ok"
                color="primary"
                flat
                @click="save"
              />
            </div>
          </q-date>
        </q-popup-proxy>
        <q-tooltip class="bg-primary" :offset="[10, 10]">
          Otvorite kalendar
        </q-tooltip>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { date } from "quasar";
import { ref } from "vue";


interface DateRangeObj{
    startDateName: string,
    startDateValue: string,
    endDateName: string,
    endDateValue: string
}

const props = defineProps<{
  dateRangeVariableNames: {
    startDateName: string;
    endDateName: string;
  };
  hint: string;
}>();
const emit = defineEmits<{
  (e: 'setDate', dateRangeObj: DateRangeObj): void;
}>();

const today = Date.now();
const formattedToday = date.formatDate(today, 'DD.MM.YYYY');
const startDate = ref(formattedToday);
const endDate = ref(formattedToday);
const proxyDate = ref();
proxyDate.value = startDate.value
const dateDisplay = ref(startDate.value);

function updateProxy() {
  if (typeof proxyDate.value === 'string') {
    proxyDate.value = startDate.value;
  } else {
    proxyDate.value = { from: startDate.value, to: endDate.value };
  }
}

function save() {
  if (typeof proxyDate.value === 'string') {
    dateDisplay.value = proxyDate.value + ' - ' + proxyDate.value;
    startDate.value = proxyDate.value;
    endDate.value = proxyDate.value;
  } else {
    dateDisplay.value = proxyDate.value.from + ' - ' + proxyDate.value.to;
    startDate.value = proxyDate.value.from;
    endDate.value = proxyDate.value.to;
  }
  emitSetDate();
}
emitSetDate();

function emitSetDate() {
  emit('setDate', {
    startDateName: props.dateRangeVariableNames.startDateName,
    startDateValue: startDate.value,
    endDateName: props.dateRangeVariableNames.endDateName,
    endDateValue: endDate.value,
  });
}
defineExpose({
  resetInput
})
function resetInput() {
  const today = Date.now();
  startDate.value = date.formatDate(today, 'DD.MM.YYYY');
  proxyDate.value = startDate.value;
  dateDisplay.value = proxyDate.value + ' - ' + proxyDate.value;
  startDate.value = proxyDate.value;
  endDate.value = proxyDate.value;
  emitSetDate();

}
</script>

<style scoped></style>
