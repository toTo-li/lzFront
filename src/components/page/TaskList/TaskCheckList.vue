<template>
    <div class="table">

        <!--<el-button type="primary" @click="">同步社群信息</el-button>-->
        <div class="handle-box">
            <div>
                <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                    <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                </el-select>
            </div>

            <div>
                <el-input v-model="select_word" placeholder="任务ID或名称搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>

        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" >
            <el-table-column prop="id" label="任务ID"  width="100">
            </el-table-column>
            <el-table-column prop="name" label="任务名称" width="240">
            </el-table-column>
            <el-table-column prop="times" label="发送时间点">
                <template slot-scope="scope">
                    <span>{{scope.row.times | timesTran}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="280">
                <template slot-scope="scope">
                    <el-button size="small"
                               @click="handleRead(scope.index, scope.row)" >查看</el-button>
                    <el-button size="small" type="danger"
                               @click="handleAuditAndPush(scope.$index, scope.row)" :disabled="scope.row.auditStatus==0?false:true">审核通过并发布</el-button>
                    <!-- <el-button size="small" type="danger"
                               @click="handleNoAudit(scope.$index, scope.row)">审核拒绝</el-button> -->
                </template>
            </el-table-column>
            <el-table-column prop="auditStatus" label="状态" width="140">
                <template slot-scope="scope">
                        <span v-if="scope.row.auditStatus==0">未审核</span>
                        <span v-else-if="scope.row.auditStatus==1">审核通过</span>
                        <span v-else>审核拒绝</span>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器-->
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
        <!--查看弹出框-->
        <el-dialog
            width="30%"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            >
            <el-form  label-width="100px">
                <el-form-item label="任务名称:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="描述:">
                    <span>asasas</span>
                </el-form-item>

                <el-form-item label="标签:">
                    <span>asasas</span>
                </el-form-item>

                <el-form-item label="发送时间:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="物料:" >

                </el-form-item>
                <el-form-item label="发送时间:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="投放类型:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="文字:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="图片预览:" >
                    <img src="####" alt="">
                </el-form-item>
                <el-form-item label="物料URL:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="是否@ALL:" >
                    <span>asasas</span>
                </el-form-item>
                <el-form-item label="期望曝光人数:" >
                    <span>asasas</span>
                </el-form-item>

            </el-form>
            <!--弹出框的取消/保存部分-->
            <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm()">确定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
//              是否显示弹出框
                dialogVisible:false,
                url: './static/vuetable.json',
//              存放数据
                tableData: [],
//              当前显示第几页
                cur_page: 1,
//              每页显示条数
                select_per:10,
//              查找关键字
                select_word: '',
//              搜索关键字
                is_search: false,
//              设置每页显示的条数
                page_sizes:[5,10,15,20,25,30],
                total:1
            }
        },
        created(){
//          实例创建完后获取数据
            this.getData();
        },
        computed: {
//          数据过滤筛选
            data(){
                const self = this;
                return self.tableData;
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
        watch:{
            select_word:function(){
                this.getData();
            }
        },
        methods: {
//            获取数据的方法
            getData(){
                let self = this;
                self.$axios.get(`/tasks/beAudited?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}`).then((res) => {
                    console.log(res);
                    if(res.status == 200){
                        self.tableData = res.data.data;
                        self.total = res.data.pagination.total;
                    }
                })
            },
//          每页显示条数事件
            selectChange(val){
                this.pageSizeChange(val);
            },
//          每页显示数改变触发
            pageSizeChange(val){
                this.select_per = val;
                this.getData();
            },
//          分页器切换改变
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
//          搜索事件
            search(){
                this.is_search = true;
                this.getData();
            },

//          查看
            handleRead(index,row){
               this.$store.commit('getTaskUpdateId',row.id);
               this.$router.push('/taskcheckread');
            },
            // 审核通过并发布
            handleAuditAndPush(index,row){
                let self = this;

                this.$confirm('确定审核通过并发布?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    self.$axios.put(`/tasks/audit/${row.id}`).then(function(res){
                        console.log(res);
                        if(res.status == 200){
                            self.$message({
                                message: "审核通过并发布",
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
//          弹出框确定事件
            submitForm(){
                this.dialogVisible = false;
            },
            //弹出框关闭前的确认
            handleClose(done) {

            }

        }
    }
</script>

<style scoped>
    .table{
        margin-top:10px;
        overflow:hidden;
        *zoom:1;
    }
    .handle-box{

        margin: 10px 0px 5px 0px;
        display:flex;
        justify-content:space-between;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 150px;
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
    .el-dialog--small{
        width:30% !important;
    }
</style>
