<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="list" title="Pregled testova PFI"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section>
        <q-table dense :rows="theoryTests" :columns="columns" row-key="name" :filter="filterTable">
          <template v-slot:top-left>
           <q-icon  name="quiz" size="md" color="primary">  </q-icon>
          </template>
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
                  @click="showTestDetailsPage(props.row.id)"
                >
                  <q-icon
                    name="manage_search"
                    color="amber-9"
                  />
                  <BaseTooltip class="bg-amber-9" tooltip="Detalji testa"/>
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
  </q-page>
</template>

<script setup lang="ts">
import BaseHeader from 'src/components/BaseHeader.vue'
import BaseTooltip from 'src/components/BaseTooltip.vue'
import {computed, ref} from "vue";
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import useTheoryTestColumns from "src/columns/theoryTestColumns";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";

const $q = useQuasar();
const router = useRouter();
const theoryTestStore = useTheoryAndVideoTestStore();

const columns = useTheoryTestColumns();
const theoryTests = computed(()=>{
  return theoryTestStore.getTheoryTest;
})
const filterTable = ref('');


async function getTheoryTest(){
  await theoryTestStore.getTheoryTestApi();
}

getTheoryTest();

function displayTestLeagues(league: string[]){
  let allLeagues = '';
  league.forEach(el => allLeagues === '' ? allLeagues = el : allLeagues = allLeagues + ', ' +el);
  return allLeagues;
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
    await theoryTestStore.deleteTest(id);
  })
}

function showTestDetailsPage(id: string){
    router.push({
    name: 'test.details',
    params: {id}
  });
}

async function downloadResultsExcel(id: string){

console.log('excel download: '+id);

await theoryTestStore.downloadExcel(id);

}

</script>

<style scoped>

</style>
