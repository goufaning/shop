<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="params_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                            v-model="selectedKeys"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- 标签页-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template>
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template>
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog :title="'添加' + titleText"  :visible.sync="addDialogVisible" width="50%" @close="handleAddDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                cateList: [],
                // 级联选择框的选择结果
                selectedKeys: [],
                // 级联选择框属性
                cateProps: {
                    value: 'id',
                    label: 'name',
                    expandTrigger: 'hover'
                },
                // 标签页选中标签
                activeName: 'many',
                manyTableData: [],
                onlyTableData: [],
                addDialogVisible : false,
                addForm: {
                    name: ''
                },
                addFormRules: {
                    name: [{required: true, message: '请输入参数', trigger: 'blur' }]
                }
            }
        },
        created() {
            this.getCateList()

        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('goods/categories/list', {params: {type: 3}})
                if (res.code !== 200) {
                    return this.$message.error('获取数据失败')
                }
                this.cateList = res.data
                console.log(this.cateList)
            },
            // 级联选择框选中项变化，触发的方法
            handleChange() {
                this.getParamsData()
            },
            // Tab标签页选择结果
            handleTabClick() {
                this.getParamsData()
            },
            async getParamsData() {
                // 选中的不是三类菜单
                if (this.selectedKeys.length !== 3) {
                    this.selectedKeys = []
                    return
                }
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.sel}})
                if (res.code !== 200) {
                    return this.$message.error("获取失败")
                }
                this.$message.success("成功")
                if (this.activeName === 'only') {
                    this.onlyTableData = res.data
                } else {
                    this.manyTableData = res.data
                }
            },
            handleAddDialogClose() {
                this.$refs.addFormRef.resetFields()
            }
        },
        computed: {
            isBtnDisabled() {
                if (this.selectedKeys.length !== 3) {
                    return true
                }
                return false
            },
            cateId() {
                if (this.selectedKeys.length === 3) {
                    return this.selectedKeys[2]
                }
                return null
            },
            sel() {
                if (this.activeName === 'only') {
                    return 1;
                }
                return 2;
            },
            titleText() {
                if (this.activeName == 'only') {
                    return '静态属性'
                }
                return '动态参数'
            }
        }
    }
</script>

<style lang="less" scoped>
    .params_opt {
        margin: 15px 0;
    }
</style>