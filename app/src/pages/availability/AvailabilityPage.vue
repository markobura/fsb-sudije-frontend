<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="event_busy" title="Pregled nedostupnosti"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section  style="min-width: 300px" >
        <date-range-filter
          style="max-width: 400px"
          hint="Izaberite period nedostupnosti"
          :date-range-variable-names="dateRangeVariableNames"
          @set-date="setDate"
          ref="transactionPeriod"
        />
      </q-card-section>
      <q-card-section style="min-width: 300px">
        <q-select outlined dense style="max-width: 400px" v-model="league" :options="leagueOptions" label="Liga" hint="Izaberite ligu" />
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" label="Pretraga" @click="fetchData"/>
      </q-card-section>
      <q-card-section>
        <q-table :rows="availabilities" :columns="columns" row-key="name" :filter="filterTable" dense>
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              placeholder="Pretraga"
              v-model="filterTable"
            >
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-primary text-white">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                <span>{{props.row.first_name + ' ' + props.row.last_name}}</span>
              </q-td>
              <q-td key="league" :props="props">
                <span>{{props.row.league}}</span>
              </q-td>
              <q-td key="date" :props="props">
                <span>{{props.row.date}}</span>
              </q-td>
              <q-td key="time" :props="props">
                <span>{{props.row.time}}</span>
              </q-td>
              <q-td key="reason" :props="props">
                <span>{{props.row.reason}}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import BaseHeader from 'src/components/BaseHeader.vue'
import {useUserStore} from "stores/userStore";
import {computed, ref} from "vue";
import useAvailabilityTableColumns from "src/columns/availabilityColumns";
import DateRangeFilter from 'src/components/DateRangeFilter.vue'
import {useCurrentDate, useDBFormat} from "src/utils/dateHook";


const userStore = useUserStore();
const availabilities = computed(function () {
  return userStore.getUsers;
})

const filterTable = ref('');
const columns = useAvailabilityTableColumns()

const leagueOptions = ['SVE','TMP','FUTSAL','MLADJE KATEGORIJE','MEDJUOPSTINSKA LIGA','PRVA BEOGRADSKA LIGA', 'ZONSKA LIGA','SRPSKA LIGA','PRVA LIGA SRBIJE', 'SUPER LIGA SRBIJE'];
let league = ref('SVE');

const startDate = ref(useCurrentDate());
const endDate = ref(useCurrentDate());

const dateRangeVariableNames = {
  startDateName: "startDate",
  endDateName: "endDate"
};

function setDate(dateObj: {startDateName: string, startDateValue: string, endDateName: string, endDateValue: string}) {
  if (dateObj.startDateName === "startDate") {
    startDate.value = dateObj.startDateValue;
    endDate.value = dateObj.endDateValue;
  }
}

const fetchData = async () => {
  console.log(startDate.value)
  console.log(endDate.value)
  console.log(useDBFormat(startDate.value))
  console.log(useDBFormat(endDate.value))
  console.log(league.value)

  // await userStore.getAvailabilitiesApi();
}



fetchData();
</script>

<style scoped>

</style>
