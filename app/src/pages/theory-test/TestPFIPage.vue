<template>
  <q-page padding>
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
                {{question.question}}
              </span>
              </q-item>


              <q-item dense>
                <q-item-section>
                  <q-input
                    readonly
                    dense
                    style="width: 100%"
                    filled
                    v-model="question.answer1.text"
                    label="Ponuđeni odgovor 1"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
                    type="text"
                  />
                </q-item-section>
                <q-item-section side >
                  <q-toggle color="green" v-model="question.answer1.isCorrect"
                            @update:model-value="updateAnswers(index,1)"/>
                </q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>
                  <q-input
                    readonly
                    dense
                    style="width: 100%"
                    filled
                    v-model="question.answer2.text"
                    label="Ponuđeni odgovor 2"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
                    type="text"
                  />
                </q-item-section>
                <q-item-section side >
                  <q-toggle color="green" v-model="question.answer2.isCorrect"
                            @update:model-value="updateAnswers(index,2)"/>
                </q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>
                  <q-input
                    dense
                    style="width: 100%"
                    filled
                    readonly
                    v-model="question.answer3.text"
                    label="Ponuđeni odgovor 3"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
                    type="text"
                  />
                </q-item-section>
                <q-item-section side >
                  <q-toggle color="green" v-model="question.answer3.isCorrect"
                            @update:model-value="updateAnswers(index,3)"/>
                </q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>
                  <q-input
                    dense
                    style="width: 100%"
                    filled
                    v-model="question.answer4.text"
                    label="Ponuđeni odgovor 4"
                    readonly
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
                    type="text"
                  />
                </q-item-section>
                <q-item-section side >
                  <q-toggle color="green" v-model="question.answer4.isCorrect"
                            @update:model-value="updateAnswers(index,4)"/>
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
<!--  <q-page class="row items-center justify-evenly">-->
<!--    <span class="text-h6 text-red">-->
<!--      Trenutno ne postoji aktivan test PFI! -->
<!--    </span>-->
<!--  </q-page>-->
</template>

<script setup lang="ts">
import BaseHeader from 'components/BaseHeader.vue'
import {reactive} from "vue";
import useNotificationMessage from "src/composables/notificationMessage";
import {useQuasar} from "quasar";

const $q = useQuasar();
const questions = reactive([
  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i' +
      ' van terena za igru. Lopta je u igri. Odluka sudije? Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije ' +
      'i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },

  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },
  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },
  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },
  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },
  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },
  {
    question: 'Vratar koristeći prekomernu snagu, udari protivnika koji se nalazi unutar vrata, ali iza poprečne linije i van terena za igru. Lopta je u igri. Odluka sudije?',
    answer1: {text: 'CK vrataru i KU', isCorrect: false},
    answer2: {text: 'CK vrataru i spuštanje lopte', isCorrect: false},
    answer3: {text: 'CK vrataru i ISU sa poprečne linije kaznenog prostora', isCorrect: false},
    answer4: {text: 'CK vrataru i DSU sa poprečne linije kaznenog prostora', isCorrect: false}
  },
])

function updateAnswers(index: number, correctAnswer: number){
  switch (correctAnswer){
    case 1 :
      questions[index].answer2.isCorrect = false;
      questions[index].answer3.isCorrect = false;
      questions[index].answer4.isCorrect = false;
      break;
    case 2 :
      questions[index].answer1.isCorrect = false;
      questions[index].answer3.isCorrect = false;
      questions[index].answer4.isCorrect = false;
      break;
    case 3 :
      questions[index].answer1.isCorrect = false;
      questions[index].answer2.isCorrect = false;
      questions[index].answer4.isCorrect = false;
      break;
    case 4 :
      questions[index].answer1.isCorrect = false;
      questions[index].answer2.isCorrect = false;
      questions[index].answer3.isCorrect = false;
      break;
  }
}

async function submit(){
  if(!validationSuccessful()){
    return;
  }
  submitTest();
}

function validationSuccessful(){

  const index = questions.findIndex(el => !el.answer1.isCorrect && !el.answer2.isCorrect
    && !el.answer3.isCorrect && !el.answer4.isCorrect);

  if(index !== -1){
    useNotificationMessage('error','Za pitanje broj ' + Number(Number(index)+1) + ' nije obeležen odgovor!');
    return false;
  }

  return true;
}


function submitTest(){
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
    console.log('cao');
  })
}
</script>

<style scoped>

</style>
