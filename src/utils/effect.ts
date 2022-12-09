import * as THREE from 'three'

export default {
    surroundLineGeometry(object: THREE.BufferGeometry) {
        return new THREE.EdgesGeometry(object)
    }
}