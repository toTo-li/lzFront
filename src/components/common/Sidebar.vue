<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: 'basetable',
                        title: '任务管理'
                    },
                    {
                        icon: 'el-icon-date',
                        index: 'baseform',
                        title: '库存查看'
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: 'basecharts',
                        title: '任务审核'
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: 'drag',
                        title: '报表',
                        subs: [
                            {
                                index: 'tasktable',
                                title: '任务报表'
                            },
                            {
                                index: 'groupstable',
                                title: '社群报表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: 'manage',
                        title: '权限管理'
                    }
                ],
                created(){
                    this.getMenus();
                },
                methods:{
                    contains(arr, obj) {
                        var i = arr.length;
                        while (i--) {
                            if (arr[i] === obj) {
                                return true;
                            }
                        }
                        return false;
                    },
                    getMenus(){
                        let self = this;
                        let taskId =  self.$store.state.taskUpdateId;
                        let menusStr = "";
                        if(localStorage){
                            menusStr =  localStorage.getItem('menus');
                        }
                        let menus =menusStr.split(",");
                        if(contains(menus,"任务管理")){
                            self.items.push({
                                icon: 'el-icon-menu',
                                index: 'basetable',
                                title: '任务管理'
                            })
                        };
                        if(contains(menus,"库存查看")){
                            self.items.push({
                                icon: 'el-icon-date',
                                index: 'baseform',
                                title: '库存查看'
                            })
                        };
                        if(contains(menus,"任务审核")){
                            self.items.push({
                                icon: 'el-icon-star-on',
                                index: 'basecharts',
                                title: '任务审核'
                            })
                        };
                        if(contains(menus,"报表")){
                            self.items.push({
                                icon: 'el-icon-upload2',
                                index: 'drag',
                                title: '报表',
                                subs: [
                                    {
                                        index: 'tasktable',
                                        title: '任务报表'
                                    },
                                    {
                                        index: 'groupstable',
                                        title: '社群报表'
                                    }
                                ]
                            })
                        };
                        if(contains(menus,"权限管理")){
                            self.items.push({
                                icon: 'el-icon-menu',
                                index: 'manage',
                                title: '权限管理'
                            })
                        };
                    }
                }




            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
