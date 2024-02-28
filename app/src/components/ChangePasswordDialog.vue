<template>
<q-dialog persistent ref="dialogRef">
  <q-card>
  <q-card-section class="bg-primary text-white text-h5">
    <q-item style="display: flex; justify-content: space-between">
      <q-item-label>
        Promena lozinke
      </q-item-label>
      <q-btn style="margin-left: 50px" flat round dense icon="close" v-close-popup color="white"/>
    </q-item>
  </q-card-section>
    <q-card-section>
      <q-form @submit='onSubmit'>
        <BaseInput
          v-model.trim='oldPassword'
          label='Stara lozinka'
          hint='Unesite staru lozinku'
          :password-input="true"
          :rules="[ val => val && val.length >= 8 || 'Ovo polje je obavezno i mora imati najmanje 8 karaktera!']"
          :type="oldPasswordInputType"
          @toggle-password="isPwdOld = !isPwdOld"
          style="margin-bottom: 15px"
        />
        <BaseInput
          v-model.trim='password'
          label='Nova lozinka'
          hint='Unesite novu lozinku'
          :password-input="true"
          :rules="[ val => val && val.length >= 8 || 'Ovo polje je obavezno i mora imati najmanje 8 karaktera!']"
          :type="passwordInputType"
          @toggle-password="isPwd = !isPwd"
          style="margin-bottom: 30px"
        />
        <BaseInput
          v-model.trim='passwordConfirmation'
          label='Potvrda nove lozinke'
          hint='Potvrdite unetu lozinku'
          :password-input="true"
          :rules="[ val => val && val.length >= 8 || 'Ovo polje je obavezno i mora imati najmanje 8 karaktera!', isConfirmed]"
          :type="passwordInputTypeConfirm"
          @toggle-password="isPwdConfirm = !isPwdConfirm"
          style="margin-bottom: 30px"

        />
        <q-btn label="Promeni lozinku" type="submit" color="primary"  style="width: 100%; margin-top: 15px"/>
      </q-form>
    </q-card-section>
  </q-card>
</q-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import {useAuthenticatedUserStore} from 'stores/authUserStore';
import BaseInput from 'components/BaseInput.vue'
import useNotificationMessage from "src/composables/notificationMessage";



const authUserStore = useAuthenticatedUserStore();

const dialogRef = ref();

//PASSWORD INPUT START
const oldPassword = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const isPwdOld = ref(true);
const isPwd = ref(true);
const isPwdConfirm = ref(true);

const oldPasswordInputType = computed(function (){
  return isPwdOld.value ? 'password' : 'text';
});

const passwordInputType = computed(function (){
  return isPwd.value ? 'password' : 'text';
});

const passwordInputTypeConfirm = computed(function (){
  return isPwdConfirm.value ? 'password' : 'text';
});


function isConfirmed(val: string) {
  return val === password.value || 'Potvrda lozinke se ne podudara sa unetom lozinkom';
}

async function onSubmit(){

  let resetPasswordRequest = {
    old_password: oldPassword.value,
    new_password: password.value,
  }

  if(password.value !== passwordConfirmation.value){
    useNotificationMessage('error','Lozinke se moraju podudarati!');
    return;
  }

 await authUserStore.changePassword(resetPasswordRequest);

  oldPassword.value = ''
  password.value = '';
  passwordConfirmation.value = '';

  dialogRef.value.hide();
}
</script>
