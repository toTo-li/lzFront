<template>
    <div class="table">
        <!--<div class="crumbs">-->
            <!--<el-breadcrumb separator="/">-->
                <!--<el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>-->
                <!--<el-breadcrumb-item>基础表格</el-breadcrumb-item>-->
            <!--</el-breadcrumb>-->
        <!--</div>-->
        <div class="handle-box">
                <div>
                    <span>每页显示：</span>
                    <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                        <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                    </el-select>
                </div>
                <div>
                    <el-input v-model="select_word" placeholder="请输入用户名" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" >
            <el-table-column prop="id" label="用户ID" width="80" sortable></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="name" label="用户名" sortable width="150">
            </el-table-column>
            <el-table-column prop="roleName" label="角色权限" >
            </el-table-column>
            <el-table-column prop="contactName" label="关联账号"  width="450">
            </el-table-column>
            <el-table-column label="操作" prop="opertion" width="320">
                <template slot-scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope, scope.row)" >查看</el-button>
                    <el-button size="small" type="danger"
                               @click="handleUpdate(scope.$index, scope.row)" >修改</el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
                    <template v-if="scope.row.status==0">
                       <el-button size="small" type="danger"
                               @click="handleStop(scope.$index, scope.row)" >暂停</el-button>
                    </template>           
                    <template v-else>
                       <el-button size="small" type="danger"
                               @click="handleStop(scope.$index, scope.row)" >启用</el-button>
                    </template>  
                    
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">启用</span>
                    <span v-else>暂停</span>
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
//              存放数据
                tableData: [],
//              当前显示第几页
                cur_page: 1,
//              多选
                multipleSelection: [],
//
                select_cate: '',
                total:1000,
                select_per:5,
                select_word: '',
                del_list: [],
                is_search: false,
                page_sizes:[5,15,20,25,30]

            }
        },
        watch:{
            select_word:function(){
                this.getData();
            }
        },
        created(){
            this.getData();
        },
        computed: {
//          数据更新
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(self.select_word==""||d.name.indexOf(self.select_word) > -1){
                            return d;
                        }
                    }
                })
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
            //          每页显示条数
            pageSizeChange(val){
                this.select_per = val;
                this.getData();
            },
            //          分页按钮
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },

            //          获取数据
            getData(){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.url = '/static/vuetable.json';
                };
                /*

                contactName: "栗子云"
                email: "admin@thextrader.cn"
                id: 1
                name: "admin"
                remarks: "管理员用户"
                roleName: "栗子云管理员"
                status: 0
                
                */ 
                if(self.$store.state.token){
                    self.$axios.get(`/users?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}`).then((res) => {
                        self.total = res.data.pagination.total;
                        self.tableData = res.data.data;
                     })
                }else{
                    return false;
                }
                
            },
//          搜索
            search(){
                this.is_search = true;
                this.getData();
            },
            // 查看用户信息
            handleEdit(index, row) {
                
                let self = this;
                this.$axios.get(`/users/${row.id}`).then(function(res){
                    if(res.status == 200){
                        self.$store.commit('readUsers',res.data);
                        self.$store.commit("userDialog",{userDialogNum:2,flag:true});
                    }else{
                        return false;
                    }
                });
            },
            // 修改信息
            handleUpdate(index, row){
                let self = this;
                this.$axios.get(`/users/${row.id}`).then(function(res){
                    if(res.status == 200){
                        self.$store.commit('readUsers',res.data);
                        self.$store.commit("userDialog",{userDialogNum:3,flag:true,updateId:row.id});
                    }else{
                        return false;
                    }
                });
                
            },
            // 删除
            handleDelete(index, row) {
                let self = this;
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        self.$axios.delete(`/users/${row.id}`).then(function(res){
                            if(res.status == 200 || res.status == 204){
                                // self.$store.commit('readUsers',res.data);
                                // self.$store.commit("userDialog",{userDialogNum:3,flag:true});
                                self.$message({
                                    message: '删除用户成功！',
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
                            message: '已取消删除'
                        });
                });
            },
            // 冻结
            handleStop(index, row){
                if(row.status==0){
                    /*
                        未冻结，启用状态，调用冻结接口
                        /users/frozen/{id}
                    */ 
                    var self = this;
                    self.$confirm('确定冻结该用户?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        self.$axios.put(`/users/frozen/${row.id}`).then(function(res){
                            if(res.status==200){
                                self.getData();
                                self.$message({
                                    type: 'success',
                                    message: '冻结成功!'
                                });
                            }
                        });
                    }).catch(() => {
                        self.$message({
                            type: 'info',
                            message: '已取消冻结'
                        });
                    });
                }else{
                    /*
                        冻结，未启用状态，调用解除冻结接口
                        /users/unfroze/{id}
                    */
                    var self = this;
                    this.$confirm('是否启用该用户?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        self.$axios.put(`/users/unfrozen/${row.id}`).then(function(res){
                            if(res.status==200){
                                self.getData();
                                self.$message({
                                    type: 'success',
                                    message: '启用成功!'
                                });
                            }
                            
                        });
                        
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消解除冻结'
                        });
                    });

                }
            },
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
