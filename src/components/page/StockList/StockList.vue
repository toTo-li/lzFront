<template>
    <div class="table">
        <el-button type="primary" >同步社群信息</el-button>
        <div class="handle-box">
            <div>
                <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                    <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                </el-select>
            </div>
            <div>
                <el-input v-model="select_word" placeholder="请输入社群名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" >
            <el-table-column prop="id" label="社群ID" sortable width="320">
            </el-table-column>
            <el-table-column prop="name" label="社群名称" >
            </el-table-column>
            <el-table-column prop="memberCount" label="群人数" width="200">
            </el-table-column>
            <el-table-column prop="name" label="可用库存" width="120">
                <template slot-scope="scope">
                    <el-button size="small"  @click="handleEdit(scope.index, scope.row)" >查看</el-button>
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
            :visible.sync="dialogVisible"
            width="20%"
            :before-close="handleClose"
            >
            <h3>社群ID: <span>{{currentId}}</span></h3>
            <el-table
                :data="tableData3"
                height="250"
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="日期"
                    width="380">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="时间段"
                    >
                </el-table-column>

            </el-table>
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
                page_sizes:[10,15,20,25,30],
                // 总数
                total:0,
                // 可用库存
                tableData3: [],
                // 当前库存id
                currentId:""

            }
        },
        created(){
//          实例创建完后获取数据
            this.getData();
        },
        watch:{
//          监听搜索框
            select_word:function(){
                this.getData();
            }
        },
        computed: {
//          数据过滤筛选
            data(){
                const self = this;
                return self.tableData;
            }
        },
        methods: {
//          获取数据的方法
            getData(){
                let self = this;
                self.$axios.get(`/groups?per_page=${self.select_per}&page=${self.cur_page}&search=${self.select_word}`).then((res) => {
                    self.total = res.data.pagination.total;
                    self.tableData = res.data.data;
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
            handleEdit(index,row){
                this.dialogVisible = true;
                let self = this;
                self.currentId = row.id;
                self.$axios.get(`/groups/times?gid=${row.id}`).then((res) => {
                    self.tableData3 = res.data;
                })
            },
//          弹出框确定事件
            submitForm(){
                this.dialogVisible = false;
            },
//          弹出框关闭前的确认
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
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
</style>
