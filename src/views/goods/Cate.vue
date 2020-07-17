<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table class="tree-table" :data="cateList" row-key="id" border
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="id" label="id" width="180"></el-table-column>
                <el-table-column prop="name" label="名称" width="180"></el-table-column>
                <el-table-column label="是否有效">
                    <template slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.deleted === false"
                           style="color: lightgreen"></i>
                        <i class="el-icon-error" v-else style="color: red"></i>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level===1">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level===2">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level===3">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModifyCateDialog(scope.row.name)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination :current-page="queryInfo.pageNum" :page-sizes="[3, 5, 10, 15]"
                           :page-size="queryInfo.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" :total="total">
            </el-pagination>
        </el-card>
        <!-- 对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisable" width="50%" @close="handleCloseAddCateDialog">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="addCateForm.name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options: 数据源-->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="parentOptionProps"
                                 @change="selectParentCate"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisable = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog title="修改分类" :visible.sync="modifyCateDialogVisable" width="50%" @close="handleCloseModifyCateDialog">
            <el-form :model="modifyCateForm" :rules="modifyCateFormRules" ref="modifyCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="modifyCateForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyCateDialogVisable = false">取 消</el-button>
                <el-button type="primary" @click="modifyCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 空数组定义要用 []  不能用{}  找bug找了100年！！！
                cateList: [],
                queryInfo: {
                    // 当前页数
                    pageNum: 1,
                    // 每页多少条数据
                    pageSize: 5,
                    // 搜索类型
                    paramMap: {type: 3}
                },
                total: 0,
                // 添加分类相关数据
                addCateDialogVisable: false,
                addCateForm: {
                    name: '',
                    parentId: 0,
                    level: 0
                },
                addCateFormRules: {
                    name: [
                        {required: true, message: '请输入分类名称', trigger: 'blue'}
                    ]
                },
                parentCateList: [],
                // 选中的父级分类
                selectedKeys: [],
                // options组件的参数
                parentOptionProps: {
                    expandTrigger: 'hover',
                    label: 'name',
                    value: 'id',
                    // 可以选中每级
                    checkStrictly: true
                },
                // 修改分类相关数据
                modifyCateDialogVisable: false,
                modifyCateForm: {
                    name: ''
                },
                modifyCateFormRules: {
                    name: [
                        {required: true, message: '请输入分类名称', trigger: 'blue'}
                    ]
                },

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.post('goods/categories/page', this.queryInfo)
                if (res.code !== 200) {
                    return this.$message.error('获取商品分类列表失败！')
                }
                this.cateList = res.data.content
                this.total = res.data.totalPage
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage
                this.getCateList()
            },
            showAddCateDialog() {
                this.getParentCateList()
                this.addCateDialogVisable = true
            },
            handleCloseAddCateDialog() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.parentId = 0
                this.addCateForm.level = 0
            },
            // 获取父级分类列表
            async getParentCateList() {
                const {data: res} = await this.$http.get('goods/categories/list', {params: {type: 2}})
                if (res.code !== 200) {
                    return this.$message.error('获取数据失败')
                }
                this.parentCateList = res.data
            },
            selectParentCate() {
                if (this.selectedKeys.length > 0) {
                    this.addCateForm.parentId = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.level = this.selectedKeys.length
                } else {
                    this.addCateForm.parentId = 0
                    this.addCateForm.level = 0
                }
            },
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post("goods/categories/add", this.addCateForm)
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.$message.success(res.msg)
                    this.getCateList()
                    this.addCateDialogVisable = false
                })
            },
            showModifyCateDialog(name) {
                this.modifyCateForm.name = name
                this.modifyCateDialogVisable = true
            },
            handleCloseModifyCateDialog() {
                this.$refs.modifyCateFormRef.resetFields()
            },
            modifyCate() {

            }
        }
    }
</script>

<style lang="less" scoped>
    .tree-table {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>