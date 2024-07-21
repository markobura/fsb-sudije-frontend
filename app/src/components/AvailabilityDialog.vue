<template>
  <q-dialog full-width>
    <q-card>
      <q-card-section class="bg-blue-grey-7 text-white text-h6">
        <q-item style="display: flex; justify-content: space-between">
          <q-item-label class="text-h5 text-white" style="margin-top: 5px">Dostupnost</q-item-label>
          <q-btn flat round icon="close" v-close-popup color="white"/>
        </q-item>
      </q-card-section>
      <q-card-section>
        <q-table :rows="availability" :columns="columns" row-key="name" dense>
          <template v-slot:top-left>
            <q-btn

              round
              color="green"
              icon="add"
              @click="openAvailabilityDialog('create')"
            >
              <BaseTooltip class="bg-green" tooltip="Dodaj novu dostupnost"/>
            </q-btn>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-blue-grey-7 text-white">
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
              <q-td key="period" :props="props">
                <span>{{props.row.period}}</span>
              </q-td>
              <q-td key="time" :props="props">
                <span>{{props.row.time === '00:00 - 23:59' ? 'Ceo dan' : props.row.time}}</span>
              </q-td>
              <q-td key="reason" :props="props">
                <span>
                  {{props.row.reason.length > 100 ? props.row.reason.substring(0,97)+'...' : props.row.reason}}
                   <q-tooltip
                     v-if="props.row.reason.length > 100"
                    class="bg-primary"
                    style="font-size: 15px; width: 300px"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]">
                  {{ props.row.reason }}
                </q-tooltip>
                </span>

              </q-td>
              <q-td key="update" :props="props">
                <q-btn
                  round
                  type="button"
                  flat
                  @click="openAvailabilityDialog('update')"
                  :disable="buttonsAreDisabled"
                >
                  <q-icon name="edit" color="orange"/>
                  <BaseTooltip class="bg-orange" tooltip="Ažuriraj"/>
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props"  class="text-center">
                <q-btn
                  round
                  type="button"
                  flat
                  @click="deleteAvailability(props.row.id)"
                  :disable="buttonsAreDisabled"
                >
                  <q-icon name="delete" color="red"/>
                  <BaseTooltip class="bg-red" tooltip="Obriši"/>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-dialog v-model="createAvailabilityDialogIsVisible" v-if="createAvailabilityDialogIsVisible" ref="dialog">
        <q-card>
          <q-card-section class="bg-primary text-white text-h6">
            <q-item style="display: flex; justify-content: space-between">
              <q-item-section avatar class="text-white" style="margin-top: 5px">
                <q-icon name="event_busy" size="lg"/>
              </q-item-section>
              <q-btn flat round icon="close" v-close-popup color="white"/>
            </q-item>
          </q-card-section>
            <q-stepper
              v-model="step"
              ref="stepper"
              alternative-labels
              color="primary"
              animated
            >
              <q-step
                :name="1"
                title="Datumi nedostupnosti"
                icon="date"
                :done="step > 1"
              >
                <q-date v-model="daysUnavailable"
                        multiple
                        mask="DD.MM.YYYY"
                        :options="optionsFn"
                        :events="events" :event-color="'red'"
                >
                </q-date>
              </q-step>

              <q-step
                :name="2"
                title="Vreme i razlog"
                icon="schedule"
                :done="step > 2"
              >

                <q-markup-table dense>
                  <thead>
                  <tr class="table-captions bg-primary text-white">
                    <th class="text-left">Datum</th>
                    <th class="text-center">Od</th>
                    <th class="text-center">Do</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(date,index) in unavailableDatesAndTimes" :key="date.date" :class="index % 2 === 0 ? 'bg-blue-grey-1':''">
                    <td class="text-left">{{date.date}}</td>
                    <td class="text-center">
                      <q-input style="width: 90px" outlined v-model="date.startTime" mask="time" readonly dense>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer" color="green">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="date.startTime">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Ok" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </td>
                    <td class="text-center">
                      <q-input style="width: 90px" outlined v-model="date.endTime" mask="time" readonly dense>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer" color="red">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="date.endTime">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Ok" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </td>
                  </tr>
                  </tbody>
                </q-markup-table>
                <q-input
                  style="margin-top: 20px"
                  v-model="reason"
                  filled
                  type="textarea"
                  label="Razlog..."
                />
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation style="display:flex; justify-content: space-between">
                  <q-btn rounded outline v-if="step > 1"  color="primary" @click="$refs.stepper.previous()" label="Nazad" class="q-ml-sm" />
                  <q-btn v-if="step === 1" rounded @click="setTimeList" color="primary" label="Dalje" />
                  <q-btn v-else rounded @click="addAvailability" color="secondary" label="Snimi" />
                </q-stepper-navigation>
              </template>
            </q-stepper>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import BaseTooltip from 'src/components/BaseTooltip.vue'
