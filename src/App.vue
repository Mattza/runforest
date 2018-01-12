<template>
  <div id="app">
    <v-app light>
      <v-navigation-drawer fixed clipped v-model="drawer" app>
        <v-list dense>
          <v-subheader>
            Löpning
          </v-subheader>
          <v-list-tile @click="goto('track')">
            <v-list-tile-action>
              <v-icon>track_changes</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Track</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="goto('stats')">
            <v-list-tile-action>
              <v-icon>insert_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Stats</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider dark></v-divider>
          <v-subheader>
            Vikt
          </v-subheader>
          <v-list-tile @click="goto('weight')">
            <v-list-tile-action>
              <v-icon>straighten</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Track</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar color="primary" dark fixed app>
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer" />
        <v-toolbar-title>Runtracker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-avatar class="grey lighten-4">
          <img :src="$user.photoURL" alt="avatar">
        </v-avatar>

      </v-toolbar>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import router from './router'
export default {
  name: 'app',
  data: () => ({
    drawer: false
  }),
  methods: {
    goto (url) {
      router.push(url)
    }
  }
}
</script>

<style>

</style>
