<template>
  <div id="hello"></div>
</template>

<script>
import * as THREE from 'three'
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
      FAR: 1600,
      space: 1000,
      minDistance: 250, // z轴最远距离
      maxDistance: 0, // z轴最远距离
      initFinished: false, // 是否完成绘图
      nodeNumber: 80,
      maxLevel: 3
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
      this.camera.position.set(0, 0, 500) // 指定相机位置
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
      let index = 0
      for (let i = 0; i < this.maxLevel; i++) {
        await this.calc(index)
        index += this.space
      }
      this.maxDistance = index
      this.camera.position.set(0, 0, this.maxDistance / 2) // 指定相机位置
    },
    async initLevel(nodes) {
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
        this.scene.add(sphere) // 将立方体网格添加到场景中
        this.initFinished = true
      })
      //   let points = []
      //   edges.forEach(edge => {
      //     const target = nodes.find(node => node.id === edge.target.id)
      //     const source = nodes.find(node => node.id === edge.source.id)
      //     points.push(new THREE.Vector3(target.x, target.y, target.z))
      //     points.push(new THREE.Vector3(source.x, source.y, source.z))
      //   })
      //   this.initLine(points)
    },
    initLine(points) {
      const material = new THREE.LineBasicMaterial({ color: 'white' })
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
      this.renderer.render(this.scene, this.camera)
    },
    animate() {
      const vm = this
      function render() {
        requestAnimationFrame(render) // 让浏览器执行参数中的函数，不断循环（浏览器一个新的API）
        vm.renderer.render(vm.scene, vm.camera) // 结合场景和相机进行渲染，即用摄像机拍下此刻的场景
      }
      render()
    },
    async calc(dis) {
      const nodes = []
      for (let i = 0; i < this.nodeNumber; i++) {
        nodes.push({
          id: i,
          x: this.init_x(i),
          y: this.init_y(i),
          z: this.init_z(i, dis),
          radius: Math.ceil(Math.random() * 6)
        })
      }
      this.initLevel(nodes)
      console.log(nodes)
    },
    init_x(index) {
      let x = (Math.random() * this.canvas.width) / 2
      let step_1 = Math.ceil(this.nodeNumber * 0.3)
      let step_2 = Math.ceil(this.nodeNumber * 0.6)
      let step_3 = Math.ceil(this.nodeNumber * 0.8)
      if (index < step_1) {
        x *= -1
      } else if (index < step_2) {
        x *= 1
      } else if (index < step_3) {
        x *= -1
      } else {
        x *= 1
      }
      return Math.floor(x)
    },
    init_y(index) {
      let step = Math.ceil(this.nodeNumber * 0.6)
      let y = (Math.random() * this.canvas.height) / 2
      if (index < step) {
        y *= 1
      } else {
        y *= -1
      }
      return Math.floor(y)
    },
    init_z(index, dis) {
      let z = 0
      index = index & 4
      if (index === 0) {
        z = ((Math.random() * this.space) / 8) * -1 + dis - this.space / 8
      } else if (index === 1) {
        z = ((Math.random() * this.space) / 8) * -1 + dis
      } else if (index === 2) {
        z = ((Math.random() * this.space) / 8) * 1 + dis
      } else {
        z = ((Math.random() * this.space) / 8) * 1 + dis + this.space / 8
      }
      return Math.floor(z)
    }
  },
  mounted() {
    this.initScene()
    this.initCamera()
    this.initRender()
    this.initDom()
    this.animate()
    // 现在滑轮滚动的范围
    document.body.onmousewheel = e => {
      let zoom = true
      const z = this.camera.position.z
      if (z > this.maxDistance || z < this.minDistance) {
        zoom = false
      }
      if (z > this.minDistance && e.deltaY < 0) {
        zoom = true
      }
      if (z < this.minDistance && e.deltaY > 0) {
        zoom = true
      }
      if (zoom) {
        this.camera.position.z += e.deltaY
      }
    }
    let { x, y } = { x: 0, y: 0 }
    document.getElementById('hello').onmousemove = e => {
      if (!this.initFinished) return
      if (x === 0 && y === 0) {
        x = e.x
        y = e.y
      } else {
        let move_x = e.x - x
        let move_y = e.y - y
        let route_x = ((move_x / this.canvas.width) * Math.PI) / 3 / 180
        let route_y = ((move_y / this.canvas.height) * Math.PI) / 3 / 180
        this.camera.position.x += move_x / 6
        this.camera.position.y -= move_y / 6
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
