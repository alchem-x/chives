<template>
    <RouterView />
</template>

<script setup>
import { provide } from 'vue'
import { useGUI } from './common/gui'

provide('GUI_STATE', useGUI())
</script>
