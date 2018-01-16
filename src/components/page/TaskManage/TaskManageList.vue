<template>
    <div>
        <el-button type="primary" @click="addTask">新建投放任务</el-button>
        <div class="table">

            <div class="handle-box">
                <div>
                    <span>每页显示：</span>
                    <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                        <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                    </el-select>
                </div>
                <div>
                    <el-input v-model="select_word" placeholder="请输入用户名称" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="任务ID" width="80" sortable></el-table-column>  <!-- type="selection" -->
                <el-table-column prop="name" label="任务名称" sortable width="150">
                </el-table-column>
                <!-- <el-table-column prop="userPermi" label="投放类型" width="120">
                </el-table-column> -->
                <el-table-column prop="times" label="发送时间点" width="512">
                    <template slot-scope="scope">
                        <span>{{scope.row.times | timesTran}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="commitStatus" label="操作状态" width="100" >
                    
                    <template slot-scope="scope">
                        <span>{{scope.row.commitStatus==0?"未提交":"已提交"}}</span>
                    </template>
                    
                </el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditStatus==0">未审核</span>
                        <span v-else-if="scope.row.auditStatus==1">审核通过</span>
                        <span v-else>审核拒绝</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pushStatus" label="发布状态" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.pushStatus==0?"未发布":"已发布"}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" prop="opertion" width="400">
                    <template slot-scope="scope">
                        <el-button size="small"
                                   @click="handleRead(scope.$index, scope.row)" >查看</el-button>
                        <el-button size="small" type="danger"
                                   @click="handleUpdate(scope.$index, scope.row)" >修改</el-button>
                        <el-button size="small" type="danger"
                                   @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
                        <el-button size="small" type="danger"
                                   @click="handleSubmit(scope.$index, scope.row)" >提交任务</el-button>
                        <el-button size="small" type="danger"
                                   @click="handleUnPush(scope.$index, scope.row)" :disabled="scope.row.pushStatus==0?true:false" >取消发布</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="可用社群列表" width="130">
                    <template slot-scope="scope">
                        <el-button size="small"
                                   @click="handleEdit(scope, scope.row)" >查看</el-button>
                    </template>
                </el-table-column>

            </el-table>
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
<!-- 任务查看弹出框 -->
            <el-dialog
                :visible.sync="dialogTaskVisible"
                width="20%"
                :before-close="handleClose">
                <h3>任务{{taskRead.name}}: </h3>
                <div class="readElForm">
                    <el-form :model="taskRead" ref="taskRead" label-width="100px" >
                        <el-form-item label="任务ID:" prop="id">
                            <span>{{taskRead.id}}</span>
                        </el-form-item>
                        <el-form-item label="任务名称:" prop="name">
                            <span>{{taskRead.name}}</span>
                        </el-form-item>
                        <el-form-item label="发送时间点:" prop="times">
                            <template slot-scope="scope">
                                <span>{{taskRead.times | timesTran}}</span>
                            </template>
                        </el-form-item>
                        <el-form-item label="操作状态:" prop="commitStatus">
                            <span>{{taskRead.commitStatus==0?"未提交":"已提交"}}</span>
                        </el-form-item>
                        <el-form-item label="审核状态:" prop="auditStatus">
                                <span v-if="taskRead.auditStatus==0">未审核</span>
                                <span v-else-if="taskRead.auditStatus==1">审核通过</span>
                                <span v-else>审核拒绝</span>
                        </el-form-item>
                        <el-form-item label="发布状态:" prop="pushStatus">
                            <span>{{taskRead.pushStatus==0?"未发布":"已发布"}}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <!--弹出框的取消/保存部分-->
                <span slot="footer" class="dialog-footer">
			      <el-button type="primary" @click="readEnter()">确定</el-button>
			    </span>
            </el-dialog>
<!-- 可用社群列表弹出框 -->
            <el-dialog
                :visible.sync="dialogVisible"
                width="20%"
                :before-close="handleClose">
                <h3>任务1可发送社群及时间点: </h3>
                <el-table
                    :data="tableData3"
                    height="250"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="群ID"
                        width="380">
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="日期"
                        width="380">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="发布状态"
                    >
                    </el-table-column>

                </el-table>
                <!--弹出框的取消/保存部分-->
                <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm()">确定</el-button>
			  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 可用社群列表弹出框
                dialogVisible:false,
                // 任务查看列表弹出框
                dialogTaskVisible:false,
//              存放数据
                tableData: [],
//              当前显示第几页
                cur_page: 1,
                total:1000,
                select_per:10,
                select_word: '',
                is_search: false,
                page_sizes:[10,15,20,25,30],
                tableData3: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                // 任务查看数据
                taskRead:{}

            }
        },
        created(){
            this.getData();
        },
        computed: {
//          数据更新
            data(){
                const self = this;
                return self.tableData;
            }
        },
        watch:{
            // 监听搜索框
            select_word:function(){
                this.getData();
            }
        },
        filters:{
            timesTran:function(val){
                if(val != "undefined"){
                    if(typeof val == "string"){
                        val = JSON.parse(val)
                    }
                    if(typeof val != "undefined"){
                        return val.join(";  ");
                    }
                    
                }else{
                    return false;
                }
            }
        },
        methods: {
//          搜索
            search(){
                this.is_search = true;
                this.getData();
            },
            // 查看
            handleRead(index,row){
                this.dialogTaskVisible = true;
                let self = this;
                self.$axios.get(`/tasks/${row.id}`).then(function(res){
                    self.taskRead = res.data;
                })
            },
            readEnter(){
                this.dialogTaskVisible = false;
                this.taskRead = {};
            },
            // 修改
            handleUpdate(index, row) {
                this.$store.commit('getTaskUpdateId',row.id);
                this.$router.push("/updatetask");
            },
            // 删除
            handleDelete(index, row) {
                let self = this;
                console.log(row.id);
                this.$confirm('确定删除该任务?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    self.$axios.delete(`/tasks/${row.id}`).then(function(res){
                        if(res.status==204){
                            self.$message({
                                message: '任务删除成功！',
                                type: 'success'
                            });
                            self.getData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消任务删除'
                    });
                });
            },
            // 提交任务
            handleSubmit(index,row){
                let self = this;
                console.log(row.id);
                self.$axios.put(`/tasks/commit/${row.id}`).then(function(res){
                    console.log(res);
                    if(res.status==200&&res.data.success){
                        self.$message({
                            message: '任务提交成功！',
                            type: 'success'
                        });
                        self.getData();
                    }else{
                        self.$message({
                            message: '任务提交失败！',
                            type: 'error'
                        });
                    }
                });
            },
            // 取消发布
            handleUnPush(index,row){
                let self = this;
                
                this.$confirm('确定取消发布?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    self.$axios.put(`/tasks/unpush/${row.id}`).then(function(res){
                        console.log(res);
                        
                        if(res.status == 200){
                            self.$message({
                                message: "取消发布成功",
                                type: 'success'
                            });
                            self.getData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
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
                console.log(val);
                this.cur_page = val;
                this.getData();
            },
//          获取数据
            getData(){
                let self = this;
                self.$axios.get(`/tasks?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}`).then((res) => {
                    console.log(res,11111111111111);
                    self.total = res.data.pagination.total;
                    self.tableData = res.data.data;

                })
            },

//          选择项发生变化时会触发该事件
            handleSelectionChange(val) {
                console.log(val);
                this.multipleSelection = val;
            },
            //可用社群的确定按钮事件
            submitForm(formName){
                //将弹出框关闭
                this.dialogVisible = false;

            },
            //弹出框关闭前的确认
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
//            新建投放任务
            addTask(){
                this.$router.push("/addtask");
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
    .readElForm{
        margin-top:30px;
    }
</style>
