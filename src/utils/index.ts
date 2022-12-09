import type { Material } from "three"

export default {
    forMaterial(materials: Material[] | Material, callback: Function) {
        if (!callback || !materials) return false
        if (Array.isArray(materials)) {
            materials.forEach((mat: Material) => {
                callback(mat)
            })
        } else {
            callback(materials)
        }
    }
}