import { createRouter, createWebHistory } from 'vue-router'
import { withProvider } from '#web/common/providers.jsx'

const Index = () => import('./pages/Index.vue')
const StockApp = () => import('./pages/Stock/StockApp.vue').then(({ default: C }) => withProvider(C))
const WatchApp = () => import('./pages/Watch/WatchApp.vue').then(({ default: C }) => withProvider(C))
const NotFound = () => import('./common/NotFound.vue')

export function createAppRouter() {
    return createRouter({
        history: createWebHistory(),
        routes: [
            { name: 'Index', path: '/', component: Index, },
            { name: 'Stock', path: '/stock', component: StockApp, },
            { name: 'Watch', path: '/watch', component: WatchApp, },
            { path: '/:pathMatch(.*)*', component: NotFound }
        ],
    })
}
