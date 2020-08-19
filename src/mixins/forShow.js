export default {
  data() {
    return {
      showNode: [],
      showLink: []
    }
  },
  methods: {
    createTestNode(dis) {
      let node = {
        id: '新能源汽车',
        x: 0,
        y: 0,
        z: dis,
        radius: 6,
        level: 1,
        type: null
      }
      this.showNode = [node]
      this.createTNearbyNode(node, 3)
      this.initLine(this.showLink)
      this.initDom(this.showNode)
    },
    createTNearbyNode(node, number = 0) {
      for (let i = 0; i < number; i++) {
        let node_t = this.getRandomPosition(i, node)
        this.showNode.push(node_t)
        this.showLink.push({ target: node_t, source: node })
        if ((i === 0 && node_t.level === 2) || (i === 1 && node_t.level === 3)) {
          this.createTNearbyNode(node_t, 2)
        }
        if (i === 1 && node_t.level === 2) {
          this.createTNearbyNode(node_t, 3)
        }
        if (i === 2 && node_t.level === 2) {
          this.createTNearbyNode(node_t, 1)
        }
      }
    },
    getRandomPosition(i, node) {
      let type = node.type
      if (!type) {
        let typeList = [
          ['top', 'left'],
          ['top', 'right'],
          ['bottom', 'right'],
          ['bottm', 'left']
        ]
        type = typeList[i % 4]
      } else if (type.join('') === 'topleft') {
        let typeList = [
          ['top', 'left'],
          ['top', 'right'],
          ['bottom', 'left']
        ]
        type = typeList[i % 3]
      } else if (type.join('') === 'topright') {
        let typeList = [
          ['top', 'right'],
          ['top', 'left'],
          ['bottom', 'right']
        ]
        type = typeList[i % 3]
      } else if (type.join('') === 'bottomright') {
        let typeList = [
          ['bottom', 'right'],
          ['right', 'left'],
          ['top', 'left']
        ]
        type = typeList[i % 3]
      } else if (type.join('') === 'bottomleft') {
        let typeList = [['bottom', 'bottom'], ['bottom', 'right'], [('top', 'bottom')]]
        type = typeList[i % 3]
      }
      let y = this[`init${type[0]}`](node.y)
      let x = this[`init${type[1]}`](node.x)
      let z = this.initNearby_z(i, node.z)
      let radius = Math.ceil(Math.random() * (this.nodeRadius_max - 2)) + 2
      let level = node.level + 1
      return {
        id: `${level}_${i}`,
        x: x,
        y: y,
        z: z,
        radius: radius,
        level: level,
        type: type
      }
    },
    initleft(x) {
      return Math.floor(Math.random() * -80 + x - 15)
    },
    initright(x) {
      return Math.floor(Math.random() * 80 + x + 15)
    },
    inittop(y) {
      return Math.floor(Math.random() * 60 + y + 5)
    },
    initbottom(y) {
      return Math.floor(Math.random() * -60 + y - 5)
    },
    initNearby_z(index, z) {
      let num = 0
      index = index % 2
      if (index === 0) {
        num = Math.random() * 100 + z
      } else {
        num = Math.random() * -350 + z
      }
      return Math.floor(num)
    }
  }
}
