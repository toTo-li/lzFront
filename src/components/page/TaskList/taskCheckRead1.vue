<template xmlns="">
    <div>
        <el-button type="primary" :style="{'margin-bottom':'20px'}" @click="back">返回任务审核列表</el-button>
        <el-form  label-width="110px" :rules="rules" :model="ruleForm" ref="ruleForm" >
            <el-form-item label="任务名称:" prop="name">
                <el-input  placeholder="请输入内容" v-model="ruleForm.name" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="描述:" prop="desc">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="ruleForm.desc"
                    :readonly="true"
                   >
                </el-input>
            </el-form-item>
            <el-form-item label="标签:" prop="tags">
                <el-input  placeholder="请输入内容" v-model="ruleForm.tags" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="发送时间:" prop="times">
                <template v-for="(item,index) in ruleForm.times" >
                    <el-date-picker
                        v-model="item.time"
                        type="datetime"
                        placeholder="选择日期时间"
                        :key="index"
                        :name="index"
                        :readonly="true"
                        >
                    </el-date-picker>
                    
                </template>
                <!-- <el-button @click="addTimes" :readonly="true">添加时间</el-button> -->
            </el-form-item>

            <el-form-item label="物料:">
                    <el-card class="box-card"  v-for="(item,index) in ruleForm.materials" :key="index"  >
                        <div slot="header" class="clearfix">
                            <span>物料{{index+1}}</span>
                            <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="close(index)" :readonly="true">X</el-button> -->
                        </div>
                        <div class="text item">
                            <el-form-item label="投放类型:">
                                <!-- <el-select v-model="item.type" placeholder="请选择" :readonly="true">
                                    <el-option
                                        v-for="iType in ruleForm.options"
                                        :key="iType.value"
                                        :label="iType.label"
                                        :value="iType.value">
                                    </el-option>
                                </el-select> -->
                                <el-input  placeholder="请输入内容" v-model="item.type" :readonly="true"></el-input>
                            </el-form-item>

                            <template v-if="item.type=='小程序'||item.type==2">
                                <el-form-item label="标题:" :rules="{required:true}">
                                    <el-input  placeholder="请输入内容" v-model="item.app.title" :readonly="true"></el-input>
                                </el-form-item>
                                <el-form-item label="页面路径:">
                                    <el-input  placeholder="请输入内容" v-model="item.app.pagePath" :readonly="true"></el-input>
                                </el-form-item>
                                
                                <!-- <el-form-item label="描述文件:">
                                    <el-button :readonly="true">上传</el-button>
                                </el-form-item> -->
                                <!-- <el-form-item label="上传图片">
                                    <el-upload
                                        class="upload-demo"
                                        action="http://test.cactus.thextrader.cn/api/V1/publishers/uploadCertificate"
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove"
                                        :file-list="fileList1"
                                        :on-success="(res)=>{handleSuccess(res,item,index)}"
                                        list-type="picture"
                                        :show-file-list="false"
                                        name="file"
                                        
                                       > -->
                                        <!-- <el-button size="small" type="primary" :readonly="true">点击上传</el-button> -->
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    <!-- </el-upload>
                                </el-form-item> -->
                                <template  >
                                    <div v-for="(i,index) in item.app.pics" :key="index" v-if="i.fileType != 'text'">
                                            <el-form-item label="图片预览:">
                                                <img :src="i.filePath" alt="" :style="{width:'200px'}" >
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i.filePath}}</p>
                                            </el-form-item> 
                                     </div>
                                </template>
                                <el-form-item>
                                    <!-- <el-button @click="previewApp(item.app)" :readonly="true">预览</el-button> -->
                                </el-form-item>
                                <el-form-item class="preview" v-if="item.app.appPre">
                                    <el-card class="box-card" v-for="(o,index) in item.app.pics" :key="index">
                                        <div class="text item1" >
                                            <div class="first">
                                                <h2 style="width:100%">{{item.app.title}}</h2>
                                                <!-- <p style="width:100%">{{item.app.content}}</p> -->
                                            </div>
                                            <div class="last">
                                                <img :src="o.filePath" alt="">
                                            </div>
                                        </div>
                                    </el-card>
                                </el-form-item>
                                <!-- <el-form-item label="预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item> -->
                            </template>
                            <template v-else-if="item.type=='卡片式链接'||item.type==1">
                                <el-form-item label="标题:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.title" :readonly="true"></el-input>
                                </el-form-item>
                                <el-form-item label="内容:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.content" :readonly="true"></el-input>
                                </el-form-item>
                                <!-- <el-form-item label="上传图片:">
                                   <el-upload
                                        class="upload-demo"
                                        action="http://test.cactus.thextrader.cn/api/V1/publishers/uploadCertificate"
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove"
                                        :file-list="fileList2"
                                        :on-success="(res)=>{handleSuccess(res,item,index)}"
                                        list-type="picture"
                                        :show-file-list="false"
                                        name="file"
                                        > -->
                                        <!-- <el-button size="small" type="primary" :readonly="true">点击上传</el-button> -->
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    <!-- </el-upload>
                                </el-form-item> -->
                               <template  >
                                    <div v-for="(i,index) in item.cardLink.pics" :key="index" v-if="i.fileType != 'text'">
                                            <el-form-item label="图片预览:">
                                                <img :src="i.filePath" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i.filePath}}</p>
                                            </el-form-item> 
                                     </div>
                                   
                                </template>
                                <el-form-item label="落地页:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.landingPage" :readonly="true"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <!-- <el-button @click="previewCardLink(item.cardLink)" :readonly="true">预览</el-button> -->
                                </el-form-item>
                                <el-form-item class="preview" v-if="item.cardLink.cardLinkPre">
                                    <el-card class="box-card" v-for="(o,index) in item.cardLink.pics" :key="index">
                                        <div class="text item">
                                            <div class="first">
                                                <h2 style="width:100%">{{item.cardLink.title}}</h2>
                                                <p style="width:100%">{{item.cardLink.content}}</p>
                                            </div>
                                            <div class="last">
                                                <img :src="o.filePath" alt="">
                                            </div>
                                        </div>
                                    </el-card>
                                </el-form-item>
                               
                                <!-- <el-form-item label="预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item> -->
                            </template>
                             <template v-else-if="item.type=='文字'||item.type==0">
                                <el-form-item label="文字:">
                                    <el-input  row="2" type="textarea" placeholder="请输入内容" v-model="item.word.landingPageDesc" :readonly="true"></el-input>
                                </el-form-item>
                                <el-form-item
                                    v-for="(landpage,index) in item.word.landingPage"
                                    :label="'落地页' + (index+1)"
                                    :key="index"
                                    >
                                    <el-input :class="{landPageW:true}" placeholder="请输入内容" :readonly="true" :value="landpage"></el-input>
                                    <!-- <el-button v-if="index+1==item.word.landingPage.length" @click="addLandPage(item.word)">+</el-button>
                                    <el-button v-if="index+1==item.word.landingPage.length" @click="delLandPage(item.word)">-</el-button> -->
                                </el-form-item>
                            </template>
                            <template v-else>
                                <!-- <el-form-item label="上传图片:">
                                   <el-upload
                                        class="upload-demo"
                                        action="http://test.cactus.thextrader.cn/api/V1/publishers/uploadCertificate"
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove"
                                        :on-success="(res)=>{handleSuccess(res,item,index)}"
                                        :file-list="fileList3"
                                        list-type="picture"
                                        name="file"
                                        :show-file-list="false"
                                        > -->
                                        <!-- <el-button size="small" type="primary" :readonly="true">点击上传</el-button> -->
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    <!-- </el-upload>
                                </el-form-item> -->
                                <template  >
                                    <div v-for="(i,index) in item.pic.pics" :key="index">
                                            <el-form-item label="图片预览:">
                                                <img :src="i.filePath" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i.filePath}}</p>
                                            </el-form-item> 
                                     </div>
                                </template>
                            </template>
                        </div>
                    </el-card>
            </el-form-item>
            <el-form-item >
                <!-- <el-button type="primary" @click="addWuLiao()" :readonly="true">添加物料</el-button> -->
            </el-form-item>
            <el-form-item label="是否@ALL:" prop="all">
                <!-- <el-select v-model="ruleForm.all" placeholder="请选择" :readonly="true">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                </el-select> -->
                <el-input   v-model="ruleForm.all" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="期望曝光人数:" prop="hope">
                <el-input  placeholder="请输入内容" v-model="ruleForm.hope" :readonly="true"></el-input>
            </el-form-item>
            <!-- <el-form-item  >
                <el-button type="primary" @click="submitForm()">确定</el-button>
            </el-form-item> -->
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
                    desc:"",
