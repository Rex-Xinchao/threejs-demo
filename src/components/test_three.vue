<template>
  <div id="hello"></div>
</template>

<script>
import * as THREE from 'three'
import * as d3 from 'd3'

// todo 点的分布
// todo 连线 象限内的点22相连
const nodes = [
  { id: '0_0', radius: 6 },
  { id: '1_1', radius: 6 },
  { id: '1_2', radius: 6 },
  { id: '1_3', radius: 6 },
  { id: '1_4', radius: 6 },
  { id: '1_5', radius: 6 },
  { id: '1_6', radius: 6 },
  { id: '1_7', radius: 6 },
  { id: '1_8', radius: 6 },
  { id: '1_9', radius: 6 },
  { id: '2_1', radius: 6 },
  { id: '2_2', radius: 6 },
  { id: '2_3', radius: 6 },
  { id: '2_4', radius: 6 },
  { id: '2_5', radius: 6 },
  { id: '2_6', radius: 6 },
  { id: '2_7', radius: 6 },
  { id: '2_8', radius: 6 },
  { id: '2_9', radius: 6 },
  { id: '3_1', radius: 6 },
  { id: '3_2', radius: 6 },
  { id: '3_3', radius: 6 },
  { id: '3_4', radius: 6 },
  { id: '3_5', radius: 6 },
  { id: '3_6', radius: 6 },
  { id: '3_7', radius: 6 },
  { id: '3_8', radius: 6 },
  { id: '3_9', radius: 6 },
  { id: '4_1', radius: 6 },
  { id: '4_2', radius: 6 },
  { id: '4_3', radius: 6 },
  { id: '4_4', radius: 6 },
  { id: '4_5', radius: 6 },
  { id: '4_6', radius: 6 },
  { id: '4_7', radius: 6 },
  { id: '4_8', radius: 6 },
  { id: '4_9', radius: 6 }
]

const edges = [
  { source: '0_0', target: '1_1', value: 1 },
  { source: '0_0', target: '2_1', value: 1 },
  { source: '0_0', target: '3_1', value: 1 },
  { source: '0_0', target: '4_1', value: 1 },
  { source: '1_1', target: '1_2', value: 1 },
  { source: '1_2', target: '1_3', value: 1 },
  { source: '1_3', target: '1_4', value: 1 },
  { source: '1_4', target: '1_5', value: 1 },
  { source: '1_5', target: '1_6', value: 1 },
  { source: '1_6', target: '1_7', value: 1 },
  { source: '1_7', target: '1_8', value: 1 },
  { source: '1_8', target: '1_9', value: 1 },
  { source: '2_1', target: '2_2', value: 1 },
  { source: '2_2', target: '2_3', value: 1 },
  { source: '2_3', target: '2_4', value: 1 },
  { source: '2_4', target: '2_5', value: 1 },
  { source: '2_5', target: '2_6', value: 1 },
  { source: '2_6', target: '2_7', value: 1 },
  { source: '2_7', target: '2_8', value: 1 },
  { source: '2_8', target: '2_9', value: 1 },
  { source: '3_1', target: '3_2', value: 1 },
  { source: '3_2', target: '3_3', value: 1 },
  { source: '3_3', target: '3_4', value: 1 },
  { source: '3_4', target: '3_5', value: 1 },
  { source: '3_5', target: '3_6', value: 1 },
  { source: '3_6', target: '3_7', value: 1 },
  { source: '3_7', target: '3_8', value: 1 },
  { source: '3_8', target: '3_9', value: 1 },
  { source: '4_1', target: '4_2', value: 1 },
  { source: '4_2', target: '4_3', value: 1 },
  { source: '4_3', target: '4_4', value: 1 },
  { source: '4_4', target: '4_5', value: 1 },
  { source: '4_5', target: '4_6', value: 1 },
  { source: '4_6', target: '4_7', value: 1 },
  { source: '4_7', target: '4_8', value: 1 },
  { source: '4_8', target: '4_9', value: 1 }
]

// const force = () => {}

export default {
  name: 'HelloWorld',
  data() {
    return {
      canvas: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      FOV: 45,
      NEAR: 0.01,
      FAR: 3000,
      limit: 0,
      start: false
    }
  },
  props: {
    msg: String
  },
  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene()
      // const ambientLight = new THREE.AmbientLight(0x523318)
      // this.scene.add(ambientLight)
    },
    initCamera() {
      // 创建透视相机
      const proportion = this.canvas.width / this.canvas.height
      this.camera = new THREE.PerspectiveCamera(this.FOV, proportion, this.NEAR, this.FAR)
      this.camera.zoom = 0.001
    },
    initRender() {
      // 设置渲染器
      this.renderer = new THREE.WebGLRenderer({
        alpha: true, // 设置为透明
        precision: 'highp',
        antialias: true
      })
      this.renderer.setSize(this.canvas.width, this.canvas.height)
      document.getElementById('hello').appendChild(this.renderer.domElement)
    },
    async initDom() {
      const step = 1000
      let index = 0
      for (let i = 0; i < 10; i++) {
        await this.calc(index, step)
        index += step
      }
      this.limit = index
      this.camera.position.set(0, 0, step) // 指定相机位置
    },
    async initLevel(nodes, edges, dis, step) {
      nodes.forEach(node => {
        const radius = node.radius
        const geometry = new THREE.CircleGeometry(radius, 100)
        const material = new THREE.MeshBasicMaterial({
          color: 'white',
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide
        })
        const sphere = new THREE.Mesh(geometry, material)
        const x = node.x
        const y = node.y
        const z = Math.floor((Math.random() * step) / 2) + dis
        node.z = z
        // 范围 -700 - +700
        sphere.position.x = x
        // 范围 -400 - +400
        sphere.position.y = y
        sphere.position.z = z
        this.scene.add(sphere) // 将立方体网格添加到场景中
        this.start = true
      })
      let points = []
      edges.forEach(edge => {
        const target = nodes.find(node => node.id === edge.target.id)
        const source = nodes.find(node => node.id === edge.source.id)
        points.push(new THREE.Vector3(target.x, target.y, target.z))
        points.push(new THREE.Vector3(source.x, source.y, source.z))
      })
      this.initLine(points)
    },
    initLine(points) {
      const material = new THREE.LineBasicMaterial({ color: 'white' })
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
      this.renderer.render(this.scene, this.camera)
    },
    initControls() {
      const OrbitControls = require('three-orbit-controls')(THREE)
      const controls = new OrbitControls(this.camera) // 初始化控制器
      controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.PAN
      }
      controls.autoRotate = false // 自动旋转
      controls.target.set(0, 0, 0) // 设置控制器的焦点，使控制器围绕这个焦点进行旋转
      controls.enableZoom = false // 允许水平或垂直旋转
      controls.enableRotate = false // 允许水平或垂直旋转
      controls.enablePan = false // 允许摄像机平移
      controls.enableKeys = false // 允许键盘控制
      controls.zoomSpeed = 0.6
      this.controls = controls
      controls.update() // 照相机转动时，必须更新该控制器
    },
    animate() {
      const vm = this
      function render() {
        requestAnimationFrame(render) // 让浏览器执行参数中的函数，不断循环（浏览器一个新的API）
        vm.renderer.render(vm.scene, vm.camera) // 结合场景和相机进行渲染，即用摄像机拍下此刻的场景
      }
      render()
    },
    async calc(dis, step) {
      let simulation = d3
        .forceSimulation()
        .force(
          'link',
          d3
            .forceLink()
            .distance(100)
            .id(d => d.id)
        )
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(0, 0))

      //绑定节点和边以及tick事件处理函数
      simulation
        .nodes(nodes)
        .force('link')
        .links(edges)

      await setTimeout(() => {
        this.initLevel(nodes, edges, dis, step)
      }, 2500)
    }
  },
  mounted() {
    // todo 优化圈的锯齿状
    // 连线
    // 添加文字
    this.initScene()
    this.initCamera()
    this.initRender()
    this.initDom()
    this.animate()
    this.initControls()
    // 现在滑轮滚动的范围
    // document.body.onmousewheel = e => {
    //   // this.controls.target.set(0, 0, 0)
    //   const z = this.camera.position.z
    //   if (z >= this.limit || z <= 500) {
    //     this.controls.enableZoom = false
    //   }
    //   if (z > 500 && e.deltaY < 0) {
    //     this.controls.enableZoom = true
    //   }
    //   if (z < 500 && e.deltaY > 0) {
    //     this.controls.enableZoom = true
    //   }
    // }
    document.body.onmousewheel = e => {
      let zoom = true
      const z = this.camera.position.z
      if (z >= this.limit || z <= 500) {
        zoom = false
      }
      if (z > 500 && e.deltaY < 0) {
        zoom = true
      }
      if (z < 500 && e.deltaY > 0) {
        zoom = true
      }
      console.log(z, this.limit, zoom)
      if (zoom) {
        this.camera.position.z += e.deltaY
      }
    }
    let { x, y } = { x: 0, y: 0 }
    document.getElementById('hello').onmousemove = e => {
      if (!this.start) return
      if (x === 0 && y === 0) {
        x = e.x
        y = e.y
      } else {
        let move_x = e.x - x
        let move_y = e.y - y
        let route_x = ((move_x / this.canvas.width) * Math.PI) / 4 / 180
        let route_y = ((move_y / this.canvas.height) * Math.PI) / 4 / 180
        this.camera.position.x += move_x / 2
        this.camera.position.y -= move_y / 2
        this.camera.rotateX(route_x)
        this.camera.rotateY(route_y)
        x = e.x
        y = e.y
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#hello {
  width: 100%;
  height: 100%;

  background: #11e8bb; /* Old browsers */
  background: -moz-linear-gradient(top, #11e8bb 0%, #8200c9 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, #11e8bb 0%, #8200c9 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #11e8bb 0%,
    #8200c9 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#11e8bb', endColorstr='#8200c9',GradientType=0 ); /* IE6-9 */
}
</style>
