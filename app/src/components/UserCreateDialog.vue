<template>
  <q-dialog persistent ref="userCreationDialog">
    <q-card style="max-width: 800px">
      <q-card-section class="bg-primary text-white my-header">
        <BaseHeader icon="person_add" :title="props.mode === 'create' ? 'Kreiranje novog korisnika' : props.user.first_name + ' ' + props.user.last_name"></BaseHeader>
        <q-btn v-close-popup icon="close" color="white" flat rounded ></q-btn>
      </q-card-section>
      <q-card-section>
        <q-form
          ref="userForm"
          @submit="storeUser"
          class="q-gutter-md"
        >
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap">
            <div style="min-width: 350px" class="q-pa-md">
              <q-input
                :readonly="props.mode === 'user'"
                style="margin-bottom: 10px"
                filled
                v-model="name"
                label="Ime"
                hint="Unesite ime korisnika"
                lazy-rules
                :rules="nameRules"
                autofocus
              />
              <q-input
                :readonly="props.mode === 'user'"
                style="margin-bottom: 10px"
                filled
                v-model="surname"
                label="Prezime"
                hint="Unesite prezime korisnika"
                lazy-rules
                :rules="surnameRules"
              />

              <q-input
                style="margin-bottom: 10px"
                filled
                v-model="email"
                label="E-mail"
                hint="Unesite e-mail korisnika"
                lazy-rules
                :rules="emailRules"
              />
              <q-input
                style="margin-bottom: 10px"
                filled
                label="Broj telefona*"
                hint="Unesite broj telefona korisnika"
                v-model.trim="phoneNumber"
                :rules="[ val => val && val.length > 0 || 'Ovo polje ne sme biti prazno!']"
              />

              <q-input   style="margin-bottom: 10px" filled v-model="dateOfBirth" hint="Izaberite datum rođenja"  readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="primary"

                  >
                    <q-popup-proxy  cover transition-show="scale" transition-hide="scale" >
                      <q-date v-if="props.mode !== 'user'" v-model="dateOfBirth" mask="DD.MM.YYYY"  no-unset default-view="Years">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Ok" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div style="min-width: 350px" class="q-pa-md">
              <q-select :readonly="props.mode === 'user'" style="margin-bottom: 10px" filled v-model="role" :options="roleOptions" label="Tip korisnika" hint="Izaberite tip korisnika" />
              <q-select :readonly="props.mode === 'user'"   style="margin-bottom: 10px" filled v-model="league" :options="leagueOptions" label="Liga" hint="Izaberite ligu" />
              <q-select  :readonly="props.mode === 'user'"  style="margin-bottom: 10px" filled v-model="refereeType" :options="refereeTypeOptions" label="Lista sudije" hint="Izaberite sa koje je liste sudija" />
              <q-input
                v-if="props.mode==='create'"
                style="margin-bottom: 10px"
                filled
                label="Lozinka*"
                hint="Unesite lozinku"
                v-model.trim="password"
                :rules="[ val => val && val.length > 8 || 'Ovo polje mora imati minimum 8 karaktera!']"
                :type="isPwd ? 'password' : 'text'"
              >
                <template v-slot:append >
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-btn v-if="props.mode==='create'" style="width: 90%; margin: 20px 20px" :label="buttonAction" type="submit" color="primary"/>
              <q-btn v-else style="width: 90%; margin: 20px 20px" :label="buttonAction" type="submit" color="primary"/>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useUserStore} from "stores/userStore";
import BaseHeader from "components/BaseHeader.vue";
import {Validator} from "quasar-easy-validate";
import {useDBFormat, useUIFormat} from "src/utils/dateHook";
import {User} from "src/interfaces/user";
import {useAuthenticatedUserStore} from "stores/authUserStore";

const props = defineProps<{
  mode: 'create'|'update'|'user',
  user?: User,
}>();



const userStore = useUserStore();
const userCreationDialog = ref();


const userForm = ref();

