import MapRecord from './MapRecord';
import EagleRecord from './EagleRecord'
import {
  N_MAP,
  BLOCK_SIZE,
  FIELD_SIZE,
  FIELD_BLOCK_SIZE
} from '../utils/constants'
import {
  Repeat,
  Set,
  List,
  Record
} from 'immutable'
export class EnemyGroupConfig extends Record({
  tankLevel: 'basic',
  count: 0,
}) {
  static fromJS(object) {
    return new EnemyGroupConfig(object)
  }

  static unwind(enemyGroupConfig) {
    return Repeat(enemyGroupConfig.tankLevel, enemyGroupConfig.count)
  }

  incTankLevel() {
    if (this.tankLevel === 'basic') {
      return this.set('tankLevel', 'fast')
    } else if (this.tankLevel === 'fast') {
      return this.set('tankLevel', 'power')
    } else {
      return this.set('tankLevel', 'armor')
    }
  }

  decTankLevel() {
    if (this.tankLevel === 'armor') {
      return this.set('tankLevel', 'power')
    } else if (this.tankLevel === 'power') {
      return this.set('tankLevel', 'fast')
    } else {
      return this.set('tankLevel', 'basic')
    }
  }
}

export const defaultEnemiesConfig = List([
  new EnemyGroupConfig({
    tankLevel: 'basic',
    count: 10
  }),
  new EnemyGroupConfig({
    tankLevel: 'fast',
    count: 4
  }),
  new EnemyGroupConfig({
    tankLevel: 'power',
    count: 4
  }),
  new EnemyGroupConfig({
    tankLevel: 'armor',
    count: 2
  }),
])
const StageConfigRecord = Record({
  name: '',
  custom: false,
  difficulty: 1,
  map: new MapRecord(),
  enemies: defaultEnemiesConfig,
})
export default class StageConfig extends StageConfigRecord {
  static fromRawStageConfig(object) {
    return new StageConfig({
      name: object.name,
      custom: object.custom,
      difficulty: object.difficulty,
      map: StageConfig.parseStageMap(object.map),
      enemies: StageConfig.parseStageEnemies(object.enemies),
    })
  }

  static parseBrickBits(str) {
    if (str.length === 1) {
      const short = parseInt(str, 16)
      let long = 0
      if (0b0001 & short) {
        long += 0xf000
      }
      if (0b0010 & short) {
        long += 0x0f00
      }
      if (0b0100 & short) {
        long += 0x00f0
      }
      if (0b1000 & short) {
        long += 0x000f
      }
      return long
    } else if (str.length === 4) {
      return parseInt(str, 16)
    }
  }

