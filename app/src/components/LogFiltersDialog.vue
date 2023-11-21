<script setup lang="ts">
import {reactive, ref} from "vue";

interface LogFilterProps {
  minStartTime: string
  maxEndTime: string,
  userOptions: {label: string, value: number}[]
}

const props = defineProps<LogFilterProps>();

export interface FiltersData {
  startTime: string,
  endTime: string,
  selectedUser: {label: string, value: number}
}
const emit = defineEmits<{
  filterLogs: [filters: FiltersData]
}>()

const logFiltersDialog = ref();
const filters = reactive({
  startTime: props.minStartTime,
  endTime: props.maxEndTime,
  selectedUser: props.userOptions[0]
})

const filterLogs = () => {
  emit('filterLogs', filters)
  logFiltersDialog.value.hide();
}

const checkStartTime = (startTime: string) => {
  if(startTime > filters.endTime){
    filters.endTime = startTime
  }
}

const checkEndTime = (endTime: string) => {
  if(endTime < filters.startTime){
    filters.startTime = endTime
  }
}
</script>

<template>
  <q-dialog ref="logFiltersDialog">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Period</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input filled v-model="filters.startTime" mask="time" :rules="['time']" label="Početno vreme" readonly>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="filters.startTime" format24h @update:model-value="checkStartTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input filled v-model="filters.endTime" mask="time" :rules="['time']" label="Krajnje vreme" readonly>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time
                  v-model="filters.endTime"
                  format24h
                  @update:model-value="checkEndTime"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-card-section>
          <div class="text-h6">Korisnik</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="filters.selectedUser"
            :options="userOptions"
          />
        </q-card-section>
      </q-card-section>

      <q-card-actions align="center" class="bg-white text-teal">
        <q-btn color="secondary" label="Filtriraj" @click="filterLogs"/>
        <q-btn color="secondary" label="Odustani" v-close-popup />

      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<style scoped>

</style>