const buttonAction = props.mode === 'create' ? 'Kreiraj korisnika' : 'Ažuriraj korisnika'

const name = ref('');
const surname = ref('');
const email = ref('');
const phoneNumber = ref('');
const dateOfBirth = ref('01.01.2000');
const password = ref('')

const roleOptions = ['USER', 'FSB ADMIN'];
const role = ref(roleOptions[0]);

const leagueOptions = ['MLADJE KATEGORIJE','MEDJUOPSTINSKA LIGA','PRVA BEOGRADSKA LIGA', 'ZONSKA LIGA','SRPSKA LIGA','PRVA LIGA SRBIJE', 'SUPER LIGA SRBIJE'];
const league = ref(leagueOptions[0]);

const refereeTypeOptions = ['SUDIJA', 'POMOĆNI SUDIJA','DELEGAT'];
const refereeType = ref(refereeTypeOptions[0]);

const nameRules = [(name: string) => new Validator(name)
  .required('Ime korisnika je obavezno')
  .stringMin(3, 'Ime korisnika mora imati barem 3 karaktera')
  .stringMax(255, 'Ime korisnika može imati najviše 255 karaktera')
  .validate()]
const surnameRules = [(surname: string) => new Validator(surname)
  .required('Prezime korisnika je obavezno')
  .stringMin(3, 'Prezime korisnika mora imati barem 3 karaktera')
  .stringMax(255, 'Prezime korisnika može imati najviše 255 karaktera')
  .validate()]
const emailRules = [(email: string) => new Validator(email)
  .required('E-mail korisnika je obavezan')
  .stringMin(3, 'E-mail korisnika mora imati barem 3 karaktera')
  .stringMax(255, 'E-mail korisnika može imati najviše 255 karaktera')
  .email('Nevalidna e-mail adresa')
  .validate()];

const isPwd = ref(true)

if(props.user){
  name.value = props.user.first_name
  surname.value = props.user.last_name
  email.value = props.user.email
  dateOfBirth.value = useUIFormat((props.user.date_of_birth).substring(0,10));
  phoneNumber.value = props.user.phone_number
  role.value = props.user.role
  refereeType.value = props.user.referee_type
  league.value = props.user.league

}

async function storeUser(){
  console.log(props.mode)

  if(props.mode === 'create'){

    const request = {
      first_name: name.value,
      last_name: surname.value,
      email: email.value,
      phone_number: phoneNumber.value,
      date_of_birth: useDBFormat(dateOfBirth.value)+'T00:00:00.000Z',
      role: role.value,
      league: league.value,
      referee_type: refereeType.value,
      active: true,
      password: password.value
    }

    await userStore.storeNewUser(request);
  }
  if(props.mode === 'update'){
    const request = {
      first_name: name.value,
      last_name: surname.value,
      email: email.value,
      phone_number: phoneNumber.value,
      date_of_birth: useDBFormat(dateOfBirth.value)+'T00:00:00.000Z',
      role: role.value,
      league: league.value,
      referee_type: refereeType.value,
      active:  props.user ? props.user.active : true,
      id: props.user ? props.user.id : ''
    }
    await userStore.updateUser(request);
  }
  if(props.mode === 'user'){

    const request = {
      first_name: name.value,
      last_name: surname.value,
      email: email.value,
      phone_number: phoneNumber.value,
      date_of_birth: useDBFormat(dateOfBirth.value)+'T00:00:00.000Z',
      role: role.value,
      league: league.value,
      referee_type: refereeType.value,
      active:  props.user ? props.user.active : true,
      id: props.user ? props.user.id : ''
    }
    await userStore.updateUser(request);

    useAuthenticatedUserStore().user = request


  }

  name.value = ''
  surname.value = ''
  email.value = ''
  phoneNumber.value =''
  password.value = ''
  userForm.value.resetValidation();
  userCreationDialog.value.hide();
}



</script>
<style scoped>
.my-header {
  display: flex;
  justify-content: space-between;
}
</style>
