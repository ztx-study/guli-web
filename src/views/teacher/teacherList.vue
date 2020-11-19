<template>
  <div>

    <!--查询表单-->
    <el-form :inline="true" size="small">
      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师" /> -->
        <el-autocomplete
          v-model="searchObj.name"
          value-key="name"
          class="inline-input"
          :fetch-suggestions="querySearchNameLike"
          placeholder="讲师"
          :trigger-on-focus="false"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师" />
          <el-option value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
        <!-- 工具按钮 -->
        <div style="margin-bottom: 10px">
          <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 列表数据表格 -->
    <el-table :data="list" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page-1) * limit + scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="joinDate" label="入驻时间" width="160" />
      <el-table-column label="操作" width="200">

        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="removeTeacher(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column></el-table>
    <!-- 分页插件 -->
    <el-pagination
      layout="sizes, prev, pager, next, jumper, ->, total"
      :total="total"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="limit"
      :current-page="page"
      style="padding-top: 18px"
      @current-change="changeCurrentPage"
      @size-change="pageSizeChange"
    />
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页条数
      searchObj: {}, // 查询条件对象,
      multipleSelection: []// 批量删除选中的记录列表
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // 调用API模块，请求讲师列表数据，不需要使用catch来捕获失败，统一在相应拦截器处理
      teacherApi.getPageTeacherList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    changeCurrentPage(page) {
      // console.log(`被处罚了：${page}`)
      this.page = page
      this.fetchData()
    },
    pageSizeChange(size) {
      this.limit = size
      this.fetchData()
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 根据ID删除教师
    removeTeacher(id) {
      this.$confirm('此操作将永久删除该讲师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.removeTeacherById(id)
      }).then(response => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: response.message
        })
      }).catch((error) => {
        if (error === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },
    // 批量删除讲师方法
    batchRemove() {
      console.log('removeRows......')

      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return teacherApi.batchRemoveTeacherByIdList(idList)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    querySearchNameLike(queryString, callback) {
      console.log(queryString)
      teacherApi.selectLikeName(queryString).then(response => {
        console.log(response.data.nameList)
        callback(response.data.nameList)
      })
    }
  }

}

</script>
<style lang='' scoped>

</style>
