<template xmlns="">
    <div>
        <el-form  label-width="110px" :rules="rules" :model="ruleForm" ref="ruleForm" >
            <el-form-item label="任务名称:" prop="name">
                <el-input  placeholder="请输入内容" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述:" prop="desc">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="ruleForm.desc"
                   >
                </el-input>
            </el-form-item>
            <el-form-item label="标签:" prop="tags">
                <el-input  placeholder="请输入内容" v-model="ruleForm.tags"></el-input>
            </el-form-item>
            <el-form-item label="发送时间:" required prop="times">
                <template v-for="(item,index) in ruleForm.times" >
                    <el-date-picker
                        v-model="item.time"
                        type="datetime"
                        placeholder="选择日期时间"
                        :key="index"
                        :name="index"
                        >
                    </el-date-picker>
                </template>
                <el-button @click="addTimes">添加时间</el-button>
            </el-form-item>

            <el-form-item label="物料:">
                    <el-card class="box-card"  v-for="(item,index) in ruleForm.materials" :key="item.key" >
                        <div slot="header" class="clearfix">
                            <span>物料{{index+1}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="close(index)">X</el-button>
                        </div>
                        <div class="text item">
                            <el-form-item label="投放类型:" >
                                <el-select v-model="item.type" placeholder="请选择">
                                    <el-option
                                        v-for="iType in item.options"
                                        :key="iType.value"
                                        :label="iType.label"
                                        :value="iType.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <template v-if="item.type=='app'">
                                <el-form-item label="页面路径:" prop="name"
                                >
                                    <el-input  placeholder="请输入内容" v-model="item.app.pagePath"></el-input>
                                </el-form-item>
                                <el-form-item label="标题:">
                                    <el-input  placeholder="请输入内容" v-model="item.app.title"></el-input>
                                </el-form-item>
                                <el-form-item label="描述文件:">
                                    <el-upload
                                        class="upload-demo"
                                        action="http://test.cactus.thextrader.cn/api/V1/publishers/uploadCertificate"
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove"
                                        :on-success="(res)=>{handleAppDescFile(res,item,index)}"
                                        list-type="picture"
                                        :show-file-list="false"
                                        name="file"
                                       >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
                                <el-form-item label="上传图片">
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
                                       >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
                                <template v-for="i in item.app.pics" >
                                    <div :key="i">
                                            <el-form-item label="图片预览:">
                                                <img :src="i" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i}}</p>
                                            </el-form-item> 
                                     </div>
                                </template>
                                <el-form-item>
                                    <el-button @click="previewApp(item.app)">预览</el-button>
                                </el-form-item>
                                <el-form-item class="preview" v-if="item.app.appPre">
                                    <el-card class="box-card" v-for="o in item.app.pics" :key="o">
                                        <div class="text item1" >
                                            <div class="first">
                                                <h2 style="width:100%">{{item.app.title}}</h2>
                                                <!-- <p style="width:100%">{{item.app.content}}</p> -->
                                            </div>
                                            <div class="last">
                                                <img :src="o" alt="">
                                            </div>
                                        </div>
                                    </el-card>
                                </el-form-item>
                                <!-- <el-form-item label="预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item> -->
                            </template>
                            <template v-else-if="item.type=='cardLink'">
                                <el-form-item label="标题:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.title"></el-input>
                                </el-form-item>
                                <el-form-item label="内容:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.content"></el-input>
                                </el-form-item>
                                <el-form-item label="上传图片:">
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
                                        >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
                               <template v-for="i in item.cardLink.pics" >
                                    <div :key="i">
                                            <el-form-item label="图片预览:">
                                                <img :src="i" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i}}</p>
                                            </el-form-item> 
                                     </div>
                                   
                                </template>
                                <el-form-item label="落地页:">
                                    <el-input  placeholder="请输入内容" v-model="item.cardLink.landingPage"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="previewCardLink(item.cardLink)">预览</el-button>
                                </el-form-item>
                                <el-form-item class="preview" v-if="item.cardLink.cardLinkPre">
                                    <el-card class="box-card" v-for="o in item.cardLink.pics" :key="o">
                                        <div class="text item">
                                            <div class="first">
                                                <h2 style="width:100%">{{item.cardLink.title}}</h2>
                                                <p style="width:100%">{{item.cardLink.content}}</p>
                                            </div>
                                            <div class="last">
                                                <img :src="o" alt="">
                                            </div>
                                        </div>
                                    </el-card>
                                </el-form-item>
                               
                                <!-- <el-form-item label="预览:">
                                    <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" alt="">
                                </el-form-item> -->
                            </template>
                            <template v-else>
                                <el-form-item label="落地页:">
                                    <el-input  placeholder="请输入内容" v-model="item.wordPic.landingPage"></el-input>
                                </el-form-item>
                                <el-form-item label="文字:">
                                    <el-input  placeholder="请输入内容" v-model="item.wordPic.landingPageDesc"></el-input>
                                </el-form-item>
                                <el-form-item label="上传图片:">
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
                                        >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
                                <template v-for="i in item.wordPic.pics" >
                                    <div :key="i">
                                            <el-form-item label="图片预览:">
                                                <img :src="i" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i}}</p>
                                            </el-form-item> 
                                     </div>
                                </template>
                                <!-- <el-form-item>
                                    <el-button>添加图片</el-button>
                                </el-form-item> -->
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
            <el-form-item label="是否@ALL:" prop="all">
                <el-select v-model="ruleForm.all" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="期望曝光人数:" prop="hope">
                <el-input  placeholder="请输入内容" v-model="ruleForm.hope"></el-input>
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
                    desc:"",
