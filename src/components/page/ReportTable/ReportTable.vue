<template>
    <div>
        <v-task-list></v-task-list>
        <v-community-list></v-community-list>
    </div>
</template>

<script>
    import vCommunityList from './CommunityList.vue';
    import vTaskList from './TaskList.vue';
    export default {
        components:{
            vCommunityList,
            vTaskList
        }
    }
</script>

<style>
</style>
