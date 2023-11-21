<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="logo image" @click="backToHome" style="cursor: pointer">
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer"/>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          switch-toggle-side
          expand-separator
          icon="perm_identity"
          label="Administracija"
        >

          <q-list class="text-primary">
            <q-item
              clickable
              v-ripple
              :active="link === 'users'"
              :to="{name: 'users.index'}"
              @click="link = 'users'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="account_circle"/>
              </q-item-section>

              <q-item-section>Korisnici</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active="link === 'logs'"
              :to="{name: 'app.logs'}"
              @click="link = 'logs'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="folder"/>
              </q-item-section>

              <q-item-section>Logovi</q-item-section>
            </q-item>

          </q-list>

        </q-expansion-item>

        <q-expansion-item
          switch-toggle-side
          expand-separator
          icon="settings"
          label="Podešavanja"
        >
          <q-list class="text-primary">
            <q-item
              clickable
              v-ripple
              :active="link === 'sessionTimeout'"
              @click="link = 'sessionTimeout'"
              :to="{name: 'settings.session-timeout'}"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="lock_clock"/>
              </q-item-section>

              <q-item-section>Sesija</q-item-section>
            </q-item>

          </q-list>
        </q-expansion-item>

      </q-list>

    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>

      <q-item>
        <q-item-section side>
          <q-avatar rounded size="48px">
            <img src="https://cdn.quasar.dev/img/avatar.png"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Uroš Minić</q-item-label>
          <q-badge color="green" label="online"/>
        </q-item-section>
        <q-item-section side>
          <q-btn flat icon="logout" @click="logout"></q-btn>
        </q-item-section>

      </q-item>

      <q-tabs
        v-model="tab"
        dense
        align="justify"
        class="bg-primary text-white shadow-2 q-pa-sm"
        :breakpoint="0"
      >
        <q-tab name="light" icon="wb_sunny"/>
        <q-tab name="dark" icon="bedtime"/>
      </q-tabs>

<!--      <q-toolbar class="bg-primary text-white shadow-2">-->
<!--        <q-toolbar-title>Contacts</q-toolbar-title>-->
<!--      </q-toolbar>-->

<!--      <q-list bordered>-->
<!--        <q-item v-for="contact in contacts" :key="contact.id" class="q-my-sm" clickable v-ripple>-->
<!--          <q-item-section avatar>-->
<!--            <q-avatar color="primary" text-color="white">-->
<!--              {{ contact.letter }}-->
<!--            </q-avatar>-->
<!--          </q-item-section>-->

<!--          <q-item-section>-->
<!--            <q-item-label>{{ contact.name }}</q-item-label>-->
<!--            <q-item-label caption lines="1">{{ contact.email }}</q-item-label>-->
<!--          </q-item-section>-->

<!--          <q-item-section side>-->
<!--            <q-icon name="chat_bubble" color="green"/>-->
<!--          </q-item-section>-->
<!--        </q-item>-->

<!--        <q-separator/>-->
<!--        <q-item-label header>Offline</q-item-label>-->

<!--        <q-item v-for="contact in offline" :key="contact.id" class="q-mb-sm" clickable v-ripple-->
<!--                @click="seamless = !seamless">-->
<!--          <q-item-section avatar>-->
<!--            <q-avatar>-->
<!--              <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`">-->
<!--            </q-avatar>-->
<!--          </q-item-section>-->

<!--          <q-item-section>-->
<!--            <q-item-label>{{ contact.name }}</q-item-label>-->
<!--            <q-item-label caption lines="1">{{ contact.email }}</q-item-label>-->
<!--          </q-item-section>-->

<!--          <q-item-section side>-->
<!--            <q-icon name="chat_bubble" color="grey"/>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--      </q-list>-->
    </q-drawer>
<!--    <q-dialog v-model="seamless" seamless position="right" full-height>-->
<!--      <q-card style="width: 375px">-->
<!--        <q-item class="q-mb-sm" clickable v-ripple @click="seamless = !seamless">-->
<!--          <q-item-section avatar>-->
<!--            <q-avatar>-->
<!--              <img :src="`https://cdn.quasar.dev/img/avatar.png`">-->
<!--            </q-avatar>-->
<!--          </q-item-section>-->

