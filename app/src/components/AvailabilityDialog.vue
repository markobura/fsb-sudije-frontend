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
              :disable="buttonsAreDisabled"
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
          <q-form @submit="addAvailability">
          <q-card-section  style="min-width: 300px" >
<!--            <date-range-filter-->
<!--              hint="Izaberite period nedostupnosti"-->
<!--              :date-range-variable-names="dateRangeVariableNames"-->
<!--              @set-date="setDate"-->
<!--              ref="transactionPeriod"-->
<!--            />-->
            <q-input outlined v-model="dateUnavailable" hint="Izaberite datum nedostupnosti"  readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="primary">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                    <q-date v-model="dateUnavailable" mask="DD.MM.YYYY"  no-unset :options="optionsFn" :events="events" :event-color="'red'">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Ok" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-checkbox v-model="wholeDay" label="Ceo dan" @update:model-value="setWholeDay" />
          </q-card-section>
          <q-card-section style="min-width: 300px" v-if="!wholeDay">
              <q-input outlined v-model="startTime" mask="time" :rules="['time']" hint="Izaberite od kad ste nedostupni" readonly dense>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer" color="green">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="startTime">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Ok" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>
            <q-card-section style="min-width: 300px" v-if="!wholeDay">
              <q-input outlined v-model="endTime" mask="time" :rules="['time']" hint="Izaberite do kad ste nedostupni" readonly dense>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer" color="red">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="endTime">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Ok" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>
          <q-card-section>
            <q-input
              outlined
              v-model="reason"
              label="Razlog"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
              dense
              type="textarea"
            />
          </q-card-section>
          <q-card-section>
            <q-btn label="Dodaj" rounded class="bg-green text-white" type="submit"></q-btn>
          </q-card-section>
          </q-form>
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
import DateRangeFilter from 'src/components/DateRangeFilter.vue'
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

const dateUnavailable = ref(useCurrentDate())
function optionsFn (calendarDate: string) {
  const today = useDBFormat(useCurrentDate()).replace(/\-/g, "/");
  const newDate = date.addToDate(new Date(), { days: 10 });
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

const wholeDay = ref(true)

function setWholeDay(){
  if(wholeDay.value){
    startTime.value = '00:00'
    endTime.value = '23:59'
  }
}

const reason = ref('')

async function addAvailability(){


  if(startTime.value >= endTime.value){
    useNotificationMessage('error','Krajnje vreme nedostupnosti je mora biti veće od početnog!')
    return;
  }

  console.log('add');
  availability.value.push({
    period: dateUnavailable.value,
    time: startTime.value + ' - ' + endTime.value,
    reason: reason.value
  })

  events.value.push((useDBFormat(dateUnavailable.value)).replace(/\-/g, "/"));


  dialog.value.hide();
  wholeDay.value = true
  dateUnavailable.value = useCurrentDate()
  startTime.value = '00:00'
  endTime.value = '23:59'
  reason.value = ''

}

const buttonsAreDisabled = computed(()=>{
  let today = new Date();
  let day = today.getDay();
  let hour = today.getHours()

  return !(day === 1 || (day === 2 && hour < 16));
  //   return true;
})


</script>

<style scoped>

</style>
