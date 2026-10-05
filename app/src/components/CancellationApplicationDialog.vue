<template>
  <q-dialog full-width>
    <q-card >
      <q-card-section class="bg-blue-grey-7 text-white text-h6">
        <q-item style="display: flex; justify-content: space-between">
          <q-item-label class="text-h5 text-white" style="margin-top: 5px">Prijava za otkaze</q-item-label>
          <q-btn flat round icon="close" v-close-popup color="white"/>
        </q-item>
      </q-card-section>
      <q-card-section>
        <q-table :rows="userCancellationApplications" :columns="columns" row-key="id" dense
                 no-data-label="Niste prijavljeni ni za jedan otkaz.">
          <template v-slot:top-left>
            <q-btn
              round
              color="green"
              icon="add"
              @click="openCreateDialog"
            >
              <BaseTooltip class="bg-green" tooltip="Prijavi se za otkaze"/>
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
              <q-td key="date" :props="props">
                <span>{{useUIFormat(props.row.date)}}</span>
              </q-td>
              <q-td key="time" :props="props">
                <span>{{formatTimeDisplay(props.row.start_time, props.row.end_time)}}</span>
              </q-td>
              <q-td key="note" :props="props">
                <span>
                  {{props.row.note.length > 100 ? props.row.note.substring(0,97)+'...' : props.row.note}}
                  <q-tooltip
                    v-if="props.row.note.length > 100"
                    class="bg-primary"
                    style="font-size: 15px; width: 300px"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]">
                    {{ props.row.note }}
                  </q-tooltip>
                </span>
              </q-td>
              <q-td key="delete" :props="props"  class="text-center">
                <q-btn
                  round
                  type="button"
                  flat
                  @click="deleteCancellationApplication(props.row.id)"
                >
                  <q-icon name="delete" color="red"/>
                  <BaseTooltip class="bg-red" tooltip="Obriši"/>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-dialog v-model="createDialogIsVisible" v-if="createDialogIsVisible" ref="dialog">
        <q-card>
          <q-card-section class="bg-primary text-white text-h6">
            <q-item style="display: flex; justify-content: space-between" dense>
              <q-item-section avatar class="text-white">
                <q-icon name="how_to_reg" size="md"/>
              </q-item-section>
              <q-btn flat round icon="close" v-close-popup color="white"/>
            </q-item>
          </q-card-section>
          <q-card-section class="no-padding">
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              animated
              class="stepper-background"
            >
              <q-step
                :name="1"
                title="Datumi"
                icon="event"
                :done="step > 1"
              >
                <div class="full-width-height no-margin">
                  <q-date v-model="selectedDays"
                          multiple
                          mask="DD.MM.YYYY"
                          :options="optionsFn"
                          class="no-margin no-padding full-width-height"
                  ></q-date>
                </div>
              </q-step>

              <q-step
                :name="2"
                title="Vreme i napomena"
                icon="schedule"
                :done="step > 2"
              >
                <q-banner dense rounded class="bg-blue-grey-1 text-blue-grey-9 q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="info" color="primary"/>
                  </template>
                  Izaberite vreme kada ste slobodni za otkaz. Ako tog dana već imate utakmicu,
                  navedite to u napomeni, npr:
                  <ul class="q-my-xs q-pl-md">
                    <li v-for="example in noteExamples" :key="example"><i>{{ example }}</i></li>
                  </ul>
                </q-banner>

                <q-markup-table dense>
                  <thead>
                  <tr class="table-captions bg-primary text-white">
                    <th class="text-left">Datum</th>
                    <th class="text-center">Od</th>
                    <th class="text-center">Do</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="(day, index) in cancellationDatesAndTimes" :key="day.date">
                    <tr :class="['date-row', index % 2 === 0 ? 'bg-blue-grey-1':'']">
                      <td class="text-left">{{day.date}}</td>
                      <td class="text-center">
                        <q-input style="width: 89px" outlined v-model="day.startTime" mask="time" readonly dense>
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer" color="green">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="day.startTime">
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
                        <q-input style="width: 89px" outlined v-model="day.endTime" mask="time" readonly dense>
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer" color="red">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="day.endTime">
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
                        <q-btn v-if="!day.hasExtraTime" round flat icon="add" color="green" size="sm" @click="day.hasExtraTime = true">
                          <BaseTooltip class="bg-green" tooltip="Dodaj drugi termin"/>
                        </q-btn>
                      </td>
                    </tr>
                    <tr v-if="day.hasExtraTime" :class="['date-row', index % 2 === 0 ? 'bg-blue-grey-1':'']">
                      <td class="text-left" style=" padding-left: 16px">{{day.date}}</td>
                      <td class="text-center">
                        <q-input style="width: 89px" outlined v-model="day.extraStartTime" mask="time" readonly dense>
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer" color="green">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="day.extraStartTime">
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
                        <q-input style="width: 89px" outlined v-model="day.extraEndTime" mask="time" readonly dense>
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer" color="red">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="day.extraEndTime">
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
                        <q-btn round flat icon="remove" color="red" size="sm" @click="day.hasExtraTime = false">
                          <BaseTooltip class="bg-red" tooltip="Ukloni drugi termin"/>
                        </q-btn>
                      </td>
                    </tr>
                    <tr :class="index % 2 === 0 ? 'bg-blue-grey-1':''">
                      <td colspan="4" class="note-cell">
                        <q-input
                          v-model="day.note"
                          outlined
                          dense
                          autogrow
                          bg-color="white"
                          label="Napomena (opciono)"
                          :placeholder="'npr. ' + noteExamples[index % noteExamples.length]"
                          maxlength="300"
                        />
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </q-markup-table>
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation style="display:flex; justify-content: space-between">
                  <q-btn rounded outline v-if="step > 1"  color="primary" @click="$refs.stepper.previous()" label="Nazad" class="q-ml-sm" />
                  <q-btn v-if="step === 1" rounded @click="setTimeList" color="primary" label="Dalje" />
                  <q-btn v-else rounded @click="addCancellationApplications" color="green" label="Prijavi se" />
                </q-stepper-navigation>
              </template>
            </q-stepper>

          </q-card-section>
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
import useUserCancellationApplicationTableColumns from "src/columns/userCancellationApplicationColumns";
import {useCurrentDate, useDBFormat, useUIFormat} from "src/utils/dateHook";
import useNotificationMessage from "src/composables/notificationMessage";