<!--          <q-item-section>-->
<!--            <q-item-label>Kontakt</q-item-label>-->
<!--            <q-item-label caption lines="1">Kontaktović</q-item-label>-->

<!--          </q-item-section>-->

<!--          <q-item-section side>-->
<!--            <q-icon name="chat_bubble" color="green"/>-->
<!--          </q-item-section>-->

<!--        </q-item>-->
<!--        <q-separator/>-->

<!--        <q-card-section>-->
<!--          <q-scroll-area style="height: 600px; max-width: 370px;">-->
<!--            <q-chat-message-->
<!--              :text="['Šta radiš?']"-->
<!--              sent-->
<!--              text-color="white"-->
<!--              bg-color="primary"-->
<!--            >-->
<!--              <template v-slot:name>me</template>-->
<!--              <template v-slot:stamp>7 minutes ago</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;sent"-->
<!--                  src="https://cdn.quasar.dev/img/avatar4.jpg"-->
<!--                >-->
<!--              </template>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              bg-color="amber"-->
<!--            >-->
<!--              <template v-slot:name>Mary</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;received"-->
<!--                  src="https://cdn.quasar.dev/img/avatar2.jpg"-->
<!--                >-->
<!--              </template>-->
<!--              <q-img style="max-height: 300px; max-width: 300px; height: 300px; width: 250px"-->
<!--                     src="https://www.searchenginejournal.com/wp-content/uploads/2022/06/image-search-1600-x-840-px-62c6dc4ff1eee-sej-1280x720.png"-->
<!--                     class="my-emoji"/>-->
<!--              &lt;!&ndash;              <q-spinner-dots size="2rem" />&ndash;&gt;-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              :text="['Gledaš slike prirode?']"-->
<!--              sent-->
<!--              text-color="white"-->
<!--              bg-color="primary"-->
<!--            >-->
<!--              <template v-slot:name>me</template>-->
<!--              <template v-slot:stamp>7 minutes ago</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;sent"-->
<!--                  src="https://cdn.quasar.dev/img/avatar4.jpg"-->
<!--                >-->
<!--              </template>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              bg-color="amber"-->
<!--            >-->
<!--              <template v-slot:name>Mary</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;received"-->
<!--                  src="https://cdn.quasar.dev/img/avatar2.jpg"-->
<!--                >-->
<!--              </template>-->
<!--              <q-spinner-dots size="2rem"/>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              :text="['Šta radiš?']"-->
<!--              sent-->
<!--              text-color="white"-->
<!--              bg-color="primary"-->
<!--            >-->
<!--              <template v-slot:name>me</template>-->
<!--              <template v-slot:stamp>7 minutes ago</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;sent"-->
<!--                  src="https://cdn.quasar.dev/img/avatar4.jpg"-->
<!--                >-->
<!--              </template>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              bg-color="amber"-->
<!--            >-->
<!--              <template v-slot:name>Mary</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;received"-->
<!--                  src="https://cdn.quasar.dev/img/avatar2.jpg"-->
<!--                >-->
<!--              </template>-->
<!--              <q-img style="max-height: 300px; max-width: 300px; height: 300px; width: 250px"-->
<!--                     src="https://www.searchenginejournal.com/wp-content/uploads/2022/06/image-search-1600-x-840-px-62c6dc4ff1eee-sej-1280x720.png"-->
<!--                     class="my-emoji"/>-->
<!--              &lt;!&ndash;              <q-spinner-dots size="2rem" />&ndash;&gt;-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              :text="['Gledaš slike prirode?']"-->
<!--              sent-->
<!--              text-color="white"-->
<!--              bg-color="primary"-->
<!--            >-->
<!--              <template v-slot:name>me</template>-->
<!--              <template v-slot:stamp>7 minutes ago</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;sent"-->
<!--                  src="https://cdn.quasar.dev/img/avatar4.jpg"-->
<!--                >-->
<!--              </template>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              bg-color="amber"-->
<!--            >-->
<!--              <template v-slot:name>Mary</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;received"-->
<!--                  src="https://cdn.quasar.dev/img/avatar2.jpg"-->
<!--                >-->
<!--              </template>-->
<!--              <q-spinner-dots size="2rem"/>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              :text="['Šta radiš?']"-->
<!--              sent-->
<!--              text-color="white"-->
<!--              bg-color="primary"-->
<!--            >-->
<!--              <template v-slot:name>me</template>-->
<!--              <template v-slot:stamp>7 minutes ago</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;sent"-->
<!--                  src="https://cdn.quasar.dev/img/avatar4.jpg"-->
<!--                >-->
<!--              </template>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              bg-color="amber"-->
<!--            >-->
<!--              <template v-slot:name>Mary</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;received"-->
<!--                  src="https://cdn.quasar.dev/img/avatar2.jpg"-->
<!--                >-->
<!--              </template>-->
<!--              <q-img style="max-height: 300px; max-width: 300px; height: 300px; width: 250px"-->
<!--                     src="https://www.searchenginejournal.com/wp-content/uploads/2022/06/image-search-1600-x-840-px-62c6dc4ff1eee-sej-1280x720.png"-->
<!--                     class="my-emoji"/>-->
<!--              &lt;!&ndash;              <q-spinner-dots size="2rem" />&ndash;&gt;-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              :text="['Gledaš slike prirode?']"-->
<!--              sent-->
<!--              text-color="white"-->
<!--              bg-color="primary"-->
<!--            >-->
<!--              <template v-slot:name>me</template>-->
<!--              <template v-slot:stamp>7 minutes ago</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;sent"-->
<!--                  src="https://cdn.quasar.dev/img/avatar4.jpg"-->
<!--                >-->
<!--              </template>-->
<!--            </q-chat-message>-->

