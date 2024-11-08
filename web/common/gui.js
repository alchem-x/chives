import GUI from 'lil-gui'
import { shallowRef, reactive, onMounted, onBeforeUnmount } from 'vue'

const TOKEN_KEY = 'cw_token'

export function getTokenFromStorage() {
    return localStorage.getItem(TOKEN_KEY) ?? ''
}

function setTokenToStorage(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Call once when app bootstrap
 * 
 * @returns state
 */
export function useGUI() {
    const gui = shallowRef()
    const state = reactive({
        token: '',
    })

    function createGui() {
        gui.value = new GUI()
        gui.value.add(state, 'token').onChange((ev) => {
            setTokenToStorage(ev)
        })
        gui.value.close()
    }

    function resurrectState() {
        state.token = getTokenFromStorage()
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