const $q = useQuasar();
const userStore = useUserStore();
const dialog = ref()

const columns = useUserCancellationApplicationTableColumns()

const noteExamples = [
  'Završavam utakmicu na Novom Beogradu u 13:00',
  'Počinje mi utakmica u 16:00 na Karaburmi',
]

const userCancellationApplications = computed(()=>{
  return userStore.getUserCancellationApplications;
})

async function getUserCancellationApplications(){
  await userStore.getUserCancellationApplicationsApi();
}
getUserCancellationApplications();

function formatTimeDisplay(startTime: string, endTime: string): string {
  if (startTime.includes(' - ')) {
    // Dva termina: start_time = "HH:MM - HH:MM", end_time = "HH:MM - HH:MM"
    return startTime + ' | ' + endTime
  }
  // Jedan termin: backend vraca HH:MM:SS format
  return startTime.substring(0, 5) + ' - ' + endTime.substring(0, 5)
}

const createDialogIsVisible = ref(false);

function openCreateDialog(){
  createDialogIsVisible.value = true;
}

function deleteCancellationApplication(id: string){
  $q.dialog({
    title: 'Brisanje prijave za otkaze',
    message: 'Da li ste sigurni da želite da obrišete ovu prijavu za otkaze?',
    persistent: true,
    ok: {
      push: true,
      color: 'negative'
    },
    cancel: true
  }).onOk(async () => {
    await userStore.deleteCancellationApplication(id);
  })
}

