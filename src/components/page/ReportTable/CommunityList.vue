<template>
    <div class="table">
        <div class="handle-box">
            <template>
                <div style="width: 320px;">
                    <datepicker range v-model="date_range" language="ch"></datepicker>
                </div>
            </template>

            <div>
                <el-select v-model="select_per" placeholder="10" class="handle-select mr10" @change="selectChange">
                    <el-option v-for="(item,index) in page_sizes"  :key="index" :label="item" :value="item">{{item}}</el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="任务ID或名称、社群ID或名称搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary"  @click="download">下载</el-button> 
            </div>

        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change="sortFun">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column prop="taskId" label="任务ID" width="120" ></el-table-column>  <!-- type="selection" -->
            <el-table-column prop="taskName" label="任务名称"  >
            </el-table-column>
            <el-table-column prop="groupId" label="社群ID"  width="220">
            </el-table-column>
            <el-table-column prop="groupName" label="社群名称" >
            </el-table-column>
            <el-table-column prop="groupCount" label="群人数"  width="120" sortable="custom">
            </el-table-column>
            <el-table-column prop="pm" label="曝光数" width="120" sortable="custom">
            </el-table-column>
            <el-table-column prop="cm" label="点击数" width="120" sortable="custom">
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
    </div>
</template>

<script>

import datepicker from 'vue-date'
import {formatDate} from '../../common/dateFormat.js'

var start=new Date();
start.setDate(start.getDate()-1);
start.setHours(0,0,0);

var end=new Date();
end.setDate(end.getDate()-1);
end.setHours(23,59,59);

// end.setDate(start.getDate()+1);


    export default {
        data() {
            return {
//              存放数据
                tableData: [],
//              当前显示第几页
                cur_page: 1,
//              每页显示条数
                select_per:10,
//              查找关键字
                select_word: '',
//              搜索关键字（暂时没用）
                is_search: false,
//              设置每页显示的条数
                page_sizes:[10,15,20,25,30],
                // 总条数
                total:1,
                date_range: [formatDate(start, "yyyy-MM-dd"),formatDate(end, "yyyy-MM-dd")],
                multipleSelection:[]

            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData;
            }
        },
        components: { datepicker },

        watch:{
//          监听搜索框
            select_word:function(){
                this.getData();
            },
            date_range:function(){
                this.getData();
            }
        },
        methods: {
            //          每页显示条数事件
            selectChange(val){
                this.pageSizeChange(val);
            },
            pageSizeChange(val){
                this.select_per = val;
                this.getData();
            },
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                self.$axios.get(`/reports/group?per_page=${this.select_per}&page=${this.cur_page}&search=${this.select_word}&startTime=${this.date_range[0].split("-").join("")}&endTime=${this.date_range[1].split("-").join("")}`).then((res) => {
                    console.log(res);
                    self.tableData = res.data.data;
                    self.total = res.data.pagination.total==0?1:res.data.pagination.total;
                })
            },
            search(){
                this.is_search = true;
                this.getData();
            },
            // 下载
            download(){
                console.log("下载按钮");
            },
            // 多选
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            sortFun({column, prop, order}){
                console.log(column);
                console.log(prop);
                console.log(order);
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
