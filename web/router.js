import { createRouter, createWebHistory } from 'vue-router'
import { withProvider } from '#web/common/providers.jsx'

const Index = () => import('./pages/Index.vue')
const Stock = () => import('./pages/Stock/Stock.vue').then(({ default: C }) => withProvider(C))
const Watch = () => import('./pages/Watch/Watch.vue').then(({ default: C }) => withProvider(C))
const NotFound = () => import('./common/NotFound.vue')

export function createAppRouter() {
    return createRouter({
        history: createWebHistory(),
        routes: [
            { name: 'Index', path: '/', component: Index, },
            { name: 'Stock', path: '/stock', component: Stock, },
            { name: 'Watch', path: '/watch', component: Watch, },
            { path: '/:pathMatch(.*)*', component: NotFound }
        ],
    })
}
