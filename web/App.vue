<template>
    <div class="app-container">
        <RouterView />
    </div>
</template>

<script setup>
import { provide } from 'vue'
import { useGUI } from '#web/common/gui.js'

provide('GUI_STATE', useGUI())
</script>

<style scoped lang="less">
.app-container {
    box-sizing: border-box;
    max-width: 800px;
    min-height: 100vh;
    margin: 0 auto;
}
</style>