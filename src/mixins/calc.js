export default {
  data() {
    return {
      nodeNumber: 80,
      nodeRadius_max: 6
    }
  },
  methods: {
    calc(dis) {
      const nodes = []
      for (let i = 0; i < this.nodeNumber; i++) {
        nodes.push({
          // id: i,
          id: this.getId(i, dis),
          x: this.init_x(i),
          y: this.init_y(i),
          z: this.init_z(i, dis),
          radius: Math.ceil(Math.random() * this.nodeRadius_max)
        })
      }
      return nodes
    },
    init_x(index) {
      let num = (Math.random() * this.canvas.width) / 2
      let step_1 = Math.ceil(this.nodeNumber * 0.3)
      let step_2 = Math.ceil(this.nodeNumber * 0.6)
      let step_3 = Math.ceil(this.nodeNumber * 0.8)
      if (index < step_1) {
        num *= -1
      } else if (index > step_2 && index < step_3) {
        num *= -1
      }
      return Math.floor(num)
    },
    init_y(index) {
      let step = Math.ceil(this.nodeNumber * 0.6)
      let num = (Math.random() * this.canvas.height) / 2
      if (index > step) {
        num *= -1
      }
      return Math.floor(num)
    },
    init_z(index, z) {
      let num = 0
      index = index % 4
      if (index === 0) {
        num = ((Math.random() * this.space) / 8) * -1 + z - this.space / 8
      } else if (index === 1) {
        num = ((Math.random() * this.space) / 8) * -1 + z
      } else if (index === 2) {
        num = ((Math.random() * this.space) / 8) * 1 + z
      } else {
        num = ((Math.random() * this.space) / 8) * 1 + z + this.space / 8
      }
      return Math.floor(num)
    },
    getId(i, dis) {
      if (dis !== 1000) {
        return
      }
      let id = null
      switch (i) {
        case 1:
          id = '汽车'
          break
        case 2:
          id = '农业'
          break
        case 3:
          id = '采矿业'
          break
        case 4:
          id = '建筑业'
          break
        case 5:
          id = '金融业'
          break
        case 6:
          id = '房地产业'
          break
        case 7:
          id = '教育'
          break
        case 8:
          id = '文化与卫生'
          break
        case 9:
          id = '公共管理'
          break
        case 10:
          id = '国际组织'
          break
        default:
          break
      }
      return id
    }
  }
}
