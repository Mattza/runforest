<template>
  <div class="main">
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-text-field label="Vikt" v-model="newObj.weight" required></v-text-field>
      <v-btn @click="submit" :disabled="!valid">
        Lägg till
      </v-btn>
    </v-form>
    <v-list>
      <template v-for="weight in weights">
        <v-list-tile avatar v-bind:key="weight.date" @click="gotoRun(run)">
          <v-list-tile-avatar v-if="weight.avatar">
            <img v-bind:src="weight.avatar" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ weight.date | date }} - {{weight.weight}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>

  </div>
</template>

<script>
import { db } from '../firebase'

export default {
  data () {
    return {
      newObj: {},
      valid: true,
      weights: []
    }
  },
  methods: {
    submit: function () {
      if (this.$refs.form.validate()) {
        let obj = {
          ...this.newObj,
          date: new Date().toISOString()
        }
        this.$firebaseRefs.weights.push(obj)
      }
    }
  },
  mounted: function () {
    this.$bindAsArray('weights', db.ref(`/weight/${this.$user.uid}`))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
