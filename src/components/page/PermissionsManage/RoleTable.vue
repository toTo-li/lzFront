<template>
    <div class="table">
        <div class="handle-box">
                <div>
                    <span>每页显示：</span>
                    <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                        <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                    </el-select>
                </div>

                <div>
                    <el-input v-model="select_word" placeholder="角色ID或名称搜索" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>

        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="角色ID" width="120" ></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="name" label="角色名称"  width="150">
            </el-table-column>
            <el-table-column prop="menus" label="角色权限" >
            </el-table-column>
            <!--<el-table-column prop="address" label="关联账号" :formatter="formatter" width="250">
            </el-table-column>-->
            <el-table-column label="操作" prop="opertion" width="300">
                <template slot-scope="scope" >
                    <el-button size="small"
                               @click="handleEdit(scope.$index, scope.row)" >查看</el-button>
                    <el-button size="small" type="danger"
                               @click="handleUpdate(scope.$index, scope.row)" v-if="scope.row.id!=1">修改</el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.id!=1">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <!--<el-button type="primary" icon="delete" class="handle-del mr10 butMargin" @click="delAll">批量删除</el-button>-->
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                @size-change="pageSizeChange"
                layout="prev, pager, next"
                :total="total"
                :page-size="select_per"
                :page-sizes="page_sizes"
                >
            </el-pagination>
        </div>
        <!--
            添加和修改后刷新列表的解决方法：
                利用Vuex的状态的改变，然后使用计算属性监听状态的变化，实现跨组件调用方法。

            目前还没有想到更好的方式，先这样实现功能把！
         -->
        <div v-show="false">{{refresh}}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_per:10,
                select_word: '',
                del_list: [],
                is_search: false,
                page_sizes:[5,10,15,20,30],
                total:1
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData;
            },
            // 添加修改后表格的刷新
            refresh(){
                this.getData();
                return this.$store.state.fresh;
            }
        },
        methods: {
            //          每页显示条数事件
            selectChange(val){
                this.pageSizeChange(val);
            },
            pageSizeChange(val){
                console.log(val);
                this.select_per = val;
                this.getData();
            },
            handleCurrentChange(val){
                console.log(val);
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                /*
                id:1
                menuIds:null
                menus:"任务管理,任务管理,任务管理,库存查看,库存查看,库存查看,任务审核,任务审核,任务审核,报表,报表,报表,权限管理,用户管理,角色管理"
                name:"栗子云管理员"
                remarks:"管理员内置"

                */
                self.$axios.get(`/roles?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}`).then((res) => {
                    self.total = res.data.pagination.total;
                    self.tableData = res.data.data;
                })
            },
            search(){
                this.is_search = true;
                this.getData();
            },
            // 查看角色信息
            handleEdit(index, row) {
                let self = this;
                this.$axios.get(`/roles/${row.id}`).then(function(res){
                    if(res.status == 200){
                        self.$store.commit("roleDialog",{roleDialogNum:2,flag:true});
                        self.$store.commit('readRoles',res.data);
                    }else{
                        return false;
                    }
                });
            },
            // 修改信息
            handleUpdate(index, row){
                let self = this;
                this.$axios.get(`/roles/${row.id}`).then(function(res){
                    if(res.status == 200){
                        self.$store.commit('readRoles',res.data);
                        self.$store.commit("roleDialog",{roleDialogNum:3,flag:true,updateRoleId:row.id});
                    }else{
                        return false;
                    }
                });
            },
            // 删除
            handleDelete(index, row) {
                let self = this;
                this.$confirm('确定删除该角色?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    self.$axios.delete(`/roles/${row.id}`).then(function(res){
                        if(res.status == 200 || res.status == 204){
                            self.$message({
                                message: '删除角色成功！',
                                type: 'success'
                            });
                            self.getData();
                        }else{
                            return false;
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消角色删除'
                    });
                });
            },
//          选择项发生变化时会触发该事件
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>
    .table{
        margin-top:10px;
    }
    .handle-box{
        margin-bottom: 5px;
        display:flex;
        justify-content:space-between;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
    /*分页*/
    .pagination{
        float:right;
        margin:5px 0px;
    }
    .butMargin{
        margin:5px 0px;
    }



</style>
