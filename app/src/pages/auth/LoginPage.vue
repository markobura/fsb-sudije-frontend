<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section style="display: flex; justify-content: center; flex-direction: column"
        class="text-center no-margin"
      >
        <q-img style="width: 80px; height: 100px; margin: 0 auto" src="/images/logo.png"></q-img>
        <h6 style="margin: 20px 0" class="text-primary">Portal za sudije</h6>
        <h5 style="margin: 10px 0; font-weight: bold;" class="text-primary" >Fudbalski savez Beograda</h5>
        <q-separator color="white"/>
      </q-card-section>
      <q-card-section>
        <q-form
          class="q-gutter-md"
          @submit="onSubmit"
        >
          <q-input
            filled
            v-model.trim="email"
            hint='Unesite Vaš e-mail'
            label="Email"
            lazy-rules
            :rules="emailRules"
          />
          <q-input
            filled
            label='Lozinka'
            hint='Unesite Vašu loziniku'
            color='black'
            :type="isPwd ? 'password' : 'text'"
            v-model.trim="password"
            :rules="passwordRules"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class='cursor-pointer'
                @click='isPwd = !isPwd'
              />
            </template>
          </q-input>
          <div class="button-container">
            <q-btn class="full-width" style="margin: 20px" label='Prijavi se' type='submit' color='primary'/>
<!--            <q-btn label='Zaboravljena lozinka?' type='button' color='primary' flat class='q-ml-sm'-->
<!--                   @click='forgottenPassword'/>-->
          </div>
        </q-form>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthenticatedUserStore} from "stores/authUserStore";
import useRedirect from "src/composables/redirect";

const router = useRouter();
const userStore = useAuthenticatedUserStore();

// EMAIL INPUT START
const email = ref('');

const emailRules = [(val:string) => (val != null && val.length > 0) || 'Molimo unesite email.', isValidEmail];

function isValidEmail (val:string) {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Molimo unesite email u ispravnom formatu.'
}
// EMAIL INPUT END
// PASSWORD INPUT START
const password = ref('');

const isPwd = ref(true);

const passwordRules = [(val:string) => (val != null && val.length > 0) || 'Molimo unesite lozinku.']
// PASSWORD INPUT END
// ON SUBMIT START
async function onSubmit(){

  let requestObject = {
    username: email.value,
    password: password.value
  }

   await userStore.login(requestObject);
  useRedirect(router,'home','replace');
}

</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
/*.button-container{*/
/*  display: flex;*/
/*  justify-content: space-between;*/
/*}*/
</style>
