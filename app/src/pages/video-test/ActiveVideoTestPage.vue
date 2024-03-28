<template>
  <q-page v-if="activeTestExist" padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="quiz" title="VIDEO TEST"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
        <q-stepper
        v-model="step"
        vertical
        color="primary"
        animated
      >
        <q-step
          icon="quiz"
          v-for="(question, index) in questions" :key="question"
          :name="index"
          :done="step > index"
          :title="index+1 + '. Pitanje'"
        >
            <div style="width: 100%">
              <q-item style="display: flex; justify-content: center; margin-bottom: 20px">
                <video controls style="max-width: 600px;" class="mobile-display">
                  <source :src="question.video" type="video/mp4"/>
                </video>
              </q-item>
              <q-item v-for="(answers,index2) in question.answers" :key="answers" dense style="margin-bottom: 10px">
                <q-item-section>
                  <span>
                  <strong class="text-primary">{{getAnswerOrder(index2)}}</strong>  {{answers.answer_text}}
                  </span>
                </q-item-section>
                <q-item-section side >
                  <q-toggle color="green" v-model="answers.is_correct"
                            @update:model-value="updateAnswers(index,index2)"/>
                </q-item-section>
              </q-item>
            </div>
            <q-separator inset/>
            <q-stepper-navigation style="text-align: right">
              <q-btn v-if="step === questions.length-1" @click="submit" color="green" label="Završi" rounded size='lg'/>
              <q-btn v-else @click="nextStep(index)" color="primary" label="Sledeće pitanje" rounded/>
            </q-stepper-navigation>

        </q-step>
        </q-stepper>
    </q-card>
  </q-page>

  <q-page v-else class="row items-center justify-evenly">

    <q-card style="display: flex; height: 200px; max-width: 330px; background-color: #D3D3D3" class="no-padding">
      <q-card-section style="align-self: center" >
        <q-icon name="warning" color="primary" size="50px"></q-icon>
      </q-card-section>
      <q-card-section style="align-self: center; display: flex; flex-direction: column">
        <q-card-section class="text-center text-bold" style="font-size: 16px">
          Trenutno ne postoji aktivan test!
          Pokušajte ponovo kasnije.
        </q-card-section>
        <q-card-actions style="align-self: center;">
          <q-btn @click="reloadPage" rounded label="Pokušaj ponovo" color="primary"></q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>


  </q-page>
</template>

<script setup lang="ts">
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import {computed, ref} from "vue";
import BaseHeader from 'src/components/BaseHeader.vue'
import useNotificationMessage from "src/composables/notificationMessage";
import {test} from "vitest";

const $q = useQuasar();
const router = useRouter();

const videoTestStore = useTheoryAndVideoTestStore();

const activeTestExist = computed(()=>{
  return videoTestStore.activeVideoTestExist;
})


async function getActiveTest(){
  console.log('video')
  await videoTestStore.getActiveVideoTestApi();
  questions.value = videoTestStore.getActiveVideoTest.questions;
  questions.value = shuffleArray(questions.value)
  console.log(questions.value)
}
getActiveTest();

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Zamena elemenata
  }
  return array;
}
const step = ref(0)
let questions = ref([
  {
    video: '',
    order_id: '',
    answers: [
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false}
    ],
  },
])

function reloadPage(){
  location.reload();
}

function getAnswerOrder(index: number){
  switch (index){
    case  0 :
      return 'a) '
    case  1 :
      return 'b) '
    case  2 :
      return 'c) '
    case  3 :
      return 'd) '
    case  4 :
      return 'e) '
    case  5 :
      return 'f) '
    case  6 :
      return 'g) '
  }
}
function updateAnswers(indexAnswer: number,correctAnswer: number){
  questions.value[indexAnswer].answers.forEach((el,index) => {
    if(index !== correctAnswer){
      el.is_correct = false
    }
  })
}

const showConfirmationDialog = ref(true);

function nextStep(index: number){
  if(!validationSuccessful(index)){
    return;
  }

  if(showConfirmationDialog.value) {
    $q.dialog({
      title: 'Naredno pitanje',
      message: 'Ukoliko odete na naredno pitanje, više se ne možete vratiti na ovo pitanje.',
      options: {
        type: 'checkbox',
        model: [],
        items: [
          {label: 'Ne prikazuj ovaj dialog više', value: '1', color: 'secondary'},
        ]
      },
      persistent: true,
      ok: {
        push: true,
        color: 'positive'
      },
      cancel: true
    }).onOk((data) => {
      console.log(data)
      if(data.includes('1')){
        showConfirmationDialog.value = false;
      }
      step.value++;
    })
  }else {
    step.value++;
  }
}

function sortByOrderId(a: any, b: any) {
  return a.order_id - b.order_id;
}

async function submit(){
  if(!validationSuccessful(questions.value.length -1)){
    return;
  }
  let testAnswers : { answer: string }[] = [];


  questions.value.sort(sortByOrderId)



  questions.value.forEach(question => {
    const index = question.answers.findIndex(answer => answer.is_correct);
    if(index !== -1){
      testAnswers.push({answer: question.answers[index].answer_text})
    }
  })

  console.log(testAnswers)

  await videoTestStore.submitVideoTest(testAnswers);
  await router.push({
    name: 'home'
  })
  location.reload();
}

function validationSuccessful(questionIndex: number){

  const answerIsNotSelected = questions.value[questionIndex].answers.every(answer => !answer.is_correct);

  if(answerIsNotSelected){
    useNotificationMessage('error','Morate označiti odgovor!');
    return false;
  }

  return true;
}

/*function submitTest(testAnswers: { answer: string }[]){*/
/*  $q.dialog({*/
/*    title: 'Slanje testa',*/
/*    message: 'Ukoliko pošaljete test više nećete biti u mogućnosti da promenite odgovore.',*/
/*    persistent: true,*/
/*    ok: {*/
/*      push: true,*/
/*      color: 'positive'*/
/*    },*/
//     cancel: true
//   }).onOk(async () => {
//     await videoTestStore.submitVideoTest(testAnswers);
//     await router.push({
//       name: 'home'
//     })
//     location.reload();
//   })
// }
</script>

<style scoped>
@media only screen and (max-width: 700px) {
  .mobile-display {
    width: 280px;
  }
}
</style>
