import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useWatchQuery(store, keyList = []) {
    const router = useRouter()
    const route = useRoute()
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