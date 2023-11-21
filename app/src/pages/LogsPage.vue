<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader
          title="Pregled logova"
          icon="folder"/>
      </q-card-section>
      <q-separator inset/>

      <q-card-section class="row">
        <q-list dense padding separator class="rounded-borders col-3">
          <q-scroll-area style="height: 500px">

            <q-expansion-item
              class="shadow-1 overflow-hidden q-ma-sm"
              style="border-radius: 30px"
              icon="folder"
              :label="log.folder"
              v-for="log in logs" :key="log"
              dense
              dense-toggle
              group="logFolderGroup"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"

            >
              <q-list dense padding class="rounded-borders col-3">
                <q-item clickable v-ripple v-for="file in log.files" :key="file" @click="showLogs(log.folder, file)">
                  <q-item-section avatar>
                    <q-avatar icon="file_open"/>
                  </q-item-section>
                  <q-item-section>
                    {{ file }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

          </q-scroll-area>
        </q-list>
        <q-list bordered class="col-9 q-pa-md" v-if="logDetails.length > 0">

          <BaseHeader :title="logFolderTitle" icon="file_open">
            <section v-if="filtersSelected">
            <q-chip dense class="glossy" color="primary" text-color="white" icon-right="alarm">
              {{ selectedFilters.startTime}}
            </q-chip>
            <q-chip dense class="glossy" color="primary" text-color="white" icon-right="alarm">
              {{ selectedFilters.endTime}}
            </q-chip>
            <q-chip dense class="glossy" color="secondary" text-color="white" icon-right="account_circle">
              {{ selectedFilters.selectedUser.label}}
            </q-chip>
            </section>
            <q-btn icon="search" outline label="Filtriraj" color="primary" @click="toggleFilterDialog"/>

          </BaseHeader>
          <q-separator/>
          <q-scroll-area style="height: 500px" v-if="filteredLogs.length > 0">
            <LogsItem v-for="logDetail in filteredLogs" :key="logDetail" :log-detail="logDetail"/>
          </q-scroll-area>
          <span class="text-h5" v-else>Nema rezultata za izabrane parametre pretrage!</span>

        </q-list>
      </q-card-section>
    </q-card>
    <LogFiltersDialog :min-start-time="minStartTime"
                      :max-end-time="maxEndTime"
                      :user-options="logUserOptions"
                      v-if="logDetails.length > 0"
                      v-model="filterDialog"
                      @filter-logs="filterLogs"/>

  </q-page>
</template>

<script setup lang="ts">
import BaseHeader from "components/BaseHeader.vue";
import {computed, ref} from "vue";
import {useLogsStore} from "stores/logsStore";
import 'vue-json-pretty/lib/styles.css';
import LogsItem from "components/LogsItem.vue";
import LogFiltersDialog, {FiltersData} from "components/LogFiltersDialog.vue";

const logsStore = useLogsStore();

const logs = computed(function () {
  return logsStore.getLogs;
});

const logDetails = computed(function () {
  return logsStore.getLogDetails
})

const filteredLogs = computed(function (){
  return logsStore.getFilteredLogs
})
const logFolderTitle = ref();

const filtersSelected = ref(false);
const showLogs = async (logFolder: string, logFile: string) => {
  filtersSelected.value = false;
  logFolderTitle.value = logFolder;
  await logsStore.fetchLogDetails(logFolder, logFile);
}


const filterDialog = ref(false);
const toggleFilterDialog = () => {
  filterDialog.value = !filterDialog.value
}


const logUserOptions = computed(function () {
  return logsStore.getLogUserOptions
})

const minStartTime = computed(function () {
  return logsStore.getMinTime
})

const maxEndTime = computed(function () {
  return logsStore.getMaxTime
})

const selectedFilters: FiltersData = ref(null);
const filterLogs = (filters: FiltersData) => {
  filtersSelected.value = true;
  logsStore.filterLogs(filters);
  selectedFilters.value = filters;
}
</script>
