<template>
  <q-page v-if="activeTestExist" padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="quiz" title="TEST PRAVILA FUDBALSKE IGRE"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section>

          <q-card-section  class="bg-blue-grey-1 q-pa-md"
                           style="border-radius: 20px; margin-bottom: 10px"
                           v-for="(question, index) in questions" :key="question"
          >
            <div style="width: 100%">
              <span class="text-h6 text-primary" style="margin-bottom: 122px">{{index+1 + '. Pitanje'}}</span>
              <q-item>
                <span style="margin: 10px 0; width: 100%; font-size: 16px;" class="text-bold">
                {{question.question_text}}
              </span>
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
          </q-card-section>
      </q-card-section>
      <q-card-section style="display: flex; justify-content: space-between">
        <div></div>
        <q-btn size='lg' class="q-ma-md" rounded color="primary" label="Pošalji test" @click="submit"/>

      </q-card-section>
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
import BaseHeader from 'components/BaseHeader.vue'
import {computed, ref} from "vue";
import useNotificationMessage from "src/composables/notificationMessage";
import {useQuasar} from "quasar";
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import {useRouter} from "vue-router";

const $q = useQuasar();
const router = useRouter();

const theoryTestStore = useTheoryAndVideoTestStore();

const activeTestExist = computed(()=>{
  return theoryTestStore.activeTestExist;
})

async function getActiveTest(){
  await theoryTestStore.getActiveTestApi();
  questions.value = theoryTestStore.getActiveTest.theory_questions;
}
getActiveTest();

let questions = ref([
  {
    question_text: '',
    answers: [
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false}
    ],
  },
])

function updateAnswers(indexAnswer: number,correctAnswer: number){

      questions.value[indexAnswer].answers.forEach((el,index) => {
        if(index !== correctAnswer){
          el.is_correct = false
        }
      })
}
async function submit(){
  if(!validationSuccessful()){
    return;
  }

  let testAnswers : { answer: string }[] = [];

  questions.value.forEach(question => {
    const index = question.answers.findIndex(answer => answer.is_correct);
    if(index !== -1){
      testAnswers.push({answer: question.answers[index].answer_text})
    }
  })

  submitTest(testAnswers);
}

function validationSuccessful(){

  const index = questions.value.findIndex(el => {
    return el.answers.every(answer => !answer.is_correct);
  });

  if(index !== -1){
    useNotificationMessage('error','Za pitanje broj ' + Number(Number(index)+1) + ' nije obeležen odgovor!');
    return false;
  }

  return true;
}


function submitTest(testAnswers: { answer: string }[]){
  $q.dialog({
    title: 'Slanje testa',
    message: 'Ukoliko pošaljete test više nećete biti u mogućnosti da promenite odgovore.',
    persistent: true,
    ok: {
      push: true,
      color: 'positive'
    },
    cancel: true
  }).onOk(async () => {
    await theoryTestStore.submitTest(testAnswers);
    await router.push({
      name: 'home'
    })
    location.reload();

  })
}

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
</script>

<style scoped>

</style>
