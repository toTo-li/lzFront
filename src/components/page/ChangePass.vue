<template xmlns="">
    <div>
        <el-form  label-width="150px" :rules="rules" :model="passForm" ref="passForm" >
            <el-form-item label="密码:" prop="pass">
                <el-input  placeholder="请输入密码" v-model="passForm.pass"></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="newpass1">
                <el-input  placeholder="新密码" v-model="passForm.newpass1"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码:" prop="newpass2">
                <el-input  placeholder="再次输入新密码" v-model="passForm.newpass2"></el-input>
            </el-form-item>
            <el-form-item  >
                <el-button type="primary" @click="submitForm('passForm')">确定</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        data(){
            var checkNewpass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.passForm.newpass1) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return{
                passForm:{
//                    密码
                    pass:"",
//                    新密码
                    newpass1:"",
//                    再次输入的新密码
                    newpass2:""
                },
//                校验规则
                rules: {
                    pass: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    newpass1: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    newpass2: [
                        {required: true, validator:checkNewpass,trigger: 'blur'}

                    ]
                },
            }
        },

        methods:{
            checkNewpass(){
                const self = this;
                return self.passForm.newpass1==self.passForm.newpass2;
            },
             submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    console.log(self.$refs);
                    console.log(valid);
                    if (valid) {
						this.$axios.put("/users/changePassword",{
								name:localStorage.getItem("ms_username"),
                            oldPass:self.passForm.pass,
                            newPass:self.passForm.newpass1,
							}).then(function(res){
                             // 然后跳转页面，需要做用户验证
                             self.$router.push('/home');
						    },function(err){
                                console.log(err);
                                new Error('修改密码失败');
                                self.$message({
                                        message: "修改密码失败！",
                                        type: 'warning'
                                    });
                            }).catch(function(error){
                                console.log(error);
                            });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
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
    .el-input{
        width:80%;
    }
</style>
