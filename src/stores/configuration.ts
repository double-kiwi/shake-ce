import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum AdjustType {
    REPLACE,
    TOGGLE,
    APPEND,
}

export const useConfigurationStore = defineStore('configuration', () => {
    const configuration = ref<Record<string, string[]>>({})

    function set(key: string, value: string[], type: AdjustType) {
        const current = configuration.value[key] ?? []

        if (type === AdjustType.REPLACE) {
            update(key, [...value])
            return
        }

        if (type === AdjustType.TOGGLE) {
            let next = [...current]
            for (const item of value) {
                const index = next.indexOf(item)
                if (index === -1) {
                    next.push(item)
                } else {
                    next = next.filter((_, i) => i !== index)
                }
            }
            update(key, next)
            return
        }

        if (type === AdjustType.APPEND) {
            const next = [...current]
            for (const item of value) {
                if (!next.includes(item)) {
                    next.push(item)
                }
            }
            update(key, next)
        }
    }

    function update(key: string, value: string[]) {
        configuration.value = {
            ...configuration.value,
            [key]: value,
        }
    }

    /** Replace the entire selection map (preset seed). */
    function hydrate(map: Record<string, string[]>) {
        const next: Record<string, string[]> = {}
        for (const [key, values] of Object.entries(map)) {
            next[key] = [...values]
        }
        configuration.value = next
    }

    return { configuration, set, hydrate }
})
