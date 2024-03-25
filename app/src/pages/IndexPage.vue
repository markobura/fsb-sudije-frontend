<template>
  <q-page class="row items-center justify-evenly">
    <div style="display: flex; justify-content: space-evenly; flex-wrap: wrap; width: 100%">
      <q-btn class="bg-primary text-white q-pa-md" style="margin-top: 50px" label="Započni test PFI"
             icon="quiz" rounded @click="openTestPFIPage"/>
      <q-btn class="bg-primary text-white q-pa-md" style="margin-top: 50px" label="Započni video test" icon="play_circle" rounded />
    </div>
    <div>
      <q-card style="min-width: 350px" class="bg-blue-grey-1">
        <q-card-section style="display: flex; justify-content: space-between; padding-top: 0; padding-bottom: 0" >
          <q-card-section  class="text-h6 text-primary"> Profil</q-card-section>
          <div style="align-self: center">
            <q-btn size="sm" class="q-ma-sm bg-orange text-white" round icon="edit" @click="toggleUserCreationDialog">
            <BaseTooltip class="bg-orange" tooltip="Ažuriraj podatke"/>
            </q-btn>
            <q-btn size="sm" class="q-ma-sm bg-red text-white" round icon="lock" @click="openChangePasswordDialog">
              <BaseTooltip class="bg-red" tooltip="Promena lozinke"/>
            </q-btn>
            <q-btn size="sm" class="q-ma-sm bg-primary text-white" round icon="image">
              <BaseTooltip class="bg-primary" tooltip="Postavljanje fotografije"/>
            </q-btn>
            <q-btn size="sm" class="q-ma-sm bg-teal-9 text-white" round icon="event_busy" @click="openAvailabilityDialog">
              <BaseTooltip class="bg-teal-9" tooltip="Dostupnost"/>
            </q-btn>
          </div>
        </q-card-section>
        <q-separator inset/>
        <q-card-section style="display: flex; justify-content: space-around">
          <div style="align-self: center">
            <q-avatar size="100px">
              <img src="images/referee.png"/>
            </q-avatar>
          </div>
          <div>
            <p class="text-h6"> {{user.first_name + ' ' + user.last_name}} </p>
<!--            <p > {{useUIFormat(user.date_of_birth.substring(0,10))}} </p>-->
            <p > {{user.league}} </p>
            <p > {{user.referee_type}} </p>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <ChangePasswordDialog v-model="changeDialogIsVisible" v-if="changeDialogIsVisible"/>
    <UserCreateDialog
      v-model="isCreateUserDialogVisible"
      v-if="isCreateUserDialogVisible"
      :mode="'user'"
      :user="user"
    ></UserCreateDialog>
    <AvailabilityDialog v-model="availabilityDialogIsVisible" v-if="availabilityDialogIsVisible"/>
  </q-page>
</template>

<script setup lang="ts">
import {useAuthenticatedUserStore} from "stores/authUserStore";
import {useUIFormat} from "src/utils/dateHook";
import {computed, ref} from "vue";
import ChangePasswordDialog from 'src/components/ChangePasswordDialog.vue'
import UserCreateDialog from 'src/components/UserCreateDialog.vue'
import BaseTooltip from 'src/components/BaseTooltip.vue'
import {useRouter} from "vue-router";
import AvailabilityDialog from "components/AvailabilityDialog.vue";

const authUserStore = useAuthenticatedUserStore();
const router = useRouter();

const user = computed(()=>{
  return authUserStore.getUser;
})


const changeDialogIsVisible = ref(false);

function openChangePasswordDialog(){
  changeDialogIsVisible.value = true;
}

const availabilityDialogIsVisible = ref(false);

function openAvailabilityDialog(){
  availabilityDialogIsVisible.value = true
}

const isCreateUserDialogVisible = ref(false);

function toggleUserCreationDialog() {
  isCreateUserDialogVisible.value = !isCreateUserDialogVisible.value;
}

function openTestPFIPage(){
  router.push({
    name: 'test.pfi',
  });
}

</script>
