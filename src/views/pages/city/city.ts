import * as THREE from 'three'
import FBXLoader from 'three/examples/jsm/loaders/FBXLoader'
import Effect from '@/utils/effect'
import Shader from '@/utils/shader'
import Utils from '@/utils/index'

import ResourceTracker from '@/utils/track-resource'
import type { Time } from '@/interface/interface'
const resMgr: ResourceTracker = new ResourceTracker()
const track = resMgr.track.bind(resMgr)

const radarData = [
    {
        position: { x: 666, y: 22, z: 0 },
        radius: 150,
        color: '#ff0062',
        opacity: 0.5,
        speed: 2
    },
    {
        position: { x: -666, y: 25, z: 202 },
        radius: 320,
        color: '#efad35',
        opacity: 0.6,
        speed: 1
    }
]

const wallData = [{
    position: {
        x: -150,
        y: 15,
        z: 100
    },
    speed: 0.5,
    color: '#efad35',
    opacity: 0.6,
    radius: 420,
    height: 120,
    renderOrder: 5
}]

class City {
    fbxLoader: THREE.Loader
    group: THREE.Group
    effectGroup: THREE.Group
    surroundLineMaterial: THREE.Material | null
    time: Time
    startTime: Time
    isStart: boolean

    constructor() {
        this.fbxLoader = new FBXLoader()
        this.group = new THREE.Group()
        this.effectGroup = new THREE.Group()

        this.group.add(this.effectGroup)

        this.surroundLineMaterial = null
        this.time = { value: 0 }
        this.startTime = { value: 0 }
        this.isStart = false

        const cityArray: Array<String> = ['CITY_UNTRIANGULATED']
        const floorArray: Array<String> = ['LANDMASS']


    }

    async loadFbx(url: string): Promise<THREE.Event> {
        return new Promise((resolve, reject) => {
            try {
                this.fbxLoader.loadAsync(url, (obj: THREE.Event) => {
                    resolve(obj)
                })
            } catch(e: any) {
                reject(e)
            }
        })
    }

    init() {
        setTimeout(() => {
            this.isStart = true
        })
    }

    setFloor(object: THREE.Mesh) {
        Utils.forMaterial(object.material, (material: THREE.Mesh) => {
            material.color.setStyle('#040912')
        })
    }
}