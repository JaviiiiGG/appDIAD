<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Qualificacions App
        </q-toolbar-title>

        <div>{{ datacompleta }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Login',
    caption: 'login.dev',
    icon: 'login',
    link: '#/Login'
  },
  {
    title: 'About',
    caption: 'about.dev',
    icon: 'info',
    link: '#/About'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    datacompleta () {
      const todaysDate = new Date()
      var day
      var month
      switch (todaysDate.getDay()) {
        case 1:
          day = 'Dilluns'
          break
        case 2:
          day = 'Dimarts'
          break
        case 3:
          day = 'Dimecres'
          break
        case 4:
          day = 'Dijous'
          break
        case 5:
          // day = todaysDate.toDateString()
          day = 'Divendres'
          break
        case 6:
          day = 'Dissabte'
          break
        case 0:
          day = 'Diumenge'
          break
      }
      switch (todaysDate.getMonth()) {
        case 0:
          month = 'Gener'
          break
        case 1:
          month = 'Febrer'
          break
        case 2:
          month = 'Març'
          break
        case 3:
          month = 'Abril'
          break
        case 4:
          month = 'Maig'
          break
        case 5:
          month = 'Juny'
          break
        case 6:
          month = 'Juliol'
          break
        case 7:
          month = 'Agost'
          break
        case 8:
          month = 'Setembre'
          break
        case 9:
          month = 'Octubre'
          break
        case 10:
          month = 'Nobembre'
          break
        case 11:
          month = 'Desembre'
          break
      }
      return {
        date: [day, month]
      }
    }
  }
}
</script>