//                    标签
                    tags:"",
//                    时间
                    times:[{
                        time:Date.now()
                    }],
                    options:[
                            {label:'文字',value:0},
                            {label:'卡片式链接',value:1},
                            {label:'小程序',value:2},
                            {label:'图片',value:3}
                    ],
//                    添加物料
                    materials:[{
                        type:0,
                        key:Date.now(),
                        app:{
                            pagePath:"",
                            content:"",
                            title:"",
                            fileType:"",
                            desFile:"",
                            pics:[],
                            appPre:false
                        },
                        cardLink:{
                            title:"",
                            content:"",
                            fileType:"",
                            pics:[],
                            landingPage:"",
                            cardLinkPre:false
                        },
                        word:{
                            landingPage:"",
                            landingPageDesc:""
                        },
                        pic:{
                            fileType:"",
                            pics:[]
                        }
                    }],
//                    是否全部投放
                    all:"",
//                    期望曝光人数
                    hope:1,
                },
                // 小程序
                fileList1:[],
                // 卡片链接
                fileList2:[],
                // 文字图片
                fileList3:[],
                // 时间格式化
                timeFormated:[],
                // 默认有一个物料
                wl:{},
//                校验规则
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入活动描述', trigger: 'blur' }
                    ],
                    tags:[
                        { required: true, message: '请输入标签', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择一个投放类型', trigger: 'blur' }
                    ],
                    landingPage: [
                        { required: true, trigger: 'blur' }
                    ],
                    landingPageDesc:[
                        { required: true, message: '落地页描述不能为空', trigger: 'blur' }
                    ],
                    pics:[
                        { required: true, message: '请选择图片', trigger: 'blur' }
                    ],
                    wlUrl:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    all:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    hope:[
                        { required: true, }
                    ]
                },

            }
        },
        created(){
            this.getData();
        },
        methods:{
            submitForm(){
                let self = this;
                let Task = self.ruleForm;
                console.log(Task.materials);
                
                // 日期格式转化
                this.timeFormat();
                // self.$axios.post("/tasks",{
                //     name:Task.name,
                //     desc:Task.desc,
                //     tags:Task.tags,
                //     times:self.timeFormated,
                //     all:Task.all,
                //     hope:Task.hope,
                //     materials:JSON.stringify(Task.materials)
                // }).then(function(res){
                //     if(res.status==201){
                //         self.$message({
                //             message: '任务新建成功！',
                //             type: 'success'
                //         });
                //     }
                //     console.log(res);
                // })
            },
            // 时间格式转化
            timeFormat(){
                var self = this;
                Date.prototype.Format = function(formatStr){
                    let str = formatStr;
                    str = str.replace(/yyyy|YYYY/,this.getFullYear());
                    str = str.replace(/MM/,(this.getMonth()+1)>9?(this.getMonth()+1).toString():'0'+(this.getMonth()+1));
                    str = str.replace(/DD/,this.getDate()>9?this.getDate().toString():'0'+this.getDate());
                    str = str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());  
                    str = str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes()); 
                    str = str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds()); 
                    return str;
                }
                self.timeFormated =  this.ruleForm.times.map(function(item){
                    return new Date(item.time).Format('YYYY-MM-DD HH:mm:SS');
                });
                console.log(self.timeFormated);
            },
            // 小程序预览
            previewApp(item){
                console.log(item);
                item.appPre = true;
            },
            // 卡片式链接
            previewCardLink(item){
                console.log(item);
                item.cardLinkPre = true;
                
            },
            // 图片预览
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            // 点击已上传的文件链接钩子时触发
            handlePreview(file) {
                console.log(file);
            },
            // 图片上传成功后将图片的信息传入对应的图片列表中
            handleSuccess(response,item,index){
                var imgUrl = response.map.material.url;
                if(item.type==0){
                    this.ruleForm.materials[index].word.pics.push(imgUrl)
                }else if(item.type==1){
                    this.ruleForm.materials[index].cardLink.pics.push(imgUrl)
                }else if(item.type==2){
                    this.ruleForm.materials[index].app.pics.push(imgUrl)
                }else{
                    this.ruleForm.materials[index].pic.pics.push(imgUrl)
                }
            },
            getData(){
                let self = this;
                let taskId =  self.$store.state.taskUpdateId;
                self.$axios.get(`/tasks/${taskId}`).then(function(res){
                    console.log(res);
                    if(res.status==200){
                        self.ruleForm = res.data;
                        self.ruleForm.all = res.data.all==1?"否":"是";
                        self.ruleForm.materials = self.transfer(JSON.parse(res.data.materials));
                        
                        let a = JSON.parse(res.data.times).map(function(item){
                            return {time:new Date(item).getTime()};
                        })
                        self.ruleForm.times = a;
                    }
                })
            },
            // 获取到的物料字段转换
            transfer(mater){
                let wl = [];
                console.log(mater,2232232);
                mater.map(function(item){
                    var w = {
                        type:0,
                        key:Date.now(),
                        app:{
                            pagePath:"",
                            content:"",
                            title:"",
                            desFile:"",
                            pics:[],
                            appPre:false
                        },
                        cardLink:{
                            title:"",
                            content:"",
                            pics:[],
                            landingPage:"",
                            cardLinkPre:false
                        },
                        word:{
                            landingPage:[{
                                value:""
                            }],
                            landingPageDesc:""
                        },
                        pic:{
                            pics:[],
                        }
                    }
                    /*
                            {label:'文字',value:0},
                            {label:'卡片式链接',value:1},
                            {label:'小程序',value:2},
                            {label:'图片',value:3}
                    */ 
                    if(item.type==0){
                        w.type="文字";
                        w.word.landingPageDesc = item.content;
                        w.word.landingPage = item.landings;
                        wl.push(w);
                    }else if(item.type==1){
                        w.type="卡片式链接";
                        w.cardLink.title = item.title;
                        w.cardLink.content = item.content;
                        // let p = item.files.map(function(item){
                        //     return item.filePath;
                        // });
                        w.cardLink.pics = item.files;
                        w.cardLink.landingPage = item.uri.split('?groupId')[0];
                        wl.push(w);
                    }else if(item.type==2){
                        w.type="小程序";
                        w.app.pagePath = item.uri;
                        w.app.content = item.content;
                        w.app.title = item.title;
                        w.app.desFile = item.uri;
                        // let p = item.files.map(function(item){
                        //     return item.filePath;
                        // });
                        w.app.pics = item.files;
                        wl.push(w);
                    }else{
                        w.type="图片";
                        // let p = item.files.map(function(item){
                        //     return item.filePath;
                        // });
                        w.pic.pics = item.files;
                        wl.push(w);
                    }
                });
                return wl;
            },
