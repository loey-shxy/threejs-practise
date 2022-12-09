<template>
    <div>
        <header>
            <nav>
                <!-- <RouterLink :to="{name: 'vr-house-viewing'}">VR 看房</RouterLink> -->
                <RouterLink :to="{name: 'earth'}">地月环绕</RouterLink>
                <!-- <RouterLink :to="{name: 'city'}">智慧城市</RouterLink> -->
            </nav>
        </header>

        <RouterView />
    </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
<style scoped lang="scss">
header {
    line-height: 4em;
    height: 4em;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.5);
}
a {
    font-size: 16px;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    height: 4em;
    padding: 0 40px;
    display: inline-block;
    &.router-link-active,
    &:hover {
        color: #000;
        background-color: rgba(255, 255, 255, 0.5);
    }
}
</style>