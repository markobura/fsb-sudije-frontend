<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <q-img src="/images/blank-image.jpg" style="max-height: 150px"></q-img>
        <q-separator color="white"/>
      </q-card-section>
      <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model.trim='password'
              label='Lozinka'
              hint='Unesite lozinku'
              color='black'
              :type="isPwd ? 'password' : 'text'"
              :rules="[ val => val && val.length >= 8 || 'Ovo polje je obavezno i mora sadržati minimum 8 karaktera!', isPasswordValidRegex]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class='cursor-pointer'
                  @click='isPwd = !isPwd'
                />
              </template>
            </q-input>
            <q-input
              filled
              v-model.trim='passwordConfirmation'
              label='Potvrda lozinke'
              hint='Potvrdite unetu lozinku'
              lazy-rules
              color='black'
              :type="isPwdConfirm ? 'password' : 'text'"
              :rules="[ val => val && val.length >= 8 || 'Ovo polje je obavezno i mora sadržati minimum 8 karaktera!', isPasswordValidRegex, isConfirmed]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                  class='cursor-pointer'
                  @click='isPwdConfirm = !isPwdConfirm'
                />
              </template>
            </q-input>
            <div>
              <q-btn label="Resetuj lozinku" type="submit" color="primary"/>
            </div>
          </q-form>
        <q-card-section style="font-style: italic; font-size: 14px">
          <p>Lozinka mora da sadrži barem osam karaktera, jedno velio slovo, broj i jedan specijalni karakter(#,?,!,@,$,%,^,&,,-.)*</p>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import useNotificationMessage from 'src/composables/notificationMessage';
import {useRoute,useRouter} from 'vue-router';
import {useAuthenticatedUserStore} from "stores/authUserStore";


const route = useRoute();
const router = useRouter();
const userStore = useAuthenticatedUserStore();

//PASSWORD INPUT START
const password = ref('');
const passwordConfirmation = ref('');

const isPwd = ref(true);
const isPwdConfirm = ref(true);

function isPasswordValidRegex(val: string) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#.?!@$ %^&*-]).+$/;
  return passwordPattern.test(val) || 'Lozinka mora da sadrži barem jedno veliko slovo, malo slovo, cifru i specijalan karakter (#,?,!,@,$,%,^,&,*,-).';
}

function isConfirmed(val: string) {
  return val === password.value || 'Potvrda lozinke se ne podudara sa unetom lozinkom';
}
//PASSWORD INPUT END
//TAKE PARAMETERS FROM URL
const email = ref(route.query.email?.toString());
const token = ref(route.params.token);
//ON SUBMIT START
async function onSubmit(){

  let resetPasswordRequest = {
    email: email.value as string,
    token: token.value as string,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  }

  const responseMessage = await userStore.resetPassword(resetPasswordRequest);
  await router.replace({
    name: 'login'
  })
}
//ON SUBMIT END
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto
}

</style>
