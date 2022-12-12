<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue'

let containerDom: Ref = ref(null)
let scene: THREE.Scene
let group: THREE.Group
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animateId: number

onMounted(() => {
    init()
})

onUnmounted(() => {
    clearScene()
})

const clearScene = () => {
    try {
        scene.remove(group)
        scene.clear()
        controls.dispose()
        camera.clear()
        renderer.dispose()
        renderer.forceContextLoss()
        cancelAnimationFrame(animateId)

        console.log(renderer.info)
    } catch (e) {
        console.log(e)
    }
}

const init = () => {
    scene = new THREE.Scene()
    group = new THREE.Group
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        0.1,
        100000
    )
    camera.position.set(0, 0, 10)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerDom.value.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true 

    const rgbeLoader: RGBELoader = new RGBELoader()
    rgbeLoader.load('images/house.hdr', texture => {
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
            map: texture
        })
        const sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(10, 32, 32)
        const sphere: THREE.Mesh = new THREE.Mesh(sphereGeometry, material)
        sphere.geometry.scale(1, 1, -1)
        group.add(sphere)
    })

    scene.add(group)
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
}

</script>
<template>
    <div class="container" id="canvas" ref="containerDom">
    </div>
</template>