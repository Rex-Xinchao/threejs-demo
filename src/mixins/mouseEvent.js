import * as THREE from 'three'
export default {
  data() {
    return {}
  },
  mounted() {
    // 滑轮事件
    document.body.onmousewheel = (e) => {
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
    // 滑动事件
    document.getElementById('canvas').onmousemove = (e) => {
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

    // 点击事件
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const onMouseClick = (event) => {
      //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, this.camera)

      // 获取raycaster直线和所有模型相交的数组集合
      const intersects = raycaster.intersectObjects(this.scene.children)

      console.log(intersects)

      //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
      this.scene.children.forEach(item => {
        item.material.color.set('white')
      })
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material.color.set(0xff0000)
      }
    }

    window.addEventListener('click', onMouseClick, false)
  }
}
