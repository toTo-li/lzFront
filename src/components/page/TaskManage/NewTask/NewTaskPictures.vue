<template>
    <div>
        <el-form  label-width="110px" :rules="rules" :model="ruleForm" ref="ruleForm" >
            <el-form-item label="任务名称:" prop="name">
                <el-input  placeholder="请输入内容" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述:" prop="description">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="ruleForm.description"
                   >
                </el-input>
            </el-form-item>
            <el-form-item label="标签:" prop="tagNames">
                <el-input  placeholder="请输入内容" v-model="ruleForm.tagNames"></el-input>
            </el-form-item>
            <el-form-item label="发送时间:" prop="time">
                <el-date-picker
                    v-model="ruleForm.time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>


            <el-form-item >
                <el-card class="box-card" v-for="(item,index) in cWuliao" :key="index" >
                    <div slot="header" class="clearfix">
                        <span>卡片名称</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="close(index)">X</el-button>
                    </div>
                    <div class="text item">

                    </div>
                </el-card>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="addWuLiao()">添加物料</el-button>

            </el-form-item>

            <el-form-item label="物料:" prop="name">
            </el-form-item>
            <el-form-item label="投放类型:" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择">
                    <el-option
                        v-for="item in ruleForm.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="落地页:" prop="showPage">
                <el-input  placeholder="请输入内容" v-model="ruleForm.showPage"></el-input>
            </el-form-item>
            <el-form-item label="文字:" prop="showPageDesc">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="ruleForm.showPageDesc"
                ></el-input>
            </el-form-item>
            <el-form-item label="图片预览:" >
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="ruleForm.dialogVisible" size="tiny">
                    <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="物料URL:" prop="wlUrl">
                <el-input  placeholder="请输入内容" v-model="ruleForm.wlUrl"></el-input>
            </el-form-item>





            <el-form-item label="是否@ALL:" prop="flag">
                <el-select v-model="ruleForm.flag" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="期望曝光人数:" prop="hopeNums">
                <el-input  placeholder="请输入内容" v-model="ruleForm.hopeNums"></el-input>
            </el-form-item>
            <el-form-item  >
                <el-button type="primary" @click="submitForm()">确定</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        data(){
            return{
                ruleForm:{
                    name:"",
                    description:"",
                    tagNames:"",
                    type:"",
                    showPage:"",
                    showPageDesc:"",
                    pics:"",
                    wlUrl:"",
//                  时间
                    time:"",
//                  是否全部投放
                    flag:"",
                    hopeNums:"",
                    options:[
                        {label:'文字图片',value:'文字图片'},
                        {label:'卡片式链接',value:'卡片式链接'},
                        {label:'小程序',value:'小程序'}
                     ],
//                  图片预览
                    dialogImageUrl: '',
                    dialogVisible: false,

                },
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入活动描述', trigger: 'blur' }
                    ],
                    tagNames:[
                        { required: true, message: '请输入标签', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择一个投放类型', trigger: 'blur' }
                    ],
                    time: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
                    ],
                    showPage: [
                        { required: true, message: '落地页不能为空', trigger: 'blur' }
                    ],
                    showPageDesc:[
                        { required: true, message: '落地页描述不能为空', trigger: 'blur' }
                    ],
                    pics:[
                        { required: true, message: '请选择图片', trigger: 'blur' }
                    ],
                    wlUrl:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    flag:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    hopeNums:[
                        { required: true, message: '请填写曝光数', trigger: 'blur' }
                    ]
                },
                wuliaos:[
                    {
                        wls:{value:111}
                    },
                    {
                        wls:{value:222}
                    },
                    {
                        wls:{value:333}
                    }
                ],
                cWuliao:[]

            }
        },
        methods:{
            submitForm(){

                this.$emit('submitClose');
            },
//            图片预览
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.ruleForm.dialogImageUrl = file.url;
                this.ruleForm.dialogVisible = true;
            },
//            添加物料
            addWuLiao(){
                this.cWuliao = this.wuliaos;
            },
//            删除物料
            close(a){
                this.cWuliao = this.cWuliao.filter(function(item,index){
                    return index!=a;
                });
            }
        }
    }
</script>

<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 500px;
        margin-bottom:20px;
    }
    .box-card:last-child{
        margin-bottom:0px;
    }
</style>
