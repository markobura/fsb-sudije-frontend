<template>
<q-page padding>
  <q-card>
    <q-card-section>
      <BaseHeader icon="play_circle" title="Video test"></BaseHeader>
    </q-card-section>
    <q-separator inset/>
    <q-card-section>
  <q-table dense :rows="videoTests" :columns="columns" row-key="name" >
    <template v-slot:top-left>
      <q-btn class="bg-green text-white" icon="add" round @click="openCreateVideoTestDialog">
        <BaseTooltip class="bg-green" tooltip="Kreiraj video test"/>
      </q-btn>
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
          <span>{{props.row.name}}</span>
        </q-td>
        <q-td key="league" :props="props">
                <span>
                  {{displayTestLeagues(props.row.league)}}
                </span>
        </q-td>
        <q-td key="details" :props="props"  class="text-center">
          <q-btn
            type="button"
            flat
            @click="openUpdateVideoTestDialog( props.row)"
          >
            <q-icon
              name="manage_search"
              color="amber-9"
            />
            <BaseTooltip class="bg-amber-9" tooltip="Detalji testa"/>
          </q-btn>
        </q-td>
        <q-td key="questions" :props="props"  class="text-center">
          <q-btn
            type="button"
            flat
            @click="openVideoTestDetails(props.row.id)"
          >
            <q-icon
              name="quiz"
              color="primary"
            />
            <BaseTooltip class="bg-primary" tooltip="Pitanja testa"/>
          </q-btn>
        </q-td>
        <q-td key="results" :props="props"  class="text-center">
          <q-btn
            type="button"
            flat
            @click="downloadResultsExcel(props.row.id)"
          >
            <q-icon
              name="query_stats"
              color="green"
            />
            <BaseTooltip class="bg-green" tooltip="Preuzmi excel sa rezultatima testa"/>
          </q-btn>
        </q-td>
        <q-td key="delete" :props="props"  class="text-center">
          <q-btn
            round
            type="button"
            flat
            @click="deleteTest(props.row.id)"
          >
            <q-icon
              name="delete"
              color="red"
            />
            <BaseTooltip class="bg-red" tooltip="Obriši test"/>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</q-card-section>
</q-card>
  <q-dialog persistent v-model="createVideoTestDialogIsVisible" v-if="createVideoTestDialogIsVisible">
    <q-card>
      <q-card-section class="bg-green text-white my-header">
        <BaseHeader  icon="play_circle"  title="Video test">
          <q-btn v-close-popup icon="close" color="white" flat round></q-btn>
        </BaseHeader>
      </q-card-section>
      <q-card-section style="min-width: 300px">
        <q-input dense filled v-model="date" hint="Izaberite datum održavanja testa"  readonly>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="primary">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                <q-date v-model="date" mask="DD.MM.YYYY"  no-unset>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Ok" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section style="min-width: 300px">
        <q-input dense filled v-model="startTime" mask="time" :rules="['time']" hint="Izaberite vreme održavanja testa" readonly>
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
      <q-card-section style="min-width: 300px">
        <q-input dense filled v-model="endTime" mask="time" :rules="['time']" hint="Izaberite vreme završetka testa" readonly>
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
        <q-card-section style="min-width: 300px">
          <q-select dense  style="max-width: 400px" filled v-model="league" multiple :options="leagueOptions" label="Liga" hint="Izaberite ligu za koju se kreira test" />
        </q-card-section>
        <q-card-section style="min-width: 300px">
          <q-select dense style="max-width: 400px" filled v-model="refereeType" multiple :options="refereeTypeOptions" label="Lista" hint="Izaberite listu za koju se kreira test" />
        </q-card-section>
        <q-card-section>
          <q-btn class="bg-blue-grey-8 text-center text-white"
                 :label="updateTestId === 0 ? 'Kreiraj video test' : 'Ažuriraj video test'"
                 @click="createVideoTest" rounded/>
        </q-card-section>
    </q-card>
  </q-dialog>
</q-page>
</template>

<script setup lang="ts">
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import {computed, ref} from "vue";
import useVideoTestColumns from "src/columns/videoTestColumns";
import BaseTooltip from 'src/components/BaseTooltip.vue'
import BaseHeader from 'src/components/BaseHeader.vue'
import {useCurrentDate, useDBFormat, useUIFormat} from "src/utils/dateHook";
import useNotificationMessage from "src/composables/notificationMessage";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";

