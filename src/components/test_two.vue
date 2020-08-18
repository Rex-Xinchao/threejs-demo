<template>
  <div id="hello"></div>
</template>

<script>
import * as THREE from 'three'
import * as d3 from 'd3'

const nodes = [
  { name: '桂林', radius: 6 },
  { name: '广州', radius: 3 },
  { name: '厦门', radius: 3 },
  { name: '杭州', radius: 4 },
  { name: '上海', radius: 6 },
  { name: '青岛', radius: 5 },
  { name: '天津', radius: 6 }
]

const edges = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 1, target: 4 },
  { source: 1, target: 5 },
  { source: 1, target: 6 }
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
      FAR: 1000,
      limit: 0
    }
  },
  props: {
    msg: String
  },
  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene()
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
      //   points.push(new THREE.Vector3(point[0], point[1], point[2]))
      //   this.initLine(points)
    },
    async initLevel(nodes, edges,dis, step) {
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
      })
      edges.forEach(edge => {
        let points = []
        let target = nodes.find(node => node.name === edge.target.name)
        let source = nodes.find(node => node.name === edge.source.name)
        points.push(new THREE.Vector3(target.x, target.y, target.z))
        points.push(new THREE.Vector3(source.x, source.y, source.z))
        this.initLine(points)
      })
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
        .force('link', d3.forceLink().distance(100))
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
    document.body.onmousewheel = e => {
      const z = this.camera.position.z
      if (z >= this.limit || z <= 500) {
        this.controls.enableZoom = false
      }
      if (z > 500 && e.deltaY < 0) {
        this.controls.enableZoom = true
      }
      if (z < 500 && e.deltaY > 0) {
        this.controls.enableZoom = true
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
