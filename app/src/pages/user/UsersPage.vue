<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="group" title="Pregled korisnika"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section>
        <q-table :rows="users" :columns="columns" row-key="name" :filter="filterTable">
          <template v-slot:top-left>
            <q-btn
              round
              color="green-7"
              icon="person_add"
              @click="toggleUserCreationDialog('create')"
            >
              <BaseTooltip class="bg-green-7"
                tooltip="Dodaj novog korisnika"
              />

            </q-btn>
          </template>
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              placeholder="Pretraga"
              v-model="filterTable"
            >
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-primary text-white">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                <span>{{props.row.first_name + ' ' + props.row.last_name}}</span>
              </q-td>
              <q-td key="email" :props="props">
                <span>{{props.row.email}}</span>
              </q-td>
              <q-td key="league" :props="props">
                <span>{{props.row.league}}</span>
              </q-td>
              <q-td key="referee_type" :props="props">
                <span>{{props.row.referee_type}}</span>
              </q-td>
              <q-td key="active" :props="props">
                <q-badge outline :color="props.row.active ? 'green-9' : 'red'"
                         :label="props.row.active ? 'AKTIVAN' : 'NEAKTIVAN'"/>
              </q-td>
              <q-td key="details" :props="props"  class="text-center">
                <q-btn
                  type="button"
                  flat
                  @click="toggleUserCreationDialog('update', props.row)"
                >
                  <q-icon
                    name="manage_search"
                    color="teal-9"
                  />
                  <BaseTooltip class="bg-teal-9"
                               tooltip="Detalji korisnika"
                  />
                </q-btn>
              </q-td>
              <q-td key="password" :props="props"  class="text-center">
                <q-btn
                  type="button"
                  flat
                  @click="changePassword(props.row)"
                >
                  <q-icon
                    name="lock"
                    color="orange-8"
                  />
                  <BaseTooltip class="bg-orange-8"
                               tooltip="Promena lozinke"
                  />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props"  class="text-center">
                <q-btn
                  round
                  type="button"
                  flat
                  @click="deleteUser(props.row.id)"
                >
                  <q-icon
                    name="delete"
                    color="red"
                  />
                  <BaseTooltip class="bg-red"
                               tooltip="Obriši korisnika"
                  />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <UserCreateDialog
      v-model="isCreateUserDialogVisible"
      v-if="isCreateUserDialogVisible"
      :mode="userCreationDialogMode"
      :user="userUpdate"
    ></UserCreateDialog>
    <ChangePasswordAdminDialog
      v-model="changePasswordDialogIsVisible"
      v-if="changePasswordDialogIsVisible"
      :user="userUpdate"
    />
  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useUserStore} from "stores/userStore";
import {useRouter} from "vue-router";
import BaseHeader from "components/BaseHeader.vue";
import useUserTableColumns from "src/columns/userTableColumns";
import BaseTooltip from "components/BaseTooltip.vue";
import { defineAsyncComponent } from 'vue'
import ChangePasswordAdminDialog from "components/ChangePasswordAdminDialog.vue";
import {User} from "src/interfaces/user";
import {useQuasar} from "quasar";
const UserCreateDialog = defineAsyncComponent(() => import('components/UserCreateDialog.vue'))

const $q = useQuasar();

const userStore = useUserStore();
const router = useRouter();
const users = computed(function () {
  return userStore.getUsers;
})

const filterTable = ref('');


const columns = useUserTableColumns()


const fetchUsers = async () => {
  await userStore.getUserList();
}
fetchUsers();

const isCreateUserDialogVisible = ref(false);
const userCreationDialogMode = ref('create');
const userUpdate = ref()
function toggleUserCreationDialog(mode: 'create'|'update', user?: User) {
  isCreateUserDialogVisible.value = !isCreateUserDialogVisible.value;
  userCreationDialogMode.value = mode
  userUpdate.value = user
}

const changePasswordDialogIsVisible = ref(false);

function changePassword(user: User){
  changePasswordDialogIsVisible.value = true;
  userUpdate.value = user
}

// function showUserDetails(id: number) {
//   router.push({
//     name: 'users.show',
//     params: {id}
//   });
// }

function deleteUser(id: string){
  $q.dialog({
    title: 'Brisanje korisnika',
    message: 'Ukoliko obrišete ovog korisnika, on će trajno biti izbrisan iz sistema.',
    persistent: true,
    ok: {
      push: true,
      color: 'negative'
    },
    cancel: true
  }).onOk(async () => {
    await userStore.deleteUser(id);
  })
}


</script>
