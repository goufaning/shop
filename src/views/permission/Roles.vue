<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区-->
        <el-card>
            <el-row>
                <el-col><el-button type="primary">添加角色</el-button></el-col>
            </el-row>
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in  item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-row>
                            <!-- 修改按钮 -->
                            <el-col :span="8">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="showEditDialog(scope.row.id)"></el-button>
                            </el-col>
                            <!-- 删除按钮 -->
                            <el-col :span="8">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="removeUserById(scope.row.id)"></el-button>
                            </el-col>
                            <!-- 分配权限按钮 -->
                            <el-col :span="8">
                                <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框-->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisable" width="50%">
            <el-tree :data="rightsTree" :props="treeProps" show-checkbox node-key="id"
                     :default-checked-keys="defKeys" default-expand-all></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisable = false">取消</el-button>
                <el-button @click="setRightDialogVisable = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rolesList : [],
                // 分配权限对话框是否显示
                setRightDialogVisable : false,
                // 所有权限的树
                rightsTree: [],
                // 树形对象属性
                treeProps : {
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中的树结点
                defKeys: []
            }
        },
        created() {
            this.getRolesList()
        },
        methods : {
            async getRolesList() {
                const {data: res} = await this.$http.get('role/list')
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.rolesList = res.data
            },
            // 根据命令删除id
            async removeRightById(role, rightId) {
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult != 'confirm') {
                    return this.$message.info('已取消删除')
                }
                let param = new URLSearchParams()
                param.append('roleId', role.id)
                param.append('permissionId', rightId)
                const {data: res} = await this.$http.post('role/removeRight', param)
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.$message.success('删除成功!')
                role.children = res.data
                console.log(res.data)
            },
            async showSetRightDialog (role) {
                // 获取所有权限的数据
                const {data: res} = await this.$http.get('rights/tree')
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.rightsTree = res.data
                this.defKeys = []
                console.log(role)
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisable = true
            },
            // 通过递归的形式，获取角色下所有三级权限的id，并存到 defKeys 中
            getLeafKeys(node, arr) {
                if (node.level === 2) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eeeeee;
}
.bdbottom {
    border-bottom: 1px solid #eeeeee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>