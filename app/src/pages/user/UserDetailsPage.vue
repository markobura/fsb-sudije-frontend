<template>
  <q-page padding>
    <q-card>
      <q-card-section class="btn-container">
        <BaseHeader icon="person" :title="`${userDetails.name} ${userDetails.surname}`"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section>
        <BackButton></BackButton>
      </q-card-section>
      <q-card-section>
        <UserForm
          ref="userForm"
          mode="update"
          :user-data="userData"
          @process-user="updateUser"/>
        <q-card-actions align="right">
          <q-btn flat label="Pošalji aktivacioni e-mail" icon="send" color="blue-5"
                 @click="resendActivationEmail"></q-btn>
          <q-btn flat :label="accountStateButton.label" :icon="accountStateButton.icon"
                 :color="accountStateButton.color" @click="setAccountState">
            <BaseTooltip :tooltip="accountStateButton.tooltip"/>
          </q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import {useUserStore} from 'stores/userStore';
import {computed, reactive} from 'vue';
import BaseHeader from "components/BaseHeader.vue";
import BackButton from 'components/BaseBackButton.vue'

import {useAuthenticatedUserStore} from "stores/authUserStore";
import BaseTooltip from "components/BaseTooltip.vue";
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
import UserForm, {UserData} from "components/UserForm.vue";

const $q = useQuasar();
const route = useRoute();
const userId = +route.params.id;
const userStore = useUserStore();
const authUserStore = useAuthenticatedUserStore();

const userDetails = computed(function () {
  return userStore.getUserDetails
});

const userData = reactive({
  name: userDetails.value.name,
  surname: userDetails.value.surname,
  email: userDetails.value.email
});

const accountStateButton = computed(function () {
  return userStore.getUserDetails.is_active ?
    {
      label: 'Deaktiviraj nalog',
      color: 'negative',
      icon: 'highlight_off',
      tooltip: 'Ova akcija deaktivira korisnički nalog i korisnik više neće imati pravo pristupa sistemu!'
    } :
    {
      label: 'Aktiviraj nalog',
      color: 'positive',
      icon: 'check_circle_outline',
      tooltip: 'Ova akcija aktivira korisnički nalog i korisnik će ponovo imati pravo pristupa sistemu!'

    }
})


const updateUser = async (userData: UserData) => {
  await userStore.updateUser(userId, userData)
}

const setAccountState = async () => {
  $q.dialog({
    title: accountStateButton.value.label,
    message: accountStateButton.value.tooltip,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await userStore.setAccountState(userId)
  })
}

const resendActivationEmail = async () => {
  await userStore.sendActivationEmail(userId)
}

</script>
<style scoped>

</style>
