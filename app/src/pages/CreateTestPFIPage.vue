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
                  <q-select filled v-model="league" :options="leagueOptions" label="Liga" hint="Izaberite ligu za koju se kreira test" />
                </q-card-section>
                <q-card-section style="min-width: 300px">
                  <q-input filled v-model="date" hint="Izaberite datum održavanja testa"  readonly>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" color="primary">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                          <q-date v-model="date" mask="DD.MM.YYYY"  no-unset default-view="Years">
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
                  <q-input filled v-model="time" mask="time" :rules="['time']" hint="Izaberite vreme održavanja testa" readonly>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer" color="primary">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="time">
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
                    v-model="question.question"
                    label="Pitanje"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
                    dense
                    type="textarea"
                  />

                    <q-item dense>
                      <q-item-section>
                        <q-input
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
import BaseHeader from 'src/components/BaseHeader.vue'
import {reactive, ref} from "vue";
import {useCurrentDate} from "src/utils/dateHook";
import useNotificationMessage from "src/composables/notificationMessage";



const date = ref(useCurrentDate());
const time = ref('10:00');

const leagueOptions = ['MLADJE KATEGORIJE','MEDJUOPSTINSKA LIGA','PRVA BEOGRADSKA LIGA', 'ZONSKA LIGA','SRPSKA LIGA','PRVA LIGA SRBIJE', 'SUPER LIGA SRBIJE'];
const league = ref(leagueOptions[0]);


const questions = reactive([
  {
    question: '',
    answer1: {text: '', isCorrect: false},
    answer2: {text: '', isCorrect: false},
    answer3: {text: '', isCorrect: false},
    answer4: {text: '', isCorrect: false}
  },

])

function addNewQuestion(){
  questions.push({
    question: '',
    answer1: {text: '', isCorrect: false},
    answer2: {text: '', isCorrect: false},
    answer3: {text: '', isCorrect: false},
    answer4: {text: '', isCorrect: false}
  })
}

function deleteQuestion(index: number){
  questions.splice(index,1);
}

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
  useNotificationMessage('success','Uspesno!')
}


function validationSuccessful(){
  //empty question exists
  const index = questions.findIndex(el => el.question === '');
  if(index !== -1){
    useNotificationMessage('error','Pitanje broj ' + Number(Number(index)+1) + ' je prazno!');
    return false;
  }

  // validation for question passed

  // empty answers exist

  const index2 = questions.findIndex(el => el.answer1.text === '' || el.answer2.text === '' ||
                                           el.answer3.text === '' || el.answer4.text === '' )

  if(index2 !== -1){
    useNotificationMessage('error','Za pitanje broj ' + Number(Number(index2)+1) + ' nisu uneti svi ponuđeni odgovori!');
    return false;
  }

  // validation for answers passed

  const index3 = questions.findIndex(el => !el.answer1.isCorrect && !el.answer2.isCorrect
                                         && !el.answer3.isCorrect && !el.answer4.isCorrect);

  if(index3 !== -1){
    useNotificationMessage('error','Za pitanje broj ' + Number(Number(index3)+1) + ' nije obeležen tačan odgovor!');
    return false;
  }

  return true;
}


</script>

<style scoped>

</style>
