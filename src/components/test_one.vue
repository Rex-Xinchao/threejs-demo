<template>
  <div class="hello"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    initSquare(scene, camera, renderer) {
      var geometry = new THREE.BoxGeometry()
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      var cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      camera.position.z = 5

      function animate() {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()
    },
    initLine(scene, camera, renderer) {
      // camera.position.set(0, 10, 10)
      // camera.lookAt(0, 5, 0)
      var points = []
      points.push(new THREE.Vector3(-1, 1, 0))
      points.push(new THREE.Vector3(0, 2, 0))
      points.push(new THREE.Vector3(1, 1, 0))
      var linematerial = new THREE.LineBasicMaterial({ color: 0x0000ff })
      var linegeometry = new THREE.BufferGeometry().setFromPoints(points)
      var line = new THREE.Line(linegeometry, linematerial)
      scene.add(line)
      renderer.render(scene, camera)
    },
    initText(scene, camera, renderer) {
      console.log(scene, camera, renderer)
    }
  },
  mounted() {
    var scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 1, 1000)

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.125)
    dirLight.position.set(0, 0, 1).normalize()
    scene.add(dirLight)

    var pointLight = new THREE.PointLight(0xffffff, 1.5)
    pointLight.position.set(0, 100, 90)
    scene.add(pointLight)

    var group = new THREE.Group()
    group.position.y = 100

    scene.add(group)

    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    // var renderer = new THREE.WebGLRenderer({ antialias: true })
    // renderer.setPixelRatio(window.devicePixelRatio)
    // renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    this.initSquare(scene, camera, renderer)
    this.initLine(scene, camera, renderer)
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
</style>
