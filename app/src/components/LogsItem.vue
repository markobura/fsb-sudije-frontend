<script setup lang="ts">
import VueJsonPretty from "vue-json-pretty";
import {ref} from "vue";

const props = defineProps(['logDetail']);
const requestDataShown = ref(false);

const setRequestDataState = () => {
  requestDataShown.value = !requestDataShown.value
}
</script>

<template>
  <q-expansion-item
    :key="logDetail"
    group="somegroup"
    icon="explore"
    :label="logDetail.request_timestamp"
    header-class="text-primary"
    @update:model-value="setRequestDataState"

  >
    <q-list dense bordered padding class="rounded-borders" v-if="requestDataShown">
      <q-item>
        <q-item-section>
          <q-item-label overline>REQUEST: {{ logDetail.request_timestamp }}</q-item-label>
          <q-item-label>
            <VueJsonPretty :data="logDetail.request" :showIcon="true" :showLength="true" :showLine="true" :showDoubleQuotes="true" :showKeyValueSpace="true"
                           :collapsedOnClickBrackets="true"/>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator inset/>
      <q-item>
        <q-item-section>
          <q-item-label overline>RESPONSE: {{ logDetail.response_timestamp }}</q-item-label>
          <q-item-label>
            <VueJsonPretty :data="logDetail.response" :showIcon="true" :showLength="true" :showLine="true" :showDoubleQuotes="true" :showKeyValueSpace="true"
                           :collapsedOnClickBrackets="true"/>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>

</template>

<style scoped>

</style>
