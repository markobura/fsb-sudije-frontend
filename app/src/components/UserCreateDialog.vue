<template>
  <q-dialog persistent ref="userCreationDialog">
    <q-card class="no-padding my-card">
      <q-card-section class="bg-primary text-white my-header">
        <BaseHeader icon="person_add" title="Kreiranje novog korisnika"></BaseHeader>
        <q-btn v-close-popup icon="close" color="white" flat rounded></q-btn>
      </q-card-section>
      <q-card-section>
        <UserForm
          ref="userForm"
          mode="create"
          @process-user="storeUser"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useUserStore} from "stores/userStore";
import BaseHeader from "components/BaseHeader.vue";
import UserForm, {UserData} from "components/UserForm.vue";


const userStore = useUserStore();
const userCreationDialog = ref();
const userForm = ref()


async function storeUser(userData: UserData) {
  await userStore.storeNewUser(userData)

  userForm.value.resetForm()
  userCreationDialog.value.hide();

}

</script>
<style scoped>
.my-header {
  display: flex;
  justify-content: space-between;
}
</style>