const videoTestStore = useTheoryAndVideoTestStore();
const $q = useQuasar();
const router = useRouter();



const columns = useVideoTestColumns();
const videoTests = computed(()=>{
  return videoTestStore.getVideoTests;
})
function displayTestLeagues(league: string[]){
  let allLeagues = '';
  league.forEach(el => allLeagues === '' ? allLeagues = el : allLeagues = allLeagues + ', ' +el);
  return allLeagues;
}

async function getVideoTestsApi(){
  return videoTestStore.getVideoTestApi();
}
getVideoTestsApi();

const updateTestId = ref(0)


let date = ref(useCurrentDate());
let startTime = ref('10:00');
let endTime = ref('11:00');


const leagueOptions = ['TESTOVI','TMP','FUTSAL','KIPAR','MLADJE KATEGORIJE','MEDJUOPSTINSKA LIGA','PRVA BEOGRADSKA LIGA', 'ZONSKA LIGA','SRPSKA LIGA','PRVA LIGA SRBIJE', 'SUPER LIGA SRBIJE'];
let league = ref([]);

const refereeTypeOptions = ['SUDIJA', 'POMOĆNI SUDIJA','DELEGAT'];
let refereeType = ref([]);

const createVideoTestDialogIsVisible = ref(false)
function openCreateVideoTestDialog(){
  createVideoTestDialogIsVisible.value = true
  updateTestId.value = 0
  date.value = useCurrentDate();
  startTime.value = '10:00'
  endTime.value = '11:00'
  league.value = []
  refereeType.value = []
}

function openUpdateVideoTestDialog(test: any){
  createVideoTestDialogIsVisible.value = true
  updateTestId.value = test.id
  date.value = useUIFormat(test.start_date.substring(0,10));
  const timeZone = new Date().getTimezoneOffset() / 60;
  const startTimeHours = Number(test.start_date.substring(11,13)) - timeZone < 10 ?
    '0'+(Number(test.start_date.substring(11,13)) - timeZone) : Number(test.start_date.substring(11,13)) - timeZone
  const endTimeHours = Number(test.end_date.substring(11,13)) - timeZone < 10 ?
    '0'+(Number(test.end_date.substring(11,13)) - timeZone) : Number(test.end_date.substring(11,13)) - timeZone
  startTime.value = startTimeHours+':'+test.start_date.substring(14,16)
  endTime.value = endTimeHours+':'+test.end_date.substring(14,16)
  league.value = test.league
  refereeType.value = test.role


}
async function createVideoTest(){

  if(endTime.value <= startTime.value){
    useNotificationMessage('error','Vreme završetka testa mora biti veće od vremena početka testa!');
    return false;
  }

  if(!league.value || league.value.length === 0){
    useNotificationMessage('error','Niste uneli ligu!');
    return false;
  }

  if(!refereeType.value ||  league.value.length === 0){
    useNotificationMessage('error','Niste uneli Listu!');
    return false;
  }

  const startDate = new Date(useDBFormat(date.value)+'T'+startTime.value+':00');
  const endDate = new Date(useDBFormat(date.value)+'T'+endTime.value+':00');

  const request = {
    name: 'Test: ' + date.value + ' ' + startTime.value,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    league: [...league.value],
    role: [...refereeType.value],
  }

  if(updateTestId.value === 0){
    await videoTestStore.storeVideoTest(request);
  }else{
    await videoTestStore.updateVideoTest(updateTestId.value, request);
  }

  createVideoTestDialogIsVisible.value = false;
  date.value = useCurrentDate();
  startTime.value = '10:00'
  endTime.value = '11:00'
  league.value = []
  refereeType.value = []
}

function deleteTest(id: string){
  $q.dialog({
    title: 'Brisanje testa',
    message: 'Ukoliko obrišete ovaj test, on će trajno biti izbrisan iz sistema.',
    persistent: true,
    ok: {
      push: true,
      color: 'negative'
    },
    cancel: true
  }).onOk(async () => {
    await videoTestStore.deleteVideoTest(id);
  })
}

async function downloadResultsExcel(id: string){
  await videoTestStore.downloadExcelVideoTest(id);
}




function openVideoTestDetails(id: number | string){
  router.push({
    name: 'video-test.details',
    params: {id}
  });
}



</script>

<style scoped>

</style>
