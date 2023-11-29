<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader title="Podešavanja sesije" icon="timer"/>
      </q-card-section>
      <q-separator inset/>

      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Unesite vreme trajanja sesije:</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-input
                v-model.number="time"
                type="number"
                filled
                suffix="min"
                input-class="text-right"
                :rules="timeRules"
                lazy-rules
                hint="Unesite broj izražen u minutima."
              />
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat
                   size="xl"
                   color="primary"
                   round
                   icon="save" @click="updateSessionTimeOut" />
            <BaseTooltip tooltip="Sačuvaj"/>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useSettingsStore} from "stores/settingsStore";
import useNotificationMessage from "src/composables/notificationMessage";
import ColorPickerDialog from 'components/dialogs/ColorPickerDialog.vue';
import BaseHeader from "components/BaseHeader.vue";
import BaseTooltip from "components/BaseTooltip.vue";
import {Validator} from "quasar-easy-validate";

const settingsStore = useSettingsStore();

const time = ref(settingsStore.getSessionTimeout);
const timeRules = [(time: number) => new Validator(time)
  .numeric('Morate uneti brojčanu vrednosti')
  .wholeNumber('Unos mora biti ceo broj')
  .numericMin(30, 'Sesija mora trajati barem 30 minuta')
  .numericMax(180, 'Sesije može trajati maksimalno 3 sata (180 minuta)')
  .validate()]


async function updateSessionTimeOut(){
    const responseMessage = await settingsStore.updateUserSessionTimeoutApi(time.value);
}
//TIMEOUT END


</script>

