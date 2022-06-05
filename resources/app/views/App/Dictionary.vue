<template>
    <router-view :key="$route.name"></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Dictionary extends Vue {

}
</script>