//            添加物料
            addWuLiao(){
                var w = {
//                    默认投放类型
                    type:0,
//                     key值
                    key:Date.now(),
//                    小程序
                    app:{
                        pagePath:"",
//                      页面路径
                        content:"",
//                      标题
                        title:"",
//                      描述文件
                        desFile:"",
//                      缩略图
                        pics:[],
                        appPre:false
                    },
//                    卡片式链接
                    cardLink:{
//                      标题
                        title:"",
//                      内容
                        content:"",
//                      图片
                        pics:[],
//                      落地页
                        landingPage:"",
                        cardLinkPre:false
                    },
//                  文字
                    word:{
//                      落地页
                        landingPage:"",
//                      落地页描述
                        landingPageDesc:""
                    },
//                  图片
                    pic:{
//                  图片
                        pics:[],
                    }
                }
                this.ruleForm.materials.push(w);
            },
            // 添加时间
            addTimes(){
                console.log(this.ruleForm.times);
                
                if(this.ruleForm.times.length<3){
                    this.ruleForm.times.push({time:""});
                    
                }else{
                    return false;
                }
            },
//            删除物料
            close(a){
                this.ruleForm.materials = this.ruleForm.materials.filter(function(item,index){
                    return index!=a;
                });
            },
            // 
            back(){
                this.$router.push("/basecharts");
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }
    /* .item {
        margin-bottom: 18px;
    } */
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
        margin-right:10px;
        float: left;
    }
    .box-card:last-child{
        margin-bottom:0px;
    }
    .box-card:first-child{
        margin-left:0px;
    }
    .el-form-item .el-form-item{
        margin-bottom:20px
    }
    .el-form-item .el-form-item .el-form-item__content{
        margin-left:110px !important;
    }


    .preview .box-card{
        width:100%;
    }
    /* 卡片式链接预览 */
    .preview .item{
        width:100%;
        height:100%;
        display: flex;
        justify-content: space-between;
    }
    .preview .item .last{
        width:35%;
    } 
    .preview .item .first{
        width:65%;
    } 
    .preview .item .first h2,.preview .item .first p{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .preview .item img{
        width:100%;
        height:100%;
    }
    /* 小程序预览 */
    .preview .item1{
        width:100%;
        height:100%;
        display: flex;
        justify-content: space-between;
        flex-direction:column;
    }
    /* .preview .item1 .last{
        width:35%;
    } 
    .preview .item1 .first{
        width:65%;
    }  */
    .preview .item1 .first h2,.preview .item1 .first p{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .preview .item1 img{
        width:100%;
        height:100%;
    }
</style>
