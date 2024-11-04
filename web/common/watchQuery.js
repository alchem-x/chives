import { watch } from 'vue'

export function useWatchQuery(store, keyList = []) {
    for (const key of keyList) {
        watch(() => store[key], (value) => {
            if (route.query[key] !== value) {
                router.push({
                    query: {
                        ...route.query,
                        [key]: value,
                    }
                })
            }
        })
    }
}