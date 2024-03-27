<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class='header bg-primary'>
      <q-toolbar>
        <q-btn  v-if="useAuthenticatedUserStore().getUser.role === 'FSB ADMIN'"
          dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img style="cursor:pointer" src="/images/logo.png"  @click="backToHome">
          </q-avatar>
        </q-toolbar-title>
        <q-btn
          style=" margin: 10px"
          flat
          label="Odjavi se"
          icon="logout"
          @click="logout"
        />
      </q-toolbar>

    </q-header>

    <q-drawer
      v-if="useAuthenticatedUserStore().getUser.role === 'FSB ADMIN'"
      show-if-above v-model="leftDrawerOpen" side="left" bordered >

          <q-list
            bordered class="rounded-borders text-primary">
            <q-item
              clickable
              v-ripple
              :active="link === 'users'"
              :to="{name: 'users.index'}"
              @click="link = 'users'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="group"/>
              </q-item-section>
              <q-item-section>
                <q-item-label> Korisnici </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active="link === 'create-test'"
              :to="{name: 'test.create'}"
              @click="link = 'create-test'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="quiz"/>
              </q-item-section>
              <q-item-section>
                <q-item-label> Test PFI </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active="link === 'tests-overview'"
              :to="{name: 'tests.overview'}"
              @click="link = 'tests-overview'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="list"/>
              </q-item-section>
              <q-item-section>
                <q-item-label> Pregled testova PFI </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active="link === 'video-test'"
              :to="{name: 'video-test.overview'}"
              @click="link = 'video-test'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="play_circle"/>
              </q-item-section>
              <q-item-section>
                <q-item-label> Video test </q-item-label>
              </q-item-section>
            </q-item>
<!--            <q-item-->
<!--              clickable-->
<!--              v-ripple-->
<!--              :active="link === 'availability'"-->
<!--              :to="{name: 'availability.index'}"-->
<!--              @click="link = 'availability'"-->
<!--              active-class="my-menu-link"-->
<!--            >-->
<!--              <q-item-section avatar>-->
<!--                <q-icon name="event_busy"/>-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label> Pregled nedostupnosti </q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
          </q-list>

<!--            <q-btn-->
<!--              style="width: 90%; margin: 10px auto"-->
<!--              outline-->
<!--              rounded-->
<!--              class="absolute-bottom"-->
<!--              color="red"-->
<!--              label="Odjavi se"-->
<!--              icon="logout"-->
<!--              @click="logout"-->
<!--            />-->

    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition name="route" mode="out-in">
          <component :is="Component" :key="route.path"/>
        </transition>
      </router-view>
    </q-page-container>


  </q-layout>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref} from 'vue'
import { useQuasar} from "quasar";
import {useAuthenticatedUserStore} from "stores/authUserStore";
import {useRouter} from "vue-router";
import {User} from "src/interfaces/user";

const authUserStore = useAuthenticatedUserStore();
const router = useRouter();


const authenticatedUser: ComputedRef<User> = computed(function (){
  return authUserStore.getUser
})
const logout = async() => {
  await authUserStore.logout();
  await router.replace({
    name: 'login'
  })

}
const $q = useQuasar();

const link = ref('');
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}


const backToHome = () => {
  router.push({
    name: 'home'
  })
}


</script>
