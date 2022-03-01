<template>
    <div id="app"
         style="flex-direction: column;display: flex;height: 100vh">
        <div class="flex-1">
            <router-view/>
        </div>
    </div>
</template>

<script>


    export default {
        name: 'App',
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
        },
    }
</script>

<style>
    body {
        font: normal 100% Helvetica, Arial, sans-serif;
        margin: 0;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }
</style>
