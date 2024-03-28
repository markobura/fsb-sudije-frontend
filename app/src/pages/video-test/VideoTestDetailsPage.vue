<template>
<q-page padding>
    <q-card>
      <q-card-section style="display: flex; justify-content: space-between">
        <BaseHeader icon="play_circle" :title="videoTest.name"></BaseHeader>
        <q-btn dense rounded class="bg-green text-white" label="Dodaj pitanje" @click="openAddVideoDialog"></q-btn>
      </q-card-section>
      <q-separator inset style="margin-bottom: 10px"/>
      <div class="q-pa-md">
      <q-card-section class="bg-blue-grey-1 q-pa-md"
        style="border-radius: 20px; margin-bottom: 10px"
        v-for="answers in videoTest.answers" :key="answers">
        <div style="display: flex; justify-content: space-between">
          <span class="text-h6" >{{answers.order_id + '. Pitanje'}}</span>
          <q-btn style="align-self:flex-start" icon="edit" round class="bg-orange text-white" @click="openUpdateVideoDialog(answers.order_id)"></q-btn>
        </div>
        <q-item style="display: flex; justify-content: center; margin-bottom: 20px">
            <video controls style="max-width: 600px;" class="mobile-display">
              <source :src="getVideoUrl(answers.order_id)" type="video/mp4"/>
            </video>
        </q-item>
        <q-item dense v-for="(answer,index) in answers.answers" :key="answer">
          <q-item-section>
            <q-input
              readonly
              dense
              style="width: 100%"
              filled
              v-model="answer.answer_text"
              :label="`Ponuđeni odgovor ${index+1}`"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
              type="text"
            />
          </q-item-section>
          <q-item-section side >
            <q-toggle disable color="green" v-model="answer.is_correct"
                      @update:model-value="updateAnswers(index)"/>
          </q-item-section>
        </q-item>
      </q-card-section>
      </div>
    </q-card>
    <q-dialog full-width persistent v-model="addVideoDialogIsVisible" v-if="addVideoDialogIsVisible">
    <q-card>
      <q-card-section class="bg-blue-grey-8 text-white my-header">
        <BaseHeader  icon="play_circle"  :title="dialogTitle">
          <q-btn style="margin-left: 10px" v-close-popup icon="close" color="white" flat round></q-btn>
        </BaseHeader>
      </q-card-section>
      <q-card-section style="width: 350px; margin-left: 15px">
        <q-file dense outlined color="primary" filled v-model="video"
                hint="Uploaduj video sa svog uređaja" accept=".mp4">
          <template v-slot:append>
            <q-icon name="cloud_upload" color="primary"/>
          </template>
        </q-file>
      </q-card-section>
      <q-card-section>
        <q-item dense v-for="(answer,index) in answers" :key="answer">
          <q-item-section>
            <q-input
              dense
              style="width: 100%"
              filled
              v-model.trim="answer.answer_text"
              :label="`Ponuđeni odgovor ${index+1}`"
              lazy-rules
              hint=""
              type="text"
            />
          </q-item-section>
          <q-item-section side >
            <q-toggle color="green" v-model="answer.is_correct"
                      @update:model-value="updateAnswers(index)"/>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section>
        <q-btn  @click="saveQuestion" label="Sačuvaj pitanje" rounded class="bg-green text-white"/>
      </q-card-section>
    </q-card>
  </q-dialog>

</q-page>
</template>

<script setup lang="ts">
import BaseHeader from 'src/components/BaseHeader.vue'
import {useRoute} from "vue-router";
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import useNotificationMessage from "src/composables/notificationMessage";
import {computed, ref} from "vue";

const videoTestStore = useTheoryAndVideoTestStore();
const route = useRoute();

async function showTest(){
  await videoTestStore.showVideoTest(String(route.params.id));
}
showTest();

const videoTest = computed(()=>{
  return videoTestStore.getVideoTest;
})

