<template>
  <div class="main">
    <v-container fluid>

      <v-form v-model="valid" ref="form" lazy-validation>
        <v-card>
          <v-card-text>
            <v-text-field label="Tid" v-model="newRun.time" required></v-text-field>
            <v-text-field label="Sträcka(km)" v-model="newRun.distance" required></v-text-field>
           
            <v-layout row wrap justify-space-around>
              <v-flex xs5>
                <!-- <v-text-field label="Tid" v-model="newRun.time" required></v-text-field> -->
              </v-flex>
              <v-flex xs5>
                <!-- <v-text-field label="Sträcka(km)" v-model="newRun.distance" required></v-text-field> -->
              </v-flex>
              <v-flex xs6>
                <!-- <v-btn @click="submit" :disabled="!valid">Lägg till</v-btn> -->
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
             <v-btn @click="submit" :disabled="!valid">Lägg till</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

    </v-container>
    <v-list two-line>
      <template v-for="(run, index) in orderedRuns">
        <v-list-tile avatar v-bind:key="run.title" @click="gotoRun(run)">
          <v-list-tile-content>
            <v-list-tile-title>{{ run.date | date }}</v-list-tile-title>
            <v-list-tile-sub-title class="grey--text text--darken-4">
              <v-layout row>
                <v-flex xs3>
                  <v-layout column wrap>
                    <v-flex>Tid</v-flex>
                    <v-flex> {{run.time}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs3>
                  <v-layout column wrap>
                    <v-flex>Sträcka</v-flex>
                    <v-flex> {{run.distance}}km </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs3>
                  <v-layout column wrap>
                    <v-flex>Hastighet</v-flex>
                    <v-flex> {{run|speed}}
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs3>
                  <v-layout column wrap>
                    <v-flex>Km-tid</v-flex>
                    <v-flex>{{run|pace}}</v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-bind:key="run.title" v-if="index !== runs.length - 1"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import { db } from '../firebase'

export default {
  name: 'HelloWorld',
  data () {
    return {
      newRun: {},
      valid: true
    }
  },
  computed: {
    orderedRuns: function () {
      return this.runs && this.runs.sort((a, b) => {
        return a.date < b.date
      })
    }
  },
  methods: {
    submit: function () {
      if (this.$refs.form.validate()) {
        let obj = {
          ...this.newRun,
          date: new Date().toISOString()
        }
        console.log(obj)
        this.$firebaseRefs.runs.push(obj)
      }
    },
    gotoRun: function (run) {
      console.log('goto', run)
    }
  },
  firebase: {
    runs: db.ref('/track')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
