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
                    <span>提交状态：</span>
                    <el-select v-model="opertion_state" class="handle-select mr10" @change="operStaChange">
                        <el-option v-for="(item,index) in opertion_states"  :key="index" :label="item" :value="index-1">{{item}}</el-option>
                    </el-select>
                    <span>审核状态：</span>
                    <el-select v-model="audit_state" class="handle-select mr10" @change="auditStaChange">
                        <el-option v-for="(item,index) in audit_states"  :key="index" :label="item" :value="index-1">{{item}}</el-option>
                    </el-select>
                    <span>发布状态：</span>
                    <el-select v-model="publish_state" class="handle-select mr10" @change="pubStaChange">
                        <el-option v-for="(item,index) in publish_states"  :key="index" :label="item" :value="index-1">{{item}}</el-option>
                    </el-select>

                    <el-input v-model="select_word" placeholder="任务ID或名称搜索" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="任务ID" width="100" ></el-table-column>  <!-- type="selection" -->
                <el-table-column prop="name" label="任务名称"  width="180">
                </el-table-column>
                <!-- <el-table-column prop="userPermi" label="投放类型" width="120">
                </el-table-column> -->
                <el-table-column prop="times" label="发送时间点" >
                    <template slot-scope="scope">
                        <span>{{scope.row.times | timesTran}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="commitStatus" label="提交状态" width="100" >

                    <template slot-scope="scope">
                        <span>{{scope.row.commitStatus==0?"未提交":(scope.row.commitStatus==1?"已提交":"提交中")}}</span>
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
                                   @click="handleSubmit(scope.$index, scope.row)" >{{scope.row.commitStatus==2?"任务提交中":"提交任务"}}</el-button>
                        <el-button size="small" type="danger"
                                   @click="handleUnPush(scope.$index, scope.row)"  >取消发布</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="占用的社群列表" width="150">
                    <template slot-scope="scope">
                        <el-button size="small"
                                   @click="handleUsed(scope, scope.row)" >查看</el-button>
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
                        <el-form-item label="提交状态:" prop="commitStatus">
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
                :before-close="handleClose"
                >
                <h3>任务{{usedId}}占用社群及时间点: </h3>
                <el-table
                    :data="tableData3"
                    height="250"
                    style="width: 100%"
                    v-if="usedFlag"
                    >
                    <el-table-column
                        prop="groupId"
                        label="群ID"
                        width="380">
                    </el-table-column>
                    <el-table-column
                        prop="execTime"
                        label="日期"
                        width="380">
                    </el-table-column>
                    <el-table-column
                        prop="mark"
                        label="发布状态"
                    >
                        <template slot-scope="scope">
                                <span v-if="scope.row.mark==1">已发布</span>
                                <span v-else>未发布</span>
                        </template>

                    </el-table-column>

                </el-table>
                <h1 v-else :class="{usedGroupNo:true}">尚未占用社群</h1>
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
                total:1,
                select_per:10,
                select_word: '',
                is_search: false,
                page_sizes:[10,15,20,25,30],
                opertion_states:["全部","未提交","已提交"],
                opertion_state:-1,
                audit_states:["全部","未审核","审核通过"],
                audit_state:-1,
                publish_states:["全部","未发布","已发布"],
                publish_state:-1,
                // 占用的社群的数据
                tableData3: [],
                // 占用的社群ID
                usedId:"",
                // 是否有占用社群
                usedFlag:true,
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
                if(val && val.length!=0){
                    let t = val.filter(function(item){
                        return item!="NaN-0NaN-0NaN 0NaN:0NaN:0NaN";
                    });
                    return t.join('; ');
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
                this.dialogTaskVisible = false;
                let self = this;
                self.$store.commit('getTaskReadId',row.id);
                // this.$router.push("/updatetask");
                self.$router.push({
                        path: 'readtask',
                        query: {redirect: this.$router.currentRoute.fullPath}
                })
            },
            readEnter(){
                this.dialogTaskVisible = false;
                this.taskRead = {};
            },
            // 修改
            handleUpdate(index, row) {
                this.$store.commit('getTaskUpdateId',row.id);
                // this.$router.push("/updatetask");
                this.$router.push({
                        path: 'updatetask',
                        query: {redirect: this.$router.currentRoute.fullPath}
                    })
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
                    if(res.status==200){
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
            // 占用的社群列表
            handleUsed(index,row){
                let self = this;
                self.usedId = row.id;
                self.$axios.get(`/tasks/used/${row.id}`).then(function(res){
                    console.log(res);
                    if(res.status==200){
                        self.dialogVisible = true;
                        if(res.data.length==0){
                            self.usedFlag = false;
                        }else{
                            self.usedFlag = true;
                            self.tableData3 = res.data;
                        }
                    }
                });
            },
//          每页显示条数事件
            selectChange(val){
                this.pageSizeChange(val);
            },


            operStaChange(val){
                this.getData();
            },
            auditStaChange(val){
                this.getData();
            },
            pubStaChange(val){
                this.getData();
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

                self.$axios.get(`/tasks?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}&commit=${this.opertion_state}&push=${this.publish_state}&audit=${this.audit_state}`).then((res) => {
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
                        done();
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
        min-width: 1400px;
    }
    .handle-box{
        margin-bottom: 5px;
        display:flex;
        justify-content:space-between;
        min-width: 1400px;
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
    .usedGroupNo{
        text-align: center;
        color:red;
    }
</style>
