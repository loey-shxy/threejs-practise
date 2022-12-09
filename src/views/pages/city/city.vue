<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, onMounted } from 'vue' 
import type { Ref } from 'vue'

let canvasDom: Ref = ref(null)
let scene: THREE.Scene
let group: THREE.Group
let camera: THREE.PerspectiveCamera
let textureLoader: THREE.TextureLoader
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animateId: number

onMounted(() => {
    init()
})

const init = () => {
    scene = new THREE.Scene()
    group = new THREE.Group()
    textureLoader = new THREE.TextureLoader()

    // 环境光
    const envLight: THREE.AmbientLight = new THREE.AmbientLight(0xadadad)
    group.add(envLight)

    // 平行光源
    const dirLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(100, 100, 0)
    group.add(dirLight)


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(1200, 700, 121)
    camera.lookAt(scene.position)
    group.add(camera)
    
    scene.add(group)
    renderer = new THREE.WebGLRenderer({ canvas: canvasDom.value, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(new THREE.Color('#32373E'), 1)
    // canvasDom.value.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true 

    render()
}

const render = () => {
    animateId = requestAnimationFrame(render)
    renderer.render(scene, camera)
    controls.update()
}

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
</script>
<template >
    <canvas class="canvas" ref="canvasDom"></canvas>
</template>