import {useQuasar, date} from "quasar";
import {useUserStore} from "stores/userStore";
import {computed, ref} from "vue";
import useUserAvailabilityTableColumns from "src/columns/userAvailabilityColumns";
import {useCurrentDate, useDBFormat} from "src/utils/dateHook";
import useNotificationMessage from "src/composables/notificationMessage";

const $q = useQuasar();
const userStore = useUserStore();
const dialog = ref()

const columns = useUserAvailabilityTableColumns()
// const availability = computed(()=>{
//   return userStore.userAvailability;
// })

const availability = ref<any>([])

const createAvailabilityDialogIsVisible = ref(false);

function openAvailabilityDialog(mode: 'create'|'update'){
  if(mode === 'create'){
    createAvailabilityDialogIsVisible.value = true;
  }else{
    createAvailabilityDialogIsVisible.value = true;
  }
}

function deleteAvailability(id: string){
  $q.dialog({
    title: 'Brisanje dostupnosti',
    message: 'Da li ste sigurni da želite da obrišete ovu dostupnost?',
    persistent: true,
    ok: {
      push: true,
      color: 'negative'
    },
    cancel: true
  }).onOk(async () => {
    await userStore.deleteAvailability(id);
  })
}

const daysUnavailable = ref()
function optionsFn (calendarDate: string) {
  const today = useDBFormat(useCurrentDate()).replace(/\-/g, "/");
  const newDate = date.addToDate(new Date(), { days: 14 });
  const tenDaysAfterToday = useDBFormat(date.formatDate(newDate,'DD.MM.YYYY')).replace(/\-/g, "/");
  console.log(tenDaysAfterToday)

  return calendarDate >= today && calendarDate <= tenDaysAfterToday
}

const events = ref<string[]>([])
// const startDate = ref();
// const endDate = ref();
//
// const dateRangeVariableNames = {
//   startDateName: "startDate",
//   endDateName: "endDate"
// };
//
// function setDate(dateObj: {startDateName: string, startDateValue: string, endDateName: string, endDateValue: string}) {
//   if (dateObj.startDateName === "startDate") {
//     startDate.value = dateObj.startDateValue;
//     endDate.value = dateObj.endDateValue;
//   }
// }

const startTime = ref('00:00')
const endTime = ref('23:59')



const reason = ref('')

async function addAvailability(){


  if(startTime.value >= endTime.value){
    useNotificationMessage('error','Krajnje vreme nedostupnosti je mora biti veće od početnog!')
    return;
  }





  dialog.value.hide();
  reason.value = ''

}

const buttonsAreDisabled = computed(()=>{
  let today = new Date();
  let day = today.getDay();
  let hour = today.getHours()

  return !(day === 1 || (day === 2 && hour < 16));
  //   return true;
})

const step = ref(1)

interface UnavailableDateTime {
  date: string;
  startTime: string;
  endTime: string;
}
const unavailableDatesAndTimes = ref<UnavailableDateTime[]>([]);

function setTimeList(){
  console.log(daysUnavailable.value)

  unavailableDatesAndTimes.value = daysUnavailable.value.map((el: string)=>{
    return {
      date: el,
      startTime: '00:00',
      endTime: '23:59'
    }
  }).sort((a: UnavailableDateTime, b: UnavailableDateTime) => {
    // Pretvaranje datuma iz "DD.MM.YYYY" u "YYYY-MM-DD" format za poređenje
    const dateA = a.date.split('.').reverse().join('-');
    const dateB = b.date.split('.').reverse().join('-');
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });



  step.value = 2
}

</script>

<style scoped>

</style>
