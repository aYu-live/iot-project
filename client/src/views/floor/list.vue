<template>
{{route}}
</template>
<script setup>
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const route = useRoute();
onBeforeRouteUpdate((to, from) => {
    to.meta.label = `第${to.params.floorId}楼`
})
</script>