//                    标签
                    tags:"",
//                    时间
                    times:[{
                        time:Date.now()
                    }],
//                    添加物料
                    
                    materials:[{
                        type:"wordPic",
                        options:[
                            {label:'文字图片',value:'wordPic'},
                            {label:'卡片式链接',value:'cardLink'},
                            {label:'小程序',value:'app'}
                        ],
                        key:Date.now(),
                        app:{
                            pagePath:"",
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
                        wordPic:{
                            landingPage:"",
                            landingPageDesc:"",
                            pics:[],
                            order:"",
                            orderBy:[
                                {label:'文字优先',value:'文字优先'},
                                {label:'图片优先',value:'图片优先'}
                            ]
                        },
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
//                默认投放类型
                seleType:"文字图片",
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
                    times:[
                        {required:true,message:'请选择一个时间',trigger:'change'}
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
                    materials:[
                        { required: true, message: '请选择图片', trigger: 'blur' }
                    ],
                    wlUrl:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    all:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    hope:[
                        { required: true, message: '请填写曝光数', trigger: 'blur' }
                    ]
                },

            }
        },
        
        methods:{
            submitForm(){
                let self = this;
                let Task = self.ruleForm;
                console.log(Task.materials);
                
                // 日期格式转化
                this.timeFormat();
                self.$axios.post("/tasks",{
                    name:Task.name,
                    desc:Task.desc,
                    tags:Task.tags,
                    times:self.timeFormated,
                    all:Task.all,
                    hope:Task.hope,
                    materials:JSON.stringify(Task.materials)
                }).then(function(res){
                    if(res.status==201){
                        self.$message({
                            message: '任务新建成功！',
                            type: 'success'
                        });
                    }
                    console.log(res);
                })
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
                if(item.type=="wordPic"){
                    this.ruleForm.materials[index].wordPic.pics.push(imgUrl)
                }else if(item.type=="cardLink"){
                    this.ruleForm.materials[index].cardLink.pics.push(imgUrl)
                }else{
                    this.ruleForm.materials[index].app.pics.push(imgUrl)
                }
            },
            handleAppDescFile(response,item,index){
                let fileUrl = response.map.material.url;
                this.ruleForm.materials[index].app.desFile = fileUrl;
                console.log(response);
            },
//            添加物料
            addWuLiao(){
                var w = {
//                    默认投放类型
                    type:"wordPic",
//                    投放类型
                    options:[
                        {label:'文字图片',value:'wordPic'},
                        {label:'卡片式链接',value:'cardLink'},
                        {label:'小程序',value:'app'}
                    ],
//                     key值
                    key:Date.now(),
//                    小程序
                    app:{
//                      页面路径
                        pagePath:"",
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
//                    文字图片
                    wordPic:{
//                      落地页
                        landingPage:"",
//                      落地页描述
                        landingPageDesc:"",
//                      图片
                        pics:[],
//                      默认发送方式
                        order:"",
//                      发送顺序
                        orderBy:[
                            {label:'文字优先',value:'文字优先'},
                            {label:'图片优先',value:'图片优先'}
                        ]
                    },
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
            }
        }
    }
</script>

<style>
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
