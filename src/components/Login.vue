<template>
    <div class="login_container">
        <div class="login_box">
            <!--  头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登陆表单区域-->
            <el-form ref="loginFormRef"  :model="loginForm" :rules="loginRules" label-width="0px" class="login_form">
                <!-- 用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm : {
                    username : '',
                    password : ''
                },
                // 验证属性
                loginRules : {
                    username : [
                        { required : true, message : '请输入用户名', trigger : 'blur' },
                        { min : 3, max : 10, message: '长度在3到10个字符之间', trigger : 'blur' }
                    ],
                    password : [
                        { required: true, message: '请输入登陆密码', trigger: 'blur' },
                        { min : 6, max : 15, message: '长度在6到15个字符之间', trigger : 'blur' }
                    ]
                }
            }
        },
        methods : {
            // 重置表单数据与校验结果
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                // 登陆校验参数  参数为callback 函数
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data : res} = await this.$http.post("login", this.loginForm);
                    console.log(res);
                    if (res.code != 200) return this.$message.error(res.msg);
                    this.$message.success(res.msg);
                    // 保存token 项目中除了登陆其他接口访问需要token
                    // 当页面关闭token失效，所以保存在sessionStorage中
                    window.sessionStorage.setItem('token', res.data.token);
                    // 跳转到后台主页
                    this.$router.push('/home');
                });
            }
        }
    }
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
    .login_box {
        width: 450px;
        height: 300px;
        background-color: aliceblue;
        border-radius: 3px;
        /* 居中定位 */
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eeeeee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        /* 定位 */
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        /* 以边框为界调整边距*/
        box-sizing: border-box;
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>