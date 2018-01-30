<template xmlns="">
    <div>
        <el-form  label-width="110px" :rules="rules" :model="ruleForm" ref="ruleForm" >

            <el-form-item label="任务名称:" prop="name">
                <el-input  placeholder="请输入内容" v-model="ruleForm.name" @blur="checkName"></el-input>
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
            <el-form-item label="标签:" prop="tags" >
                <el-col >
                    <el-input  placeholder="请输入内容" v-model="ruleForm.tags" label-width="80%">
                        <template slot="append" >多个标签之间用英文分号 ; 隔开 </template>
                    </el-input>
                </el-col>

            </el-form-item>
            <el-form-item label="发送时间:"  >
                <template  >
                     <el-date-picker
                        v-for="(item,index) in ruleForm.times"
                        v-model="item.time"
                        type="datetime" :picker-options="pickerOpt"
                        placeholder="选择日期时间"
                        :key="index"
                        :name="index"
                        >
                    </el-date-picker>
                        <!-- <datepicker
                        :disabled="disabled"
                        :format="showTimeFormat"
                        :minimum-view="hour"
                        language="zh"
                        :wrapper-class="'el-date-editor el-input el-date-editor--datetime'"
                        :input-class="'el-input__inner'"
                        v-for="(item,index) in ruleForm.times"
                        v-model="item.time"
                        :key="index"
                        :value="item.time"
                        placeholder="请选择发送时间"
                        ></datepicker>-->
                </template>
                <el-button @click="addTimes">添加时间</el-button>
                <el-button @click="delTimes">删除时间</el-button>

            </el-form-item>

            <el-form-item label="物料:">
                    <el-card class="box-card"  v-for="(item,index) in ruleForm.materials" :key="index" >
                        <div slot="header" class="clearfix">
                            <span>物料{{index+1}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="close(index)">X</el-button>
                        </div>
                        <div class="text item">
                            <el-form-item label="投放类型:" >
                                <el-select v-model="item.type" placeholder="请选择">
                                    <el-option
                                        v-for="iType in ruleForm.options"
                                        :key="iType.value"
                                        :label="iType.label"
                                        :value="iType.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <template v-if="item.type==2">
                                <el-form-item label="标题:">
                                    <el-input  placeholder="请输入内容" v-model="item.app.title"></el-input>
                                </el-form-item>
                                <el-form-item label="页面路径:" prop="name">
                                    <el-input  placeholder="请输入内容" v-model="item.app.pagePath"></el-input>
                                </el-form-item>
                                <el-form-item label="描述文件:">
                                    <el-upload
                                        class="upload-demo"
                                        action="http://test.cactus.thextrader.cn/api/V1/publishers/uploadCertificate"
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove"
                                        :file-list="fileList0"
                                        :on-success="(res)=>{handleAppDescFile(res,item,index)}"
                                        name="file"
                                        :before-upload = "(res)=>{getFileType(res,item,index)}"
                                        :disabled="fileBtnBool"
                                       >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">只能上传xml文件</div>
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
                                        :before-upload = "(res)=>{getPicType(res,item,index)}"
                                        :show-file-list="false"
                                        name="file"
                                       >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
                                <template  >
                                    <div v-for="(i,index) in item.app.pics" :key="index" v-if="i.fileType != 'text'">
                                            <el-form-item label="图片预览:">
                                                <img :src="i.filePath" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i.filePath}}</p>
                                            </el-form-item>
                                     </div>
                                </template>
                                <el-form-item>
                                    <el-button @click="previewApp(item.app)">预览</el-button>
                                </el-form-item>
                                <el-form-item class="preview" v-if="item.app.appPre" >
                                    <el-card class="box-card" v-for="(o,index) in item.app.pics" :key="index" v-if="o.fileType != 'text'">
                                        <div class="text item1" v-if="o.fileType == 'text'">
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
                            <template v-else-if="item.type==1">
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
                                        :before-upload = "(res)=>{getPicType(res,item,index)}"
                                        :show-file-list="false"
                                        name="file"
                                        >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
                               <template >
                                    <div  v-for="(i,index) in item.cardLink.pics" :key="index">
                                            <el-form-item label="图片预览:">
                                                <img :src="i.filePath" alt="" :style="{width:'200px'}">
                                            </el-form-item>
                                            <el-form-item  label="图片URl:">
                                                <p :style="{'width':'350px','word-wrap':'break-word'}">{{i.filePath}}</p>
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
                            <template v-else-if="item.type==0">
                                <el-form-item label="文字:" >
                                    <el-input  row="2" type="textarea" placeholder="请输入内容" v-model="item.word.landingPageDesc"></el-input>
                                </el-form-item>
                                <el-form-item
                                    v-for="(landpage,index) in item.word.landingPage"
                                    :label="'落地页' + (index+1)"
                                    :key="index"
                                    >
                                    <el-input :class="{landPageW:true}" placeholder="请输入内容" v-model="landpage.value"></el-input>
                                    <el-button v-if="index+1==item.word.landingPage.length" @click="addLandPage(item.word)">+</el-button>
                                    <el-button v-if="index+1==item.word.landingPage.length" @click="delLandPage(item.word)">-</el-button>
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="上传图片:">
                                   <el-upload
                                        class="upload-demo"
                                        action="http://test.cactus.thextrader.cn/api/V1/publishers/uploadCertificate"
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove"
                                        :on-success="(res)=>{handleSuccess(res,item,index)}"
                                        :file-list="fileList3"
                                        list-type="picture"
                                        :before-upload = "(res)=>{getPicType(res,item,index)}"
                                        name="file"
                                        :show-file-list="false"
                                        >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                                    </el-upload>
                                </el-form-item>
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
                <el-button type="primary" @click="addWuLiao()">添加物料</el-button>
            </el-form-item>
            <el-form-item label="是否@ALL:" prop="all">
                <el-select v-model="ruleForm.all" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="期望曝光人数:" prop="hope">
                <el-input  placeholder="请输入内容" v-model.number="ruleForm.hope"></el-input>
            </el-form-item>
            <el-form-item  >
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
   // import datepicker from 'vuejs-datepicker';
//import datetime from 'vue-datetimepicker';

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
    export default {
        data(){
            var validTaskName = function(rule,value,callback){
                // [`~!@#$^&*()+=|＼＼＼[＼]＼{＼}:;'＼,.<>/?]
                if(!value){
                    callback(new Error('请输入任务名称'));
                }else{
                    if(value.length<=50){
                        if(/[/\\:*?？"”“<>|]/.test(value)){
                            callback(new Error('不能输入/\:*?”“"<>|等特殊字符'));
                        }else{
                            callback();
                        }
                    }else{
                        callback(new Error('长度不能超过50'));
                    }
                }

            }
            var validDesc = function(rule,value,callback){
                if(!value){
                    callback(new Error('请输入任务描述'));
                }else{
                    if(value.length<=100){
                        if(/[/\\:*?？"”“<>|]/.test(value)){
                            callback(new Error('不能输入/\:*?”“"<>|等特殊字符'));
                        }else{
                            callback();
                        }
                    }else{
                        callback(new Error('长度不能超过100'));
                    }
                }
            }
            var validTags = function(rule,value,callback){
                if(!value){
                    callback(new Error('请输入标签'));
                }else{
                    if(value.length<=50){
                        if(/[；]/.test(value)){
                            callback(new Error('多个标签之间用英文分号 ; 隔开'));
                        }else if(/[/\\:*?？"”“<>|]/.test(value)){
                            callback(new Error('不能输入/\:*?”“"<>|等特殊字符'));
                        }else{
                            callback();
                        }
                    }else{
                        callback(new Error('长度不能超过50'));
                    }
                }
            }
            var validLandingDesc = function(rule,value,callback){
                console.log(rule);
                console.log(value);
                console.log(callback);
            }
            var validHope = function(rule,value,callback){
                console.log(value);
                if(isNaN(value)||!value){
                    callback(new Error('请输入期望曝光人数'));
                }else{
                    if(value<100000000000){
                        if(/^\+?[1-9][0-9]*$/.test(value)==false){
                            callback(new Error('请输入大于0的正整数'));
                        }else{
                            callback();
                        }
                    }else{
                        callback(new Error('长度不能超过11位'));
                    }
                    
                }
            }
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
                        time:new Date()
                    }],
//                    添加物料
                    /*
                        投放类型：
                            0：文字物料
                            1：链接物料
                            2：小程序物料
                            3：图片物料
                        //之前的物料
                        {label:'文字图片',value:'wordPic'},
                        {label:'卡片式链接',value:'cardLink'},
                        {label:'小程序',value:'app'}

                    */
                    options:[
                            {label:'文字',value:0},
                            {label:'卡片式链接',value:1},
                            {label:'小程序',value:2},
                            {label:'图片',value:3}
                    ],
                    materials:[{
                        type:0,
                        key:Date.now(),
                        app:{
                            pagePath:"",
                            title:"",
                            // 上传的文件名字
                            content:"",
                            // 上传的文件类型
                            fileType:"",
                            // 上传后的文件的地址
                            desFile:"",
                            pics:[],
                            appPre:false
                        },
                        cardLink:{
                            title:"",
                            content:"",
                            // 上传的文件类型
                            fileType:"",
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
                            // 上传的文件类型
                            fileType:"",
                            pics:[]
                        }
                    }],
//                    是否全部投放
                    all:"否",
//                    期望曝光人数
                    hope:1,

                },
                fileBtnBool:false,
                fileList0:[],
                // 小程序
                fileList1:[],
                // 卡片链接
                fileList2:[],
                // 文字图片
                fileList3:[],
                indexs:1,
                timeFormated:[],
                disabled:{
                    to:new Date()
                },
                time1111:new Date(),
                // 默认有一个物料
                wl:{},
//                校验规则
                rules: {
                    name: [
                        { required: true, validator:validTaskName, trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, validator:validDesc, trigger: 'blur' }
                    ],
                    tags:[
                        { required: true, validator:validTags, trigger: 'blur' }
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
                        { required: true, validator:validLandingDesc, trigger: 'blur' }
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
                        {type:'number',required: true, validator:validHope, trigger: 'blur' }
                    ]
                },

            }
        },
        components:{

        },
        computed:{
            start:function(){
                return Date.now();
            },
             pickerOpt: function () {
                return {
                    disabledDate(time) {
                        return time.getTime() < new Date() - 8.64e7;
                    }
                 }
            }
        },
        methods:{

            submitForm(formName){
                let self = this;
                let Task = self.ruleForm;
                // 物料字段过滤
                let wl = [];
                Task.materials.map(function(item,index){
                    if(item.type==0){
                        let landings=[];
                         item.word.landingPage.map(function(landingItem,landingIdex){
                             landings.push(landingItem.value);
                         });
                        let content = `${item.word.landingPageDesc}`;
                        wl.push({type:0,content:content,landings:landings});
                    }else if(item.type==1){
                        let p = item.cardLink.pics.map(function(item){
                            return {filePath:item.filePath,fileType:item.fileType};
                        });
                        let link = {
                            type:1,
                            title:item.cardLink.title,
                            content:item.cardLink.content,
                            uri:`${item.cardLink.landingPage}`+"?groupId=${groupId}",
                            files:p
                        }
                        wl.push(link);
                    }else if(item.type==2){
                        let p = item.app.pics.map(function(item){
                            return {filePath:item.filePath,fileType:item.fileType};
                        });
                        let app = {
                            type:2,
                            title:item.app.title,
                            // 描述文件的名字（标题）
                            content:item.app.title,
                            // 页面路径
                            uri:`${item.app.pagePath}`,
                            files:p
                        }
                        wl.push(app);
                    }else{
                        let p = item.pic.pics.map(function(item){
                            return {filePath:item.filePath,fileType:item.fileType};
                        });
                         wl.push({type:3,files:p});
                    }
                });
                // 日期格式转化
                self.timeFormat();
                // 获取当前用户的id
                let userId = "";
                if(localStorage){
                    userId =  localStorage.getItem('user_id');
                }
                console.log(userId);
                console.log(Task.tags);
                self.$axios.get(`/tasks/checkName/${self.ruleForm.name}`).then(function(res){
                        console.log(res);
                        if(!res.data){
                                self.$message({
                                    message: '任务名称已存在，请重新输入！',
                                    type: 'error'
                                });
                        }else{
                            self.$refs[formName].validate((valid) => {
                                if(valid){
                                    console.log(Task.all);
                                    self.$axios.post("/tasks",{
                                        userId:userId,
                                        name:Task.name,
                                        desc:Task.desc,
                                        tags:Task.tags,
                                        times:self.timeFormated,
                                        all:Task.all=='否'?2:Task.all,
                                        hope:Task.hope,
                                        materials:JSON.stringify(wl)
                                    }).then(function(res){
                                        console.log(res);
                                        if(res.status==201){
                                            self.$message({
                                                message: '任务新建成功！',
                                                type: 'success'
                                            });
                                            self.$router.push("/basetable");
                                        }
                                    })
                                }else{
                                    return false;
                                }
                            });
                        }
                })


            },
            // 时间格式转化
            timeFormat(){
                var self = this;
                self.timeFormated =  self.ruleForm.times.map(function(item){
                         return new Date(item.time).Format('YYYY-MM-DD HH:mm:SS');
                });
                self.timeFormated = self.timeFormated.filter(function(item){
                    return item != 'NaN-0NaN-0NaN 0NaN:0NaN:0NaN';
                });

            },
            // 时间显示格式
            showTimeFormat(date){
                return new Date(date).Format('YYYY-MM-DD HH:mm:SS')
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
            handleRemove(file, fileList0) {
                this.fileBtnBool = false;
            },
            // 点击已上传的文件链接钩子时触发
            handlePreview(file) {
                console.log(file);
            },
            // 获取图片的地址
            getPicType(res,item,index){
                console.log(res);
                console.log(item);
                if(res.type=="image/jpeg"){
                    console.log(res.type);
                    if(item.type==1){
                        item.cardLink.fileType = res.type.split('/')[0];
                        console.log(item);
                    }else if(item.type==2){
                        item.app.fileType = res.type.split('/')[0];
                    }else{
                        item.pic.fileType = res.type.split('/')[0];
                    }
                }else{
                    return false;
                }
            },
            // 图片上传成功后将图片的信息传入对应的图片列表中
            handleSuccess(response,item,index){
                // response.map.material.url
                if(item.type==1){
                    let imgUrl = {filePath:response.map.material.url,fileType:item.cardLink.fileType};
                    this.ruleForm.materials[index].cardLink.pics.push(imgUrl)
                }else if(item.type==2){
                    let imgUrl = {filePath:response.map.material.url,fileType:item.app.fileType};
                    this.ruleForm.materials[index].app.pics.push(imgUrl)
                }else{
                    let imgUrl = {filePath:response.map.material.url,fileType:item.pic.fileType};
                    this.ruleForm.materials[index].pic.pics.push(imgUrl)
                }
            },
            // 获取描述文件类型和名字
            getFileType(res,item,index){
                if(res.type=="text/xml"){
                    item.app.content = res.name;
                    item.app.fileType = "text";
                }else{
                    return false;
                }
            },
            // 获取描述文件上传后的地址
            handleAppDescFile(response,item,index){
                console.log(response);
                this.fileBtnBool = response.ok;
                let fileUrl = response.map.material.url;
                this.ruleForm.materials[index].app.pics.push({filePath:response.map.material.url,fileType:item.app.fileType});
                console.log(this.ruleForm.materials[index].app.pics);
            },
            // 添加落地页
            addLandPage(item){
                item.landingPage.push({
                    value:""
                });
            },
            delLandPage(item){
                if(item.landingPage.length>1){
                    item.landingPage.pop();
                }else{
                    return false;
                }
            },
            checkName(){
                var self = this;
                self.$axios.get(`/tasks/checkName/${self.ruleForm.name}`).then(function(res){
                        console.log(res);
                        if(!res.data){
                                self.$message({
                                    message: '任务名称已存在，请重新输入！',
                                    type: 'error'
                                });
                        }
                })

			},
//            添加物料
            addWuLiao(){
                let a = this.indexs+1;
                var w = {
//                    默认投放类型
                    type:0,
//                  key值
                    key:a,
//                    小程序
                    app:{
//                      内容
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
//                    文字
                    word:{
//                      落地页
                        landingPage:[{
                            value:""
                        }],
//                      落地页描述
                        landingPageDesc:""
                    },
//                    图片
                    pic:{
//                      图片
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
            delTimes(){
                console.log(this.ruleForm.times);
                if(this.ruleForm.times.length>0){
                    this.ruleForm.times.pop();
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

<style scoped>
    .text {
        font-size: 14px;
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
    .landPageW{
        width:72%;
    }
    /* 日期组件显示格式 */
    .datapicker1{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        display: block;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
    }
    .vdp-datepicker__clear-button{
        position: absolute !important;
        right: 12px;
        bottom: 0px;
    }
    .el-input-group__append{
        background-color: white !important;
        border: none !important;
    }

   
</style>
