import Vue from 'vue'
import Vuex from 'vuex'
import gameScene from './modules/gameScene'
import tanks from './modules/tanks'
import MapRecord from '../types/MapRecord'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
import {
  List
} from 'immutable'
import StageConfig from '../types/StageConfig'
const requireStage = require.context('../stages', false, /\.json/)
const filenames = List(requireStage.keys())

let defaultStages = filenames
  .map(requireStage).map(StageConfig.fromRawStageConfig)
  // 按照关卡数字顺序排序
  .sortBy(s => Number(s.name));

export default new Vuex.Store({
  state: {
    cache: new Map(),
    players: new Set(),
    bullets: new Set(),
    explosions: new Set(),
    tanks:new Set(),
    map: defaultStages.first().map,
  },
  getters: {
    map: state => state.map,
    cache:state=>state.cache
  },
  mutations: {
    setCache(state, {
      key,
      url
    }) {
      state.cache.set(key, url)
    }
  },
  modules: {
    gameScene,
  },
  strict: debug,
})