  /**
   * 解析关卡文件中的地图配置.
   * 地图配置数据格式为 string[], 数组中每一个string对应地图中的一行.
   * 一行中包含16个item(由一个或多个空格分隔开来), 对应地图一行的16个block
   * item的第一个字符标记了block的类型
   * item后续字符(如果存在的话)为十六进制格式, 用来表示该block中哪些部分包含了地图元素
   * 空白 XX
   * 砖块 brick  B<n>
   * 河流 river  R
   * 雪地 snow   S
   * 森林 forest F
   * 钢块 steel  T<n>
   * 老鹰 eagle  E
   */
  static parseStageMap(map) {
    let bricks = new Set()
    let steels = new Set()
    let rivers = new Set()
    let snows = new Set()
    let forests = new Set()
    let eaglePos = null
    for (let row = 0; row < FIELD_BLOCK_SIZE; row += 1) {
      const line = map[row].toLowerCase().split(/ +/)
      for (let col = 0; col < FIELD_BLOCK_SIZE; col += 1) {
        const item = line[col].trim()
        if (item[0] === 'b') {
          // brick
          const bits = StageConfig.parseBrickBits(item.substring(1))
          const brickRow = 4 * row
          const brickCol = 4 * col
          const N = 52

          const part0 = (bits >> 12) & 0xf
          part0 & 0b0001 && (bricks = bricks.add(brickRow * N + brickCol + 0))
          part0 & 0b0010 && (bricks = bricks.add(brickRow * N + brickCol + 1))
          part0 & 0b0100 && (bricks = bricks.add(brickRow * N + brickCol + N))
          part0 & 0b1000 && (bricks = bricks.add(brickRow * N + brickCol + N + 1))

          const part1 = (bits >> 8) & 0xf
          part1 & 0b0001 && (bricks = bricks.add(brickRow * N + brickCol + 2 + 0))
          part1 & 0b0010 && (bricks = bricks.add(brickRow * N + brickCol + 2 + 1))
          part1 & 0b0100 && (bricks = bricks.add(brickRow * N + brickCol + 2 + N))
          part1 & 0b1000 && (bricks = bricks.add(brickRow * N + brickCol + 2 + N + 1))

          const part2 = (bits >> 4) & 0xf
          part2 & 0b0001 && (bricks = bricks.add((brickRow + 2) * N + brickCol + 0))
          part2 & 0b0010 && (bricks = bricks.add((brickRow + 2) * N + brickCol + 1))
          part2 & 0b0100 && (bricks = bricks.add((brickRow + 2) * N + brickCol + N))
          part2 & 0b1000 && (bricks = bricks.add((brickRow + 2) * N + brickCol + N + 1))

          const part3 = (bits >> 0) & 0xf
          part3 & 0b0001 && (bricks = bricks.add((brickRow + 2) * N + brickCol + 2 + 0))
          part3 & 0b0010 && (bricks = bricks.add((brickRow + 2) * N + brickCol + 2 + 1))
          part3 & 0b0100 && (bricks = bricks.add((brickRow + 2) * N + brickCol + 2 + N))
          part3 & 0b1000 && (bricks = bricks.add((brickRow + 2) * N + brickCol + 2 + N + 1))
        } else if (item[0] === 't') {
          const bits = parseInt(item[1], 16)
          if (bits & 0b0001) {
            steels = steels.add(2 * row * 26 + 2 * col)
          }
          if (bits & 0b0010) {
            steels = steels.add(2 * row * 26 + 2 * col + 1)
          }
          if (bits & 0b0100) {
            steels = steels.add((2 * row + 1) * 26 + 2 * col)
          }
          if (bits & 0b1000) {
            steels = steels.add((2 * row + 1) * 26 + 2 * col + 1)
          }

        } else if (item[0] === 'r') {
          rivers = rivers.add(row * FIELD_BLOCK_SIZE + col)
        } else if (item[0] === 'f') {
          forests = forests.add(row * FIELD_BLOCK_SIZE + col)
        } else if (item[0] === 's') {
          snows = snows.add(row * FIELD_BLOCK_SIZE + col)
        } else if (item[0] === 'e') {
          if (eaglePos != null) {
            throw new Error('Eagle appears more than once')
          } else {
            eaglePos = {
              x: col * BLOCK_SIZE,
              y: row * BLOCK_SIZE,
            }
          }
        } else if (item[0] !== 'x') {
          throw new Error(`Invalid map at row:${row} col:${col}`)
        }
      }
    }

    return new MapRecord({
      eagle: eaglePos ?
        new EagleRecord({
          x: eaglePos.x,
          y: eaglePos.y,
          broken: false,
        }) : null,
      bricks: Repeat(false, N_MAP.BRICK ** 2)
        .map((set, index) => bricks.has(index))
        .toList(),
      steels: Repeat(false, N_MAP.STEEL ** 2)
        .map((set, index) => steels.has(index))
        .toList(),
      rivers: Repeat(false, N_MAP.RIVER ** 2)
        .map((set, index) => rivers.has(index))
        .toList(),
      snows: Repeat(false, N_MAP.SNOW ** 2)
        .map((set, index) => snows.has(index))
        .toList(),
      forests: Repeat(false, N_MAP.FOREST ** 2)
        .map((set, index) => forests.has(index))
        .toList(),
    })
  }

  static parseStageEnemies(enemies) {
    const array = []
    for (const descriptor of enemies) {
      const splited = descriptor.split('*').map(s => s.trim())

      const count = Number(splited[0])
      const tankLevel = splited[1]
      array.push(new EnemyGroupConfig({
        tankLevel,
        count
      }))
    }
    return List(array)
      .setSize(4)
      .map(v => (v ? v : new EnemyGroupConfig()))
  }
}