function getVideoUrl(orderId: number){
  const index = videoTest.value.urls.findIndex(el => el.order_id === orderId)
  return index !== -1 ? videoTest.value.urls[index].path : '';
}

const addVideoDialogIsVisible = ref(false)
const dialogTitle = ref('Novo pitanje')
const questionOrderId = ref(0)



function openAddVideoDialog(){
  addVideoDialogIsVisible.value = true
  video.value = null
  answers.value = [
    {answer_text: '',is_correct: false},
    {answer_text: '',is_correct: false},
    {answer_text: '',is_correct: false},
    {answer_text: '',is_correct: false}
  ]
  dialogTitle.value = 'Novo pitanje'
  questionOrderId.value = videoTest.value.answers ? videoTest.value.answers.length + 1 : 1;
}

function openUpdateVideoDialog(orderId: number){
  addVideoDialogIsVisible.value = true
  video.value = null
  const index =  videoTest.value.answers.findIndex(el => el.order_id === orderId)
  if(index !== -1){
    answers.value = videoTest.value.answers[index].answers;
  }
  dialogTitle.value = 'Ažuriranje ' + orderId + '. pitanja'
  questionOrderId.value = orderId
}

const video = ref()

const answers = ref([
  {answer_text: '',is_correct: false},
  {answer_text: '',is_correct: false},
  {answer_text: '',is_correct: false},
  {answer_text: '',is_correct: false}
])

function updateAnswers(answerIndex: number){
  answers.value.forEach((el,index) => {
    if(index !== answerIndex){
      el.is_correct = false
    }
  })
}

async function saveQuestion(){
  let nonEmptyAnswers = answers.value.filter(answer =>  answer.answer_text !== '')

  if(nonEmptyAnswers.length < 2){
    useNotificationMessage('error','Morate uneti najmanje 2 odgovora!');
    return false;
  }

  const index2 = answers.value.findIndex(el => {
    return el.is_correct;
  });

  if(index2 === -1){
    useNotificationMessage('error','Niste obeležili tačan odgovor!');
    return false;
  }

  if(dialogTitle.value === 'Novo pitanje'){
    if(!video.value){
      useNotificationMessage('error','Morate uploadovati video!')
      return
    }


    const request = new FormData();

    request.append('video',video.value);

    await videoTestStore.uploadVideo(request, String(route.params.id), questionOrderId.value, 'store');

    console.log(answers.value)

      for (let i = answers.value.length - 1; i >= 0; i--) {
        const answer = answers.value[i];
        if (!answer.is_correct && answer.answer_text === '') {
          answers.value.splice(i, 1);
        }
      }
    console.log(answers.value)

    await videoTestStore.addAnswers(answers.value, String(route.params.id),questionOrderId.value, 'store');


    addVideoDialogIsVisible.value = false
  }else{
   await updateQuestion()
  }




}


async function updateQuestion(){

  // const index = answers.value.findIndex(el => {
  //   return el.answer_text === '';
  // })
  //
  // if(index !== -1){
  //   useNotificationMessage('error','Nisu uneti svi ponuđeni odgovori!');
  //   return false;
  // }


  if(video.value){
    const request = new FormData();

    request.append('video',video.value);

    await videoTestStore.uploadVideo(request, String(route.params.id), questionOrderId.value, 'update');
  }

  console.log(answers.value)


  for (let i = answers.value.length - 1; i >= 0; i--) {
    const answer = answers.value[i];
    if (!answer.is_correct && answer.answer_text === '') {
      answers.value.splice(i, 1);
    }
  }
  console.log(answers.value)

  await videoTestStore.addAnswers(answers.value, String(route.params.id),questionOrderId.value,  'update');

  addVideoDialogIsVisible.value = false


}

</script>

<style scoped>
@media only screen and (max-width: 700px) {
  .mobile-display {
    width: 300px;
  }
}
</style>
