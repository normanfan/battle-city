import {
  Record
} from 'immutable'

const TankRecordType = Record({
  active: true,
  tankId: 0,
  x: 0,
  y: 0,
  side: 'human',
  direction: 'up',
  moving: false,
  level: 'basic',
  color: 'auto',
  hp: 1,
  withPowerUp: false,

  // helmetDuration用来记录tank的helmet的剩余的持续时间
  helmetDuration: 0,
  // frozenTimeout小于等于0表示可以进行移动, 大于0表示还需要等待frozen毫秒才能进行移动
  frozenTimeout: 0,
  // cooldown小于等于0表示可以进行开火, 大于0表示还需要等待cooldown毫秒才能进行开火
  cooldown: 0,
})

export default class TankRecord extends TankRecordType {
  static fromJS(object) {
    return new TankRecord(object)
  }
}
