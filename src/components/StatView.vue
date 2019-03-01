<template>
  <div class="main">
    <v-container fluid>
      <h1>1000K MÅLET!</h1>
      <h3>Hittills: {{yearTotalDistance}}</h3>
      <h3>Borde ha: {{(yearExpectedDistance||0).toFixed(6)}}</h3>
      <h3>Före: {{ahead.toFixed(1)}} dagar</h3>
      <h1>Snabbast</h1>
      <template v-for="fast in fastests">
        <div class="fastest">
          <h3>{{fast.text}} {{fast.run.distance}}:</h3>
          <h3>{{fast.run.time}}</h3>
          <h3>{{fast.run|speed}}</h3>
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
  computed: {
    // a computed getter
    ahead: function () {
      // `this` points to the vm instance
      const aheadKM = this.yearTotalDistance - this.yearExpectedDistance
      const aheadDays = aheadKM * 365 / 1000
      return aheadDays
    }
  },
  firebase: function () {
    return {
      runs: {
        source: db.ref(`/track/${this.$user.uid}`),
        readyCallback: function (data) {
          const roundToTwoDecimals = num => Math.round(num * 100) / 100
          this.yearTotalDistance = roundToTwoDecimals(this.runs.filter(run => new Date(run.date) > new Date('2019-01-01'))
            .reduce((acc, item) => acc + parseFloat(item.distance), 0))
          const getFast = getFastestRun(this.runs, this.$options.filters.speed)
          this.fastests.push({text: '', run: getFast('5')})
          this.fastests.push({text: '', run: getFast('10')})
          this.fastests.push({
            text: 'Lång',
            run: this.runs.reduce((best, item) => parseFloat(best.distance) > parseFloat(item.distance) ? best : item)
          })
          this.fastests.push({
            text: 'Timman',
            run: this.runs.filter(item => item.time === '60:00')
              .reduce((best, item) => parseFloat(best.distance) > parseFloat(item.distance) ? best : item)
          })
          const short = 5
          const long = 10
          const shortRuns = this.runs.filter(run => parseFloat(run.distance) === short)
          const mediumRuns = this.runs.filter(run => parseFloat(run.distance) === long) // > short && parseFloat(run.distance) <= long
          const longRuns = this.runs.filter(run => parseFloat(run.distance) > long)
          createChartData(shortRuns, this.shortChartdata, this.$options.filters.speed, false)
          createChartData(mediumRuns, this.mediumChartdata, this.$options.filters.speed, false)
          createChartData(longRuns, this.longChartdata, this.$options.filters.speed, true)
        }
      }
    }
  }
}

const createChartData = (runs, chartData, speedFilter, distance) => {
  chartData.labels = runs.map(run => run.date.split('T')[0])
  if (distance) {
    chartData.datasets.push({
      label: 'Distance',
      borderColor: 'grey',
      fill: false,
      data: runs.map(run => parseFloat(run.distance))
    })
  } else {
    chartData.datasets.push({
      label: 'Speed',
      borderColor: 'red',
      fill: false,
      data: runs.map(speedFilter)
    })
  }
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
.fastest > *{
  min-width: 80px;
}
.fastest > *:first-child {
  flex-grow: 1;
}
</style>
