// - 某停车场，分三层，每层100车位
// - 每个车位都能监控车辆的驶入和离开
// - 车辆进入前，显示每层的空余车位数量
// - 车辆进入时，摄像头可识别车牌号和时间
// - 车辆出来时，出口显示器显示车牌号和停车时长

class Camera {
  shot (car) {
    return {
      num: car.num,
      inTime: Date.now()
    }
  }
}

class Screen {
  show (car, inTime) {
    console.log(`车辆${car.num}离开，停车时长为${Date.now() - inTime}ms`)
  }
}

class Car {
  constructor(num) {
    this.num = num
  }
}

class Park {
  constructor(floors = []) {
    this.floors = floors
    this.camera = new Camera()
    this.screen = new Screen()
    this.carList = {}
  }
  emptyCount () {
    return this.floors.map(floor => {
      let tip = `${floor.index}层还有${floor.emptyPlaceCount()}个车位`
      console.log(tip)
      return tip
    }).join('\n')
  }
  in (car) {
    // 停到某个车位
    let placeIndex = Math.floor(Math.random() * 100 + 1)
    let floorIndex = Math.floor(Math.random() * this.floors.length)
    let place = this.floors[floorIndex].places[placeIndex]
    place.in()
    // 记录当前车辆信息
    let info = {
      ...this.camera.shot(car),
      place
    }
    // 记录信息
    this.carList[car.num] = info
  }
  out (car) {
    let info = this.carList[car.num]
    // 出车位
    info.place.out()
    // 显示时间
    this.screen.show(car, info.inTime)
    // 删除停车场存储信息
    delete this.carList[car.num]
  }
}

class Floor {
  constructor(index, places = []) {
    this.index = index
    this.places = places
  }
  emptyPlaceCount () {
    let total = this.places.reduce((acc, curPlace) => {
      return acc + (1 ^ !curPlace.empty)
    }, 0)
    return total
  }
}

class Place {
  constructor() {
    this.empty = true
  }
  in () {
    this.empty = false
  }
  out () {
    this.empty = true
  }
}

let floors = []
for (let i = 0; i < 3; i++) {
  let places = []
  for (let j = 0; j < 100; j++) {
    places.push(new Place())
  }
  floors.push(new Floor(i + 1, places))
}
let park = new Park(floors)

let car1 = new Car('京G-0000')
let car2 = new Car('京G-0001')
let car3 = new Car('京G-0002')

console.log('第一辆车进入')
park.emptyCount()
park.in(car1)
console.log('第二辆车进入')
park.emptyCount()
park.in(car2)
setTimeout(() => park.out(car1), 500)
setTimeout(() => park.out(car2), 1500)

console.log('第三辆车进入')
park.emptyCount()
park.in(car3)
setTimeout(() => park.out(car3), 2500)

console.log(park)
