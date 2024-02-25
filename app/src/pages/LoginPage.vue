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
            v-model.trim="loginForm.email"
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
            v-model.trim="loginForm.password"
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
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthenticatedUserStore} from "stores/authUserStore";
import {Validator} from "quasar-easy-validate";

const router = useRouter();
const userStore = useAuthenticatedUserStore();

const loginForm = reactive({
  email: '',
  password: ''
});

const emailRules = [(email: string) => (new Validator(email)
  .required('E-mail je obavezan')
  .stringMin(3, 'E-mail može imati minimalno 3 karaktera')
  .stringMax(255, 'E-mail može imati maksimalno 255 karaktera')
  .email('Email nije validan')
  .validate())
];

const isPwd = ref(true);

const passwordRules = [(password: string) => (new Validator(password)
  .required('Lozinka je obavezna')
  .validate())
]

async function onSubmit(){
  await userStore.login(loginForm);
  await router.replace({
    name: 'home'
  })
}

function forgottenPassword(){
  router.push({
    name: 'forgot-password'
  })
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
