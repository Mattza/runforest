<template>
  <div class="main">
    <v-container fluid>
      <h1>1000K MÅLET!</h1>
      <h3>Hittills: {{yearTotalDistance}}</h3>
      <h3>Borde ha: {{(yearExpectedDistance||0).toFixed(6)}}</h3>
      <h1>Snabbast</h1>
      <template v-for="run in fastests">
        <div class="fastest">
          <h3>{{run.distance}}km:</h3>
          <h3>{{run.time}}</h3>
          <h3>{{run|speed}}</h3>
        </div>
      </template>
    
      <h1>Runt milen</h1>
      <line-chart v-if="mediumChartdata.datasets.length" :data="mediumChartdata" :options="chartoptions"></line-chart>
      <h1>Långa pass</h1>
      <line-chart v-if="longChartdata.datasets.length" :data="longChartdata" :options="chartoptions"></line-chart>
      <h1>Korta pass</h1>
      <line-chart v-if="shortChartdata.datasets.length" :data="shortChartdata" :options="chartoptions"></line-chart>
    </v-container>
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
      shortChartdata: {
        datasets: []
      },
      mediumChartdata: {
        datasets: []
      },
      longChartdata: {
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
      weights: [],
      yearTotalDistance: 0,
      yearExpectedDistance: (new Date() - new Date('2019-01-01')) / 31536000000 * 1000,
      fastests: []
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
  created: function () {
    setInterval(() => {
      this.yearExpectedDistance = (new Date() - new Date('2019-01-01')) / 31536000000 * 1000
    }, 100)
  },
  firebase: function () {
    return {
      runs: {
        source: db.ref(`/track/${this.$user.uid}`),
        readyCallback: function (data) {
          this.yearTotalDistance = this.runs.filter(run => new Date(run.date) > new Date('2019-01-01'))
            .reduce((acc, item) => acc + parseFloat(item.distance), 0)
          const getFast = getFastestRun(this.runs, this.$options.filters.speed)
          this.fastests.push(getFast('5'))
          this.fastests.push(getFast('10'))
          const short = 8
          const long = 11
          const shortRuns = this.runs.filter(run => parseFloat(run.distance) <= short)
          const mediumRuns = this.runs.filter(run => parseFloat(run.distance) > short && parseFloat(run.distance) <= long)
          const longRuns = this.runs.filter(run => parseFloat(run.distance) > long)
          createChartData(shortRuns, this.shortChartdata, this.$options.filters.speed)
          createChartData(mediumRuns, this.mediumChartdata, this.$options.filters.speed)
          createChartData(longRuns, this.longChartdata, this.$options.filters.speed)
        }
      }
    }
  }
}

const createChartData = (runs, chartData, speedFilter) => {
  chartData.labels = runs.map(run => run.date.split('T')[0])
  chartData.datasets.push({
    label: 'Distance',
    borderColor: 'grey',
    fill: false,
    data: runs.map(run => parseFloat(run.distance))
  })
  chartData.datasets.push({
    label: 'Speed',
    borderColor: 'red',
    fill: false,
    data: runs.map(speedFilter)
  })
}

const getFastestRun = (runs, speedFilter) => distance => runs.filter(item => item.distance === distance).reduce((best, item) =>
 parseFloat(speedFilter(item)) > parseFloat(speedFilter(best)) ? item : best)
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fastest{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.fastest  * {
  width: 40px;
}
</style>
