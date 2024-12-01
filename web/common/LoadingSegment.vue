<template>
    <div class="loading-segment">
        <img :src="'/images/loading-coin.svg'" alt="">
    </div>
</template>

<style scoped lang="less">
.loading-segment {
    height: 100%;
    display: grid;
    position: absolute;
    inset: 0;
    place-items: center;
    background-color: #fff;
    z-index: 2;

    img {
        user-select: none;
    }
}
</style>