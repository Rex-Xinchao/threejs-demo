<template>
  <div id="canvas">
    <div id="info">Description</div>
  </div>
</template>

<script>
import * as THREE from 'three'
// import * as TWEEN from 'tween'
import calc from '../mixins/calc'
import mouseEvent from '../mixins/mouseEvent'
import forShow from '../mixins/forShow'

export default {
  name: 'HelloWorld',
  data() {
    return {
      canvas: {
        width: window.innerWidth,
        height: window.innerHeight - 4
      },
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      FOV: 45,
      NEAR: 0.01,
      FAR: 1600,
      space: 1000,
      minDistance: 250, // z轴最远距离
      maxDistance: 0, // z轴最远距离
      initFinished: false, // 是否完成绘图
      maxLevel: 3,
      nodes: []
    }
  },
  mixins: [calc, mouseEvent, forShow],
  props: {
    msg: String
  },
  methods: {
    init() {
      // 创建场景
      this.scene = new THREE.Scene()
      // 创建透视相机
      const proportion = this.canvas.width / this.canvas.height
      this.camera = new THREE.PerspectiveCamera(this.FOV, proportion, this.NEAR, this.FAR)
      this.camera.position.set(0, 0, 500) // 指定相机位置
      // 设置渲染器
      this.renderer = new THREE.WebGLRenderer({
        alpha: true, // 设置为透明，这样会使用父元素的背景图片
        precision: 'highp', // 高画质
        antialias: true // 抗锯齿
      })
      this.renderer.setSize(this.canvas.width, this.canvas.height)
      document.getElementById('canvas').appendChild(this.renderer.domElement)
    },
    async initLevel() {
      let z = 0
      for (let i = 0; i < this.maxLevel; i++) {
        let nodes = await this.calc(z)
        this.initDom(nodes)
        z += this.space
      }
      this.maxDistance = z
      // 指定相机位置，深度为中间层的位置
      this.createTestNode(this.maxDistance / 2)
      this.camera.position.set(0, 0, this.maxDistance / 2 + 250)
    },
    async initDom(nodes) {
      this.nodes = this.nodes.concat(nodes)
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
        sphere.position.x = node.x
        sphere.position.y = node.y
        sphere.position.z = node.z
        this.initFont(node)
        this.scene.add(sphere) // 将立方体网格添加到场景中
        this.initFinished = true
      })
    },
    initLine(links) {
      let points = []
      links.forEach(link => {
        const target = link.target
        const source = link.source
        let len = Math.floor(Math.sqrt((Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2))))
        let x = target.x - (target.radius / len) * (target.x - source.x)
        let y = target.y - (target.radius / len) * (target.y - source.y)
        points.push(new THREE.Vector3(x, y, target.z))
        points.push(new THREE.Vector3(source.x, source.y, source.z))
      })
      const material = new THREE.LineBasicMaterial({ color: 'white' })
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
      this.renderer.render(this.scene, this.camera)
    },
    animate() {
      const render = () => {
        requestAnimationFrame(render) // 让浏览器执行参数中的函数，不断循环（浏览器一个新的API）
        this.renderer.render(this.scene, this.camera) // 结合场景和相机进行渲染，即用摄像机拍下此刻的场景
      }
      render()
    },
    initFont(node) {
      if (!node.id) return
      let width = this.strlen(node.id)
      let width2 = Math.ceil(width / 4)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = 32
      canvas.style = 'width: ' + Math.ceil(width / 4) + 'px; height: 8px;'
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'black'
      //fillText("要添加的文字",x0坐标，y0坐标)
      ctx.font = "32px '微软雅黑'"
      ctx.fillText(node.id, 0, 28)
      const texture = new THREE.CanvasTexture(canvas)
      const geometry = new THREE.PlaneGeometry(width2, 8)
      const material = new THREE.MeshPhongMaterial({
        map: texture, // 设置纹理贴图
        color: 'white',
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = node.x + node.radius + width2 / 2 + 2
      mesh.position.y = node.y
      mesh.position.z = node.z
      this.scene.add(mesh)
    },
    strlen(str) {
      str = String(str)
      let len = 0
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i)
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++
        } else {
          len += 2
        }
      }
      return len * 32
    }
  },
  mounted() {
    this.init()
    this.initLevel()
    this.animate()
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
#canvas {
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
#info {
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  display: block;
}
</style>
