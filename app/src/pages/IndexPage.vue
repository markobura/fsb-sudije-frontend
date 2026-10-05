<template>
  <q-page class="row items-center justify-evenly">
    <div style="display: flex; justify-content: space-evenly; flex-wrap: wrap; width: 100%">
      <q-btn class="bg-primary text-white q-pa-md" style="margin-top: 50px" label="Započni test PFI"
             icon="quiz" rounded @click="openTestPFIPage"/>
      <q-btn class="bg-primary text-white q-pa-md" style="margin-top: 50px" label="Započni video test"
             icon="play_circle" rounded @click="openVideoTestPage"/>
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
<!--            <q-btn size="sm" class="q-ma-sm bg-primary text-white" round icon="image">-->
<!--              <BaseTooltip class="bg-primary" tooltip="Postavljanje fotografije"/>-->
<!--            </q-btn>-->
            <q-btn size="sm" class="q-ma-sm bg-primary text-white" round icon="event_busy" @click="openAvailabilityDialog">
              <BaseTooltip class="bg-primary" tooltip="Nedostupnost"/>
            </q-btn>
            <q-btn size="sm" class="q-ma-sm bg-green-8 text-white" round icon="how_to_reg" @click="openCancellationApplicationDialog">
              <BaseTooltip class="bg-green-8" tooltip="Prijavi se za otkaze"/>
            </q-btn>
            <q-btn size="sm" class="q-ma-sm bg-teal-9 text-white" round icon="download" @click="downloadUnavailabilityExcel"
                   v-if="useAuthenticatedUserStore().getUser.role === 'FSB ADMIN'">
              <BaseTooltip class="bg-teal-9" tooltip="Preuzmi nedostupnosti"/>
            </q-btn>
            <q-btn size="sm" class="q-ma-sm bg-deep-orange-8 text-white" round icon="file_download" @click="downloadCancellationApplicationsExcel"
                   v-if="useAuthenticatedUserStore().getUser.role === 'FSB ADMIN'">
              <BaseTooltip class="bg-deep-orange-8" tooltip="Preuzmi prijave za otkaze"/>
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
    <CancellationApplicationDialog v-model="cancellationApplicationDialogIsVisible" v-if="cancellationApplicationDialogIsVisible"/>
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
import CancellationApplicationDialog from "components/CancellationApplicationDialog.vue";
import {useUserStore} from "stores/userStore";
import useNotificationMessage from "src/composables/notificationMessage";

const authUserStore = useAuthenticatedUserStore();
const router = useRouter();

// Dani kada je prijava otkaza dostupna (0=ned, 1=pon, 2=uto, 3=sre, 4=čet, 5=pet, 6=sub)
const CANCELLATION_APPLICATION_DAYS = [1, 2] // ponedeljak i utorak
const CANCELLATION_DAY_NAMES: Record<number, string> = {
  0: 'nedeljom', 1: 'ponedeljkom', 2: 'utorkom',
  3: 'sredom', 4: 'četvrtkom', 5: 'petkom', 6: 'subotom'
}

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

const cancellationApplicationDialogIsVisible = ref(false);

function openCancellationApplicationDialog(){

  if (!CANCELLATION_APPLICATION_DAYS.includes(new Date().getDay())) {
    const daysList = CANCELLATION_APPLICATION_DAYS.map(d => CANCELLATION_DAY_NAMES[d]).join(' i ')
    useNotificationMessage('error', `Prijava za otkaze je dostupna samo ${daysList}, nakon delegiranja.`)
    return
  }
  cancellationApplicationDialogIsVisible.value = true
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

function openVideoTestPage(){
  router.push({
    name: 'video-test.active',
  });
}

async function downloadUnavailabilityExcel(){
  await useUserStore().downloadUnavailabilityExcel();
}

async function downloadCancellationApplicationsExcel(){
  await useUserStore().downloadCancellationApplicationsExcel();
}
</script>
