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
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="任务ID" width="80"></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="name" label="任务名称" sortable width="150">
            </el-table-column>
            <el-table-column prop="userPermi" label="投放类型" width="120">
            </el-table-column>
            <el-table-column prop="userPermi" label="发送时间点" width="240">
            </el-table-column>
            <el-table-column prop="userPermi" label="操作状态" width="120">
            </el-table-column>
            <el-table-column prop="userPermi" label="审核状态" width="120">
            </el-table-column>
            <!--<el-table-column prop="relateCount" label="关联账号" :formatter="formatter" width="250">-->
                <!--<template slot-scope="scope">-->
                    <!--<span v-for="item in scope.row.relateCount">{{item}}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" prop="opertion">
                <template slot-scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope, scope.row)" v-if="scope.row.opertion.read">查看</el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.opertion.update">修改</el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.opertion.delete">删除</el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.opertion.stop">暂停</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="可用社群列表" width="120">
                <template slot-scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope, scope.row)" >查看</el-button>
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
</template>

<script>
    export default {
        data() {
            return {
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
                total:1000,
                select_per:10,
                select_word: '',
                del_list: [],
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
                }]

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
            }
        },
        methods: {
            //          每页显示条数事件
            selectChange(val){
                this.pageSizeChange(val);
            },
            //          每页显示条数
            pageSizeChange(val){
                console.log(val);
                this.select_per = val;
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
                if(process.env.NODE_ENV === 'development'){
//                    self.url = '/ms/table/list';
                    self.url = '/static/vuetable.json';
                };
                /*
                *
                *  {
                *     cur_page：cur_page,
                *     select_per：select_per，
                *     total:total
                *  }
                *
                *   "total": 100,
                    "per_page": 5,
                    "current_page": 1,
                    "last_page": 1,
                    "from": 1,
                    "to": 10
                * */
                self.$axios.get("https://www.easy-mock.com/mock/5a2f6f336ce8af6869ec349d/example/user").then((res) => {
                    console.log(res);
                    self.tableData = res.data.data;
                })
            },
//          搜索
            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.dialogVisible = true;
                console.log(index);
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
//          多选删除
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
//          选择项发生变化时会触发该事件
            handleSelectionChange(val) {
                console.log(val);
                this.multipleSelection = val;
            },
            //添加用户的保存事件
            submitForm(formName){
                //将弹出框关闭
                this.dialogVisible = false;
                //关闭后将数据提交

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
