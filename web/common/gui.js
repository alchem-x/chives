import GUI from 'lil-gui'
import { shallowRef, reactive, onMounted, onBeforeUnmount } from 'vue'

const TOKEN_KEY = 'cw_token'
const BARK_API_KEY = 'cw_bark_api'

export function getTokenFromStorage() {
    return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function useGUI() {
    const gui = shallowRef()
    const state = reactive({
        token: '',
        barkAPI: '',
    })

    function createGui() {
        gui.value = new GUI()
        gui.value.add(state, 'token').onChange((ev) => {
            localStorage.setItem(TOKEN_KEY, ev)
        })
        gui.value.add(state, 'barkAPI').onChange((ev) => {
            localStorage.setItem(BARK_API_KEY, ev)
        })
        gui.value.close()
    }

    function resurrectState() {
        state.token = localStorage.getItem(TOKEN_KEY) ?? ''
        state.barkAPI = localStorage.getItem(BARK_API_KEY) ?? ''
    }

    function destroyGui() {
        if (gui.value) {
            gui.value.destroy()
            gui.value = null
        }
    }

    onMounted(async () => {
        resurrectState()
        createGui()
    })

    onBeforeUnmount(() => {
        destroyGui()
    })

    return state
}