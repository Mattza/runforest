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
    <v-container>
    <template v-if="orderedRuns">
      <v-data-table
      v-bind:headers="headers"
      :items="orderedRuns"
      hide-actions
      disable-inital-sort="true"
      :custom-sort="customSort"
      class="elevation-1"
      >
        <template slot="items" slot-scope="run">
          <tr>
            <td class="text-xs-right">{{run.item.date | date}}</td>
            <td class="text-xs-right">{{run.item.time}}</td>
            <td class="text-xs-right">{{run.item.distance}}km</td>
            <td class="text-xs-right">{{run.item | speed}}</td>
            <td class="text-xs-right">{{run.item | pace}}</td>
            <td class="text-xs-right" ><v-icon @click="remove(run.item)">delete</v-icon></td>
          </tr>
        </template>    
    </v-data-table>
    </template>
    </v-container>
  </div>
</template>

<script>
import { db } from '../firebase'

export default {
  name: 'HelloWorld',
  data () {
    return {
      newRun: {},
      valid: true,
      headers: [
        {text: 'Datum', value: 'date'},
        {text: 'Tid', value: 'time'},
        {text: 'Km', value: 'distance'},
        {text: 'Fart', value: 'speed'},
        {text: '', value: 'speed'},
        {text: '', value: 'speed'}
      ],
      customSort: function (arr, index, isDescending) {
        if (!index) {
          return arr
        }
        console.log(arr, index, isDescending, arr[0][index], arr[1][index])
        return arr.sort((a, b) => {
          let sortA = a[index]
          let sortB = b[index]
          if (index === 'date') {
            sortA = new Date(sortA)
            sortB = new Date(sortB)
          }
          if (index === 'time') {
            sortA = sortA.split(':')[0] * 60 + sortA.split(':')[1]
            sortB = sortB.split(':')[0] * 60 + sortB.split(':')[1]
          }
          if (index === 'speed') {
            sortA = this.$options.filters.speed(a)
            sortB = this.$options.filters.speed(b)
            console.log(a, sortA)
          }
          return (isDescending ? -1 : 1) * (sortB - sortA)
        })
      }
    }
  },
  computed: {
    orderedRuns: function () {
      return this.runs && this.runs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
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
    remove: function (run) {
      console.log('delete', run)
      this.$firebaseRefs.runs.child(run).remove()
    }
  },
  firebase: function () {
    return {
      runs: {
        source: db.ref(`/track/${this.$user.uid}`)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

table.table tbody td, 
table.table tbody th,
table.table thead td,
table.table thead th {
  padding:0!important;
}
thead th:nth-of-type(1){
  width:76px;
}
</style>
