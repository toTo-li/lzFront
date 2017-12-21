<template>
    <div class="table">
        <div class="handle-box">
            <div>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            </div>

            <div>
                <el-select v-model="select_per" placeholder="10" class="handle-select mr10">
                    <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="download" @click="search">下载</el-button>
            </div>

        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="date" label="任务ID" width="120"></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="address" label="任务名称" sortable >
            </el-table-column>
            <el-table-column prop="address" label="社群ID"  width="120">
            </el-table-column>
            <el-table-column prop="address" label="社群名称" >
            </el-table-column>
            <el-table-column prop="address" label="群人数"  width="120">
            </el-table-column>
            <el-table-column prop="name" label="发布次数" width="120">
            </el-table-column>
            <el-table-column prop="name" label="曝光数" width="120">
            </el-table-column>
            <el-table-column prop="name" label="点击数" width="120">
            </el-table-column>
        </el-table>
        <!--<el-button type="primary" icon="delete" class="handle-del mr10 butMargin" @click="delAll">批量删除</el-button>-->
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
//              每页显示条数
                select_per:10,
//              查找关键字
                select_word: '',
                del_list: [],
//              搜索关键字
                is_search: false,
//              设置每页显示的条数
                page_sizes:[10,15,20,25,30]

            }
        },
        created(){
            this.getData();
        },
        computed: {
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
                        if(d.address.indexOf(self.select_cate) > -1 &&
                            (d.name.indexOf(self.select_word) > -1 ||
                                d.address.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            pageSizeChange(val){

                this.select_per = val;
            },
            handleCurrentChange(val){

                this.cur_page = val;
                this.getData();
            },
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
            search(){
                this.is_search = true;
            },
            handleSelectionChange(val) {
                console.log(val);
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
