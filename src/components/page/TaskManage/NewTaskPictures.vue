<template xmlns="">
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
                    <el-card class="box-card"  v-for="(item,index) in ruleForm.wl" :key="item.key"  >
                        <div slot="header" class="clearfix">
                            <span>物料{{index+1}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="close(index)">X</el-button>
                        </div>
                        <div class="text item">
                            <el-form-item label="投放类型:">
                                <el-select v-model="item.type" placeholder="请选择">
                                    <el-option
                                        v-for="iType in item.options"
                                        :key="iType.value"
                                        :label="iType.label"
                                        :value="iType.value">

                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <template v-if="item.type=='小程序'">
                                <el-form-item label="页面路径:">
                                    <el-input  placeholder="请输入内容" v-model="item.miniPro.pagePath"></el-input>
                                </el-form-item>
                                <el-form-item label="标题:">
                                    <el-input  placeholder="请输入内容" v-model="item.miniPro.title"></el-input>
                                </el-form-item>
                                <el-form-item label="描述文件:">
                                    <el-button>上传</el-button>
                                </el-form-item>
                                <el-form-item label="上传图片">
                                    <el-button>上传图片</el-button>
                                </el-form-item>
                                <el-form-item label="图片预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item>
                                <el-form-item label="图片URl:">
                                    <span>http://element-cn.eleme.io/static/hamburger.50e4091.png</span>
                                </el-form-item>
                                <el-form-item>
                                    <el-button>预览</el-button>
                                </el-form-item>
                                <el-form-item label="预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item>
                            </template>
                            <template v-else-if="item.type=='卡片式链接'">
                                <el-form-item label="标题:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.title"></el-input>
                                </el-form-item>
                                <el-form-item label="内容:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.content"></el-input>
                                </el-form-item>
                                <el-form-item label="上传图片">
                                    <el-button>上传图片</el-button>
                                </el-form-item>
                                <el-form-item label="图片预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item>
                                <el-form-item label="图片URl:">
                                    <span>http://element-cn.eleme.io/static/hamburger.50e4091.png</span>
                                </el-form-item>
                                <el-form-item label="落地页:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.showPage"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button>预览</el-button>
                                </el-form-item>
                                <el-form-item label="预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="落地页:">
                                    <el-input  placeholder="请输入内容" v-model="item.wordPic.showPage"></el-input>
                                </el-form-item>
                                <el-form-item label="文字:">
                                    <el-input  placeholder="请输入内容" v-model="item.wordPic.showPageDesc"></el-input>
                                </el-form-item>
                                <el-form-item label="上传图片">
                                    <el-button>上传图片</el-button>
                                </el-form-item>
                                <el-form-item label="图片预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item>
                                <el-form-item label="图片URl:">
                                    <span>http://element-cn.eleme.io/static/hamburger.50e4091.png</span>
                                </el-form-item>
                                <el-form-item>
                                    <el-button>添加图片</el-button>
                                </el-form-item>
                                <el-form-item label="发送顺序:">
                                    <el-select v-model="item.wordPic.order" placeholder="请选择">
                                        <el-option
                                            v-for="iType in item.wordPic.orderBy"
                                            :key="iType.value"
                                            :label="iType.label"
                                            :value="iType.value">

                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </div>
                    </el-card>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="addWuLiao()">添加物料</el-button>
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
//                    任务名称
                    name:"",
//                    任务描述
                    description:"",
//                    标签
                    tagNames:"",
//                    时间
                    time:"",
//                    添加物料
                    wl:[],
//                    是否全部投放
                    flag:"",
//                    期望曝光人数
                    hopeNums:"",

                },
//                默认投放类型
                seleType:"文字图片",
//                校验规则
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
                        { required: true, trigger: 'blur' }
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
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
//            添加物料
            addWuLiao(){
                var w = {
//                    默认投放类型
                    type:"文字图片",
//                    投放类型
                    options:[
                        {label:'文字图片',value:'文字图片'},
                        {label:'卡片式链接',value:'卡片式链接'},
                        {label:'小程序',value:'小程序'}
                    ],
//                     key值
                    key:Date.now(),

//                    小程序
                    miniPro:{
//                        页面路径
                        pagePath:"",
//                        标题
                        title:"",
//                        描述文件
                        desFile:"",
//                        缩略图
                        thumbnailPic:[]

                    },
//                    卡片式链接
                    cardLink:{
//                      标题
                        title:"",
//                      内容
                        content:"",
//                      图片
                        pics:[],
//                      图片预览
                        dialogImageUrl: '',
                        dialogVisible: false,
//                      落地页
                        showPage:""
                    },
//                    文字图片
                    wordPic:{
//                      落地页
                        showPage:"",
//                      落地页描述
                        showPageDesc:"",
//                      图片
                        pics:[],
//                      图片预览
                        dialogImageUrl: '',
                        dialogVisible: false,
//                      默认发送方式
                        order:"",
//                      发送顺序
                        orderBy:[
                            {label:'文字优先',value:'文字优先'},
                            {label:'图片优先',value:'图片优先'}
                        ]
                    },
                }
                this.ruleForm.wl.push(w);
                console.log(this.ruleForm);
            },
//            删除物料
            close(a){
                this.ruleForm.wl = this.ruleForm.wl.filter(function(item,index){
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
        margin-left:10px;
        float: left;
    }
    .box-card:last-child{
        margin-bottom:0px;
    }
    .el-form-item .el-form-item{
        margin-bottom:20px
    }
    .el-form-item .el-form-item .el-form-item__content{
        margin-left:110px !important;
    }

</style>
