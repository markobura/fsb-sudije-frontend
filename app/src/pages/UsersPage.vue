<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="group" title="Pregled korisnika"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section class="row">
        <q-select
          class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12"
          filled
          color="primary"
          label="Status naloga"
          v-model="accountState"
          :options="accountStateOptions"
          option-value="id"
          option-label="name"
          @update:model-value="fetchUsers"
        />
      </q-card-section>
      <q-card-section>
        <q-table :rows="users" :columns="columns" row-key="name" :filter="filterTable">
          <template v-slot:top-left>
            <q-btn
              round
              color="primary"
              icon="person_add"
              @click="toggleUserCreationDialog"
            >
              <BaseTooltip
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
          <template v-slot:body-cell-details="props">
            <q-td :props="props">
              <q-btn
                type="button"
                flat
                @click="showUserDetails(props.row.id)"
              >
                <q-icon
                  name="manage_search"
                  color="primary"
                />
                <BaseTooltip
                tooltip="Detalji korisnika"
                />
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <UserCreateDialog
      v-model="isCreateUserDialogVisible"
      v-if="isCreateUserDialogVisible"
    ></UserCreateDialog>
  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useUserStore} from "stores/userStore";
import {useRouter} from "vue-router";
import BaseHeader from "components/BaseHeader.vue";
import {AccountState} from "src/interfaces/user";
import useUserTableColumns from "src/columns/userTableColumns";
import BaseTooltip from "components/BaseTooltip.vue";
import { defineAsyncComponent } from 'vue'
const UserCreateDialog = defineAsyncComponent(() => import('components/UserCreateDialog.vue'))

const userStore = useUserStore();
const router = useRouter();
const users = computed(function () {
  return userStore.getUsers;
})

const filterTable = ref('');


const columns = useUserTableColumns()

const accountStateOptions = [
  {id: AccountState.ALL, name: 'SVI'},
  {id: AccountState.ACTIVE, name: 'AKTIVAN'},
  {id: AccountState.INACTIVE, name: 'NEAKTIVAN'},
];
const accountState = ref(accountStateOptions[0]);

const fetchUsers = async () => {
  await userStore.getUserList(accountState.value.id);
}

const isCreateUserDialogVisible = ref(false);

function toggleUserCreationDialog() {
  isCreateUserDialogVisible.value = !isCreateUserDialogVisible.value;
}

function showUserDetails(id: number) {
  router.push({
    name: 'users.show',
    params: {id}
  });
}

</script>
