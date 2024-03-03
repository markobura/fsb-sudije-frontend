<template>
  <q-dialog persistent ref="dialogRef">
    <q-card>
      <q-card-section class="bg-primary text-white text-h5">
        <q-item style="display: flex; justify-content: space-between">
          <q-item-label>
            {{props.user.first_name + ' ' + props.user.last_name}}
          </q-item-label>
          <q-btn style="margin-left: 50px" flat round dense icon="close" v-close-popup color="white"/>
        </q-item>
      </q-card-section>
      <q-card-section>
        <q-form @submit='onSubmit'>

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

          <q-btn label="Promeni lozinku" type="submit" color="primary"  style="width: 100%; margin-top: 15px"/>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import BaseInput from 'components/BaseInput.vue'
import {useUserStore} from "stores/userStore";
import {User} from "src/interfaces/user";

const props = defineProps<{
  user: User,
}>();


const userStore = useUserStore();

const dialogRef = ref();
const password = ref('');
const isPwd = ref(true);
const passwordInputType = computed(function (){
  return isPwd.value ? 'password' : 'text';
});


async function onSubmit(){

  let resetPasswordRequest = {
    user_id: props.user.id,
    new_password: password.value,
  }


  await userStore.changePassword(resetPasswordRequest);

  password.value = '';
  dialogRef.value.hide();
}

</script>

<style scoped>

</style>