<!--            <q-chat-message-->
<!--              bg-color="amber"-->
<!--            >-->
<!--              <template v-slot:name>Mary</template>-->
<!--              <template v-slot:avatar>-->
<!--                <img-->
<!--                  class="q-message-avatar q-message-avatar&#45;&#45;received"-->
<!--                  src="https://cdn.quasar.dev/img/avatar2.jpg"-->
<!--                >-->
<!--              </template>-->
<!--              <q-spinner-dots size="2rem"/>-->
<!--            </q-chat-message>-->

<!--          </q-scroll-area>-->

<!--        </q-card-section>-->
<!--        <q-card-section class="q-mt-xl">-->
<!--          <q-input outlined autofocus autogrow/>-->
<!--        </q-card-section>-->
<!--      </q-card>-->


<!--    </q-dialog>-->


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
import {ref, watch} from 'vue'
import {useQuasar} from "quasar";
import {useAuthenticatedUserStore} from "stores/authUserStore";
import {useRouter} from "vue-router";

const authUserStore = useAuthenticatedUserStore();
const router = useRouter();
const logout = async() => {
  await authUserStore.logout();
  await router.replace({
    name: 'login'
  })

}
const $q = useQuasar();

const link = ref('');
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)


const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const tab = ref('light')

watch(tab, (value, oldValue, onCleanup) => {
  if (value === 'light') {
    setDarkMode(false);
  } else {
    setDarkMode(true);

  }
})

function setDarkMode(isDarkMode: boolean) {
  $q.dark.set(isDarkMode);
}


const contacts = [{
  id: 1,
  name: 'Ruddy Jedrzej',
  email: 'rjedrzej0@discuz.net',
  letter: 'R'
}, {
  id: 2,
  name: 'Mallorie Alessandrini',
  email: 'malessandrini1@marketwatch.com',
  letter: 'M'
}, {
  id: 3,
  name: 'Elisabetta Wicklen',
  email: 'ewicklen2@microsoft.com',
  letter: 'E'
}, {
  id: 4,
  name: 'Seka Fawdrey',
  email: 'sfawdrey3@wired.com',
  letter: 'S'
}]

const offline = [{
  id: 5,
  name: 'Brunhilde Panswick',
  email: 'bpanswick4@csmonitor.com',
  avatar: 'avatar2.jpg'
}, {
  id: 6,
  name: 'Winfield Stapforth',
  email: 'wstapforth5@pcworld.com',
  avatar: 'avatar6.jpg'
}]

const seamless = ref(true);

const backToHome =() => {
  router.push({
    name: 'home'
  })
}
</script>
