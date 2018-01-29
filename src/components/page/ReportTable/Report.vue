<template>
    <div >

        <!--@tab-click为选项卡选中时的监听事件-->
        <el-tabs v-model="activeName3" type="card" @tab-click="handleClick">
            <!--用户管理部分-->
                <el-tab-pane label="任务报表" name="first">
                    <!--用户增加按钮组件-->
                    <v-task-list></v-task-list>
                </el-tab-pane>
                <el-tab-pane  label="社群报表" name="second">
                    <!--角色列表组件-->
                    <v-group-list></v-group-list>
                </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import vTaskList from './TaskList.vue';
    import vGroupList from './CommunityList.vue';

    export default {
        data() {
            return {
                activeName3: 'first'
            };
        },
        methods: {
            //选项卡被选中时触发的事件
            handleClick(tab, event) {
//	        console.log(tab, event);
	      }
	    },
	    components:{
	    	vTaskList,vGroupList
	    }
	};
</script>

<style scoped>
    .el-dialog__body{
        padding:30px 50px 30px 25px;
    }
    .el-select{
        width:40%;
    }
    .el-tabs__content{
        overflow:visible !important;
    }

</style>
