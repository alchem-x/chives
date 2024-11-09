<template>
    <RouterView />
</template>

<script setup>
import { provide } from 'vue'
import { useGUI } from '@/common/gui.js'

provide('GUI_STATE', useGUI())
</script>