const selectedDays = ref<string[]>([])
function optionsFn (calendarDate: string) {
  const todayDay = new Date().getDay() // 0=ned, 1=pon, 2=uto, 3=sre, 4=čet, 5=pet, 6=sub

  // Broj dana do naredne subote/nedjelje (min 1 dan unaprijed)
  const daysToNextSat = ((6 - todayDay + 7) % 7) || 7
  const daysToNextSun = ((0 - todayDay + 7) % 7) || 7

  const nextSatStr = date.formatDate(date.addToDate(new Date(), { days: daysToNextSat }), 'YYYY/MM/DD')
  const nextSunStr = date.formatDate(date.addToDate(new Date(), { days: daysToNextSun }), 'YYYY/MM/DD')

  const alreadyApplied = userStore.getUserCancellationApplications.map(el => {
    return (el.date).replaceAll('-','/')
  })

  return (calendarDate === nextSatStr || calendarDate === nextSunStr) && !alreadyApplied.includes(calendarDate)
}

async function addCancellationApplications(){

  const errorFound = cancellationDatesAndTimes.value.find((el) => {
    if (el.startTime >= el.endTime) return true
    if (el.hasExtraTime && el.extraStartTime >= el.extraEndTime) return true
    return false
  })

  if(errorFound){
    useNotificationMessage('error','Krajnje vreme za datum '+errorFound.date+' mora biti veće od početnog!')
    return;
  }

  const request = {
    cancellation_applications:
      cancellationDatesAndTimes.value.map(el => {
        return {
          date: useDBFormat(el.date),
          start_time: el.hasExtraTime ? el.startTime + ' - ' + el.endTime : el.startTime,
          end_time: el.hasExtraTime ? el.extraStartTime + ' - ' + el.extraEndTime : el.endTime,
          note: el.note.trim()
        }
      })
  }

  await userStore.addCancellationApplications(request);

  dialog.value.hide();
  step.value = 1;
  cancellationDatesAndTimes.value = []
  selectedDays.value = []
}


const step = ref(1)

interface CancellationDateTime {
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  hasExtraTime: boolean;
  extraStartTime: string;
  extraEndTime: string;
}
const cancellationDatesAndTimes = ref<CancellationDateTime[]>([]);

function setTimeList(){
  if(!selectedDays.value || selectedDays.value.length === 0){
    useNotificationMessage('error','Morate izabrati barem jedan datum!')
    return
  }

  // Cuvamo vec unete vrednosti ako se korisnik vrati na izbor datuma
  const previousValues = new Map(cancellationDatesAndTimes.value.map(el => [el.date, el]));

  cancellationDatesAndTimes.value = selectedDays.value.map((el: string)=>{
    return previousValues.get(el) ?? {
      date: el,
      startTime: '00:00',
      endTime: '23:59',
      note: '',
      hasExtraTime: false,
      extraStartTime: '00:00',
      extraEndTime: '23:59'
    }
  }).sort((a: CancellationDateTime, b: CancellationDateTime) => {
    // Pretvaranje datuma iz "DD.MM.YYYY" u "YYYY-MM-DD" format za poređenje
    const dateA = a.date.split('.').reverse().join('-');
    const dateB = b.date.split('.').reverse().join('-');
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  step.value = 2
}

</script>

<style scoped>

.stepper-background >>> .q-stepper__tab:first-child {
  padding-left: 10px;
}

.stepper-background >>> .q-stepper__tab:last-child {
  padding-right: 10px;
}

.stepper-background >>> .q-stepper__step-inner,
.stepper-background >>> .q-stepper__nav {
  padding: 10px;
}

.date-row > td {
  border-bottom: none !important;
}

.note-cell {
  padding-top: 0 !important;
  padding-bottom: 10px !important;
  border-bottom: 2px solid #b0bec5;
}
</style>
