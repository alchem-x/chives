import { watch } from 'vue'
import { useRouter, route } from 'vue-router'

export function useWatchQuery(store, keyList = []) {
    const router = useRouter()
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