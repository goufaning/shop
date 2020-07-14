<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区-->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.paramMap.name" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column abel="状态">
                    <!-- 作用域插槽 scope指这一行的数据 -->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-row>
                            <!-- 修改按钮 -->
                            <el-col :span="8">
                                <el-button type="primary" icon="el-icon-edit" circle size="mini"
                                           @click="showEditDialog(scope.row.id)"></el-button>
                            </el-col>
                            <!-- 删除按钮 -->
                            <el-col :span="8">
                                <el-button type="danger" icon="el-icon-delete" circle size="mini"
                                           @click="removeUserById(scope.row.id)"></el-button>
                            </el-col>
                            <!-- 分配角色按钮 -->
                            <el-col :span="8">
                                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                    <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pageNum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 添加用户对话框 -->
            <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
                <!-- 内容主体 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addManager">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户对话框-->
            <el-dialog title="修改用户" :visible.sync="editDialogVisable" width="50%" @close="editDialogClosed">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisable = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            var checkMobile = (rule, value, cb) => {
                const regMobile = /^1[3456789]\d{9}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入正确的手机号码'))
            }
            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    // 当前页数
                    pageNum: 1,
                    // 每页多少条数据
                    pageSize: 2,
                    // 搜索用户名
                    paramMap: {name: ''}
                },
                userList: [],
                total: 0,
                // 控制添加用户对话框是否显示
                addDialogVisible: false,
                // 添加用户的表单数据
                addForm: {
                    name: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 添加用户表单验证规则对象
                addFormRules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登陆密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {validator: checkMobile, trigger: ['blur', 'change']}
                    ]
                },
                // 修改用户对话框是否显示
                editDialogVisable: false,
                // 修改用户表单的数据
                editForm: {},
                // 修改用户表单数据校验规则
                editFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {validator: checkMobile, trigger: ['blur', 'change']}
                    ]
                }

            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.post('manager/list', this.queryInfo)
                if (res.code != 200) {
                    return this.$message.error("获取用户列表失败")
                }
                this.userList = res.data.content
                this.total = res.data.totalSize
                console.log(res)
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getUserList()
            },
            handleCurrentChange(newPage) {
                console.log(newPage)
                this.queryInfo.pageNum = newPage
                this.getUserList()
            },
            // 监听 switch 的变化
            async userStateChange(userInfo) {
                let params = {userId: userInfo.id, state: userInfo.state ? 1 : 0};
                const {data: res} = await this.$http.post('/manager/state', params)
                if (res.code !== 200) {
                    userInfo.state = !userInfo.state
                    return this.$message.error(res.msg)
                }
                this.$message.success(res.msg)
            },
            // 监听对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加新用户
            addManager() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    // 发起添加用户的网络请求
                    const {data: res} = await this.$http.post('/manager/add', this.addForm)
                    if (res.code !== 200) {
                        this.$message.error(res.msg)
                    } else {
                        this.addDialogVisible = false
                        this.$message.success(res.msg)
                        // 刷新数据
                        this.getUserList()
                    }
                })
            },
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('/manager/id', {params: {id: id}})
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                console.log(res.data)
                this.editForm = res.data
                this.editDialogVisable = true;
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            editUserInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post('/manager/update', {
                        "userId": this.editForm.id,
                        "email": this.editForm.email,
                        "mobile": this.editForm.mobile
                    })
                    if (res.code !== 200) {
                        this.$message.error(res.msg)
                    } else {
                        this.editDialogVisable = false
                        this.$message.success(res.msg)
                        // 刷新数据
                        this.getUserList()
                    }
                })
            },
            // 根据id 删除
            async removeUserById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult != 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const {data: res} = await this.$http.get('manager/delete', {params: {id : id}})
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.$message.success('删除成功!')
                this.getUserList()
            }
        }
    }
</script>

<style scoped>

</style>