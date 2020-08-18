export default {
  data() {
    return {}
  },
  methods: {
    createTestNode(dis) {
      let node = {
        id: '新能源汽车',
        x: 0,
        y: 0,
        z: dis,
        radius: 6
      }
      let { list, links } = this.createTNearbyNode(node)
      this.initLine(links)
      this.initDom(list)
    },
    createTNearbyNode(node) {
      let list = [node]
      let links = []
      let number = 3
      for (let i = 0; i < number; i++) {
        let node_t = {
          id: '测试节点_' + i,
          x: this.initNearby_x(i, node.x),
          y: this.initNearby_y(i, node.y),
          z: this.initNearby_z(i, node.z),
          radius: Math.ceil(Math.random() * (this.nodeRadius_max - 2)) + 2
        }
        list.push(node_t)
        links.push({
          target: node_t,
          source: node
        })
      }
      return { list: list, links: links }
    },
    initNearby_x(index, x) {
      let num = 0
      index = index % 4
      if (index == 0 || index === 2) {
        num = Math.random() * -35 + x - 30
      } else {
        num = Math.random() * 35 + x + 30
      }
      return Math.floor(num)
    },
    initNearby_y(index, y) {
      let num = 0
      index = index % 4
      if (index < 2) {
        num = Math.random() * 30 + y + 30
      } else {
        num = Math.random() * -30 + y - 30
      }
      return Math.floor(num)
    },
    initNearby_z(index, z) {
      let num = 0
      index = index % 2
      if (index === 0) {
        num = ((Math.random() * this.space) / 16) * -1 + z
      } else {
        num = z
      }
      return Math.floor(num)
    }
  }
}
