<template>
    <div class="table">

        <el-button type="primary" @click="">同步社群信息</el-button>
        <div class="handle-box">
            <div>
                <el-select v-model="select_per" placeholder="10" class="handle-select mr10">
                    <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                </el-select>
            </div>

            <div>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>

        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="date" label="ID" width="120"></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="address" label="社群ID" sortable >
            </el-table-column>
            <el-table-column prop="name" label="社群名称" width="120">
            </el-table-column>
            <el-table-column prop="name" label="群人数" width="120">
            </el-table-column>
            <el-table-column prop="name" label="可用库存" width="120">
                <template slot-scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope.index, scope.row)" >查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器-->
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                @size-change="pageSizeChange"
                layout="sizes,prev, pager, next"
                :total="1000"
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
            <h3>社群ID: <span>11</span></h3>
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
                    prop="name"
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
                url: './static/vuetable.json',
//              存放数据
                tableData: [],
//              当前显示第几页
                cur_page: 1,
//              多选
                multipleSelection: [],
//
                select_cate: '',
//              每页显示条数
                select_per:10,
//              查找关键字
                select_word: '',
                del_list: [],
//              搜索关键字
                is_search: false,
//              设置每页显示的条数
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
                }]

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
            }
        },
        methods: {
//            获取数据的方法
            getData(){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
//                    self.url = '/ms/table/list';
                    self.url = '/static/vuetable.json';
                };
                self.$axios.get(self.url, {page:self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
//          每页显示数改变触发
            pageSizeChange(val){
                this.select_per = val;
            },
//          分页器切换改变
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
//          搜索事件
            search(){
                this.is_search = true;
            },
//          多选事件
            handleSelectionChange(val) {
                console.log(val);
                this.multipleSelection = val;
            },
//          查看
            handleEdit(index,row){
                this.dialogVisible = true;
                console.log(row);
            },
//          弹出框确定事件
            submitForm(){
                this.dialogVisible = false;
            },
            //弹出框关闭前的确认
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
