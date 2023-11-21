<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <q-img src="/images/blank-image.jpg" style="max-height: 150px"></q-img>
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
            <q-btn label='Uloguj se' type='submit' color='primary'/>
            <q-btn label='Zaboravljena lozinka?' type='button' color='primary' flat class='q-ml-sm'
                   @click='forgottenPassword'/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import useNotificationMessage from 'src/composables/notificationMessage';
import {useAuthenticatedUserStore} from "stores/authUserStore";
//comment
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
    email: email.value,
    password: password.value
  }

  const responseMessage = await userStore.login(requestObject);
  useNotificationMessage('success', String(responseMessage));
  await router.replace({
    name: 'home'
  })
}
// ON SUBMIT END
// ON FORGOT PASSWORD START
function forgottenPassword(){
  router.push({
    name: 'forgot-password'
  })
}
// ON FORGOT PASSWORD END
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
.button-container{
  display: flex;
  justify-content: space-between;
}
</style>
