<template>
  <div class="main">
    <line-chart v-if="chartdata.datasets.length" :data="chartdata" :options="chartoptions"></line-chart>
    <div class="well">{{runs}}</div>
  </div>
</template>

<script>
import { db } from '../firebase'
import LineChart from './chart/Line'

export default {
  name: 'HelloWorld',
  components: { LineChart },
  data () {
    return {
      chartdata: {
        datasets: []
      },
      chartoptions: {
        elements: {
          line: {
            tension: 0
          }
        },
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      weights: []
    }
  },
  filters: {
    date: function (value) {
      return value.split('T')[0]
    },
    speed: run => {
      let km = parseFloat(run.distance)
      let [minutes, seconds] = run.time.split(':')
      return (km / (minutes / 60 + seconds / 3600)).toFixed(2)
    },
    pace: run => {
      return 2
    }
  },
  methods: {},
  firebase: {
    runs: {
      source: db.ref('/track'),
      readyCallback: function (data) {
        this.chartdata.labels = this.runs.map(run => run.date.split('T')[0])
        this.chartdata.datasets.push(
          {
            label: 'Distance',
            borderColor: 'grey',
            fill: false,
            data: this.runs.map(run => parseFloat(run.distance))
          }
        )
        this.chartdata.datasets.push(
          {
            label: 'Speed',
            borderColor: 'red',
            fill: false,
            data: this.runs.map(this.$options.filters.speed)
          }
        )
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
