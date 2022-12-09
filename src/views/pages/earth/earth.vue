<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue'
import ResourceTracker from '@/utils/track-resource'

// 地球和月球半径大小
const EARTH_RADIUS = 2.5
const MOON_RADIUS = 0.27

const resMgr: ResourceTracker = new ResourceTracker()
const track = resMgr.track.bind(resMgr)

let containerDom: Ref = ref(null)
let scene: THREE.Scene
let moon: THREE.Mesh
let moonLabel: CSS2DObject
let earth: THREE.Mesh
let earthLabel: CSS2DObject
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let labelRenderer: CSS2DRenderer
let controls: OrbitControls
let textureLoader: THREE.TextureLoader
const clock: THREE.Clock = new THREE.Clock()
let oldTime = 0
let animateId = 0
onMounted(() => {
    init()
})
onUnmounted(() => {
    clearScene()
})

const clearScene = () => {
    // 清除3D对象
    try {
        scene.clear()
        controls.dispose()
        camera.clear()
        resMgr && resMgr.dispose()
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
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000)
    
    camera.position.set(10, 5, 20)
    textureLoader = track(new THREE.TextureLoader())

    // 聚光灯光源
    const dirLight: THREE.SpotLight = track(new THREE.SpotLight(0xffffff))
    dirLight.position.set(0, 0, 10)
    // 亮度强度
    dirLight.intensity = 2
    // 阴影
    dirLight.castShadow = true
    scene.add(dirLight)

    // 环境光
    const aLight: THREE.AmbientLight = track(new THREE.AmbientLight(0xcccccc))
    aLight.intensity = 0.3
    scene.add(aLight)

    // 创建月球
    const moonGeometry: THREE.SphereGeometry = track(new THREE.SphereGeometry(MOON_RADIUS, 16, 16))
    const moonMaterial: THREE.MeshPhongMaterial = track(new THREE.MeshPhongMaterial({
        map: textureLoader.load('textures/planets/moon_1024.jpg')
    }))
    moon = track(new THREE.Mesh(moonGeometry, moonMaterial))
    moon.receiveShadow = true
    moon.castShadow = true
    scene.add(moon)

    // 创建月球标签
    const moonDiv: HTMLDivElement = document.createElement('div')
    moonDiv.className = 'label'
    moonDiv.textContent = 'Moon'
    moonLabel = track(new CSS2DObject(moonDiv))
    moonLabel.position.set(0, MOON_RADIUS + 0.5, 0)
    moon.add(moonLabel)

    // 创建地球
    const earthGeometry: THREE.SphereGeometry = track(new THREE.SphereGeometry(EARTH_RADIUS, 16, 16))
    const earthMaterial: THREE.MeshPhongMaterial = track(new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load('textures/planets/earth_atmos_2048.jpg'),
        specularMap: textureLoader.load('textures/planets/earth_specular_2048.jpg'),
        normalMap: textureLoader.load('textures/planets/earth_normal_2048.jpg')
    }))
    earth = track(new THREE.Mesh(earthGeometry, earthMaterial))
    earth.receiveShadow = true
    earth.castShadow = true
    scene.add(earth)

    // 创建地球标签
    const earthDiv: HTMLDivElement = document.createElement('div')
    earthDiv.className = 'label'
    earthDiv.textContent = 'Earth'
    earthLabel = track(new CSS2DObject(earthDiv))
    earthLabel.position.set(0, EARTH_RADIUS + 0.5, 0)
    earth.add(earthLabel)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio) // 设置像素比
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 渲染阴影
    renderer.shadowMap.enabled = true
    containerDom.value.appendChild(renderer.domElement)

    labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.color = '#fff';
    labelRenderer.domElement.style.top = '0';
    document.body.appendChild(labelRenderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    console.log(renderer.info)
    animate()
}

const animate = () => {
    const elapsed = clock.getElapsedTime()
    // 月球公转
    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)

    // 地球自转
    let axis: THREE.Vector3 = track(new THREE.Vector3(0, 1, 0))
    earth.rotateOnAxis(axis, (elapsed - oldTime) * Math.PI / 10)

    renderer.render(scene, camera)
    labelRenderer.render(scene, camera)
    oldTime = elapsed
    controls.update()
    animateId = requestAnimationFrame(animate)

}

window.addEventListener('resize', e => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
</script>
<template>
    <div class="container" ref="containerDom"></div>
</template>
<style scoped lang="scss">
.container {
    background-image: url('images/star.jpg');
    background-size: cover;
}
.label {
    color: #fff;
    font-size: 16px;
}
</style>