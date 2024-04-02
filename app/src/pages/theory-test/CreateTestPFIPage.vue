<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="quiz" title="Kreiranje testa PFI"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section>
              <q-card class="q-pa-md" >
                <div style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
                <q-card-section style="min-width: 300px">
                  <q-select style="max-width: 400px" filled v-model="league" multiple :options="leagueOptions" label="Liga" hint="Izaberite ligu za koju se kreira test" />
                </q-card-section>
                  <q-card-section style="min-width: 300px">
                    <q-select style="max-width: 400px" filled v-model="refereeType" multiple :options="refereeTypeOptions" label="Lista" hint="Izaberite listu za koju se kreira test" />
                  </q-card-section>
                <q-card-section style="min-width: 300px">
                  <q-input filled v-model="date" hint="Izaberite datum održavanja testa"  readonly>
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
                  <q-input filled v-model="startTime" mask="time" :rules="['time']" hint="Izaberite vreme održavanja testa" readonly>
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
                    <q-input filled v-model="endTime" mask="time" :rules="['time']" hint="Izaberite vreme završetka testa" readonly>
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
                </div>

                <q-separator inset style="margin-bottom: 10px"/>

                <q-card-section  class="bg-blue-grey-1 q-pa-md"
                                 style="border-radius: 20px; margin-bottom: 10px"
                  v-for="(question, index) in questions" :key="question"
                >
                  <div style="width: 100%">
                  <span class="text-h6" style="margin-bottom: 122px">{{index+1 + '. Pitanje'}}</span>
                  <q-input
                    style="margin: 10px 0; width: 100%"
                    filled
                    v-model="question.question_text"
                    label="Pitanje"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
                    dense
                    type="textarea"
                  />

                    <q-item dense v-for="(answers,index2) in question.answers" :key="answers">
                      <q-item-section>
                        <q-input
                          dense
                          style="width: 100%"
                          filled
                          v-model.trim="answers.answer_text"
                          :label="`Ponuđeni odgovor ${index2+1}`"
                          lazy-rules
                          hint=""
                          type="text"
                        />
                      </q-item-section>
                      <q-item-section side >
                        <q-toggle color="green" v-model="answers.is_correct"
                                  @update:model-value="updateAnswers(index,index2)"/>
                      </q-item-section>
                    </q-item>

                  </div>
                  <div style="display: flex; justify-content: space-between">
                    <div></div>
                    <q-btn :disable="questions.length===1" class="q-ma-md" rounded color="red" label="Obriši pitanje" @click="deleteQuestion(index)"/>
                  </div>
                </q-card-section>
                <div style="display: flex; justify-content: center">
                  <div></div>
                  <q-btn color="green" round icon="add" @click="addNewQuestion()"/>
                </div>
              </q-card>
      </q-card-section>
      <q-card-section style="display: flex; justify-content: space-between">
        <div></div>
        <q-btn size='lg' class="q-ma-md" rounded color="primary" label="Sačuvaj test" @click="submit"/>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import BaseHeader from 'components/BaseHeader.vue'
import {ref} from "vue";
import {useCurrentDate, useDBFormat, useUIFormat} from "src/utils/dateHook";
import useNotificationMessage from "src/composables/notificationMessage";
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import {useRoute} from "vue-router";

const route = useRoute();
const theoryTestStore = useTheoryAndVideoTestStore();

let date = ref(useCurrentDate());
let startTime = ref('10:00');
let endTime = ref('11:00');

const leagueOptions = ['MLADJE KATEGORIJE','MEDJUOPSTINSKA LIGA','PRVA BEOGRADSKA LIGA', 'ZONSKA LIGA','SRPSKA LIGA','PRVA LIGA SRBIJE', 'SUPER LIGA SRBIJE'];
let league = ref<string[]>([]);

const refereeTypeOptions = ['SUDIJA', 'POMOĆNI SUDIJA','DELEGAT'];
let refereeType = ref<string[]>([]);

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

if(route.params.id){
  showTest();
}

async function showTest(){
  const test =  await theoryTestStore.showTest(String(route.params.id));
  if(test){
    date.value = useUIFormat(test.start_date.substring(0,10))
    startTime.value = test.start_date.substring(11,16)
    endTime.value = test.end_date.substring(11,16)
    league.value = test.league
    refereeType.value = test.role
    questions.value = test.theory_questions
  }
}



function addNewQuestion(){
  questions.value.push({
    question_text: '',
    answers: [
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false}
    ],
  })
}

function deleteQuestion(index: number){
  questions.value.splice(index,1);
}

function updateAnswers(index: number,correctAnswer: number){
  switch (correctAnswer){
    case 0 :
      questions.value[index].answers[1].is_correct = false;
      questions.value[index].answers[2].is_correct = false;
      questions.value[index].answers[3].is_correct= false;
      break;
    case 1 :
      questions.value[index].answers[0].is_correct = false;
      questions.value[index].answers[2].is_correct = false;
      questions.value[index].answers[3].is_correct = false;
      break;
    case 2 :
      questions.value[index].answers[0].is_correct = false;
      questions.value[index].answers[1].is_correct = false;
      questions.value[index].answers[3].is_correct = false;
      break;
    case 3 :
      questions.value[index].answers[0].is_correct = false;
      questions.value[index].answers[1].is_correct = false;
      questions.value[index].answers[2].is_correct = false;
      break;
  }
}


async function submit(){
  if(!validationSuccessful()){
    return;
  }

  console.log('capsss')

  const request = {
    name: 'Test: ' + date.value + ' ' + startTime.value,
    start_date: useDBFormat(date.value)+'T'+startTime.value + ':00.279+02:00',
    end_date: useDBFormat(date.value)+'T'+endTime.value + ':00.279+02:00',
    league: [...league.value],
    role: [...refereeType.value],
    theory_questions: [...questions.value]
  }

  console.log(request.theory_questions)

  request.theory_questions.forEach(el => {
    for (let i = el.answers.length - 1; i >= 0; i--) {
      const answer = el.answers[i];
      if (!answer.is_correct && answer.answer_text === '') {
        el.answers.splice(i, 1);
      }
    }
  });
  console.log(request.theory_questions)


  if(route.params.id){
    await theoryTestStore.updateTheoryTest(String(route.params.id),request);

  }else{
    await theoryTestStore.storeTheoryTest(request);

    league.value = []
    refereeType.value = []
    date.value = useCurrentDate();
    startTime.value = '10:00';
    endTime.value = '11:00';
    questions.value = [  {
      question_text: '',
      answers: [
        {answer_text: '',is_correct: false},
        {answer_text: '',is_correct: false},
        {answer_text: '',is_correct: false},
        {answer_text: '',is_correct: false}
      ],
    }]
  }




}


function validationSuccessful(){

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

  //empty question exists
  const index = questions.value.findIndex(el => el.question_text === '');
  if(index !== -1){
    useNotificationMessage('error','Pitanje broj ' + Number(Number(index)+1) + ' je prazno!');
    return false;
  }

  // validation for question passed

  //minimum 2 questions

  const index4 = questions.value.findIndex(el => {
    let nonEmptyAnswers = el.answers.filter(answer =>  answer.answer_text !== '')
    return nonEmptyAnswers.length < 2
  })
  if(index4 !== -1){
    useNotificationMessage('error','Za pitanje broj ' + Number(Number(index4)+1) + ' morate uneti najmanje 2 odgovora!');
    return false;
  }

  // empty answers exist

  // const index2 = questions.value.findIndex(el => {
  //   return el.answers.every(answer => answer.answer_text === '');
  // })
  //
  // if(index2 !== -1){
  //   useNotificationMessage('error','Za pitanje broj ' + Number(Number(index2)+1) + ' nisu uneti svi ponuđeni odgovori!');
  //   return false;
  // }

  // validation for answers passed

  const index3 = questions.value.findIndex(el => {
    return el.answers.every(answer => !answer.is_correct);
  });

  if(index3 !== -1){
    useNotificationMessage('error','Za pitanje broj ' + Number(Number(index3)+1) + ' nije obeležen tačan odgovor!');
    return false;
  }

  return true;
}


</script>

<style scoped>

</style>
