import request from '@/utils/request'

export default {

  // 获取讲师列表
  getTeacherList() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'GET'
    })
  },

  // 分页查询获取讲师列表
  getPageTeacherList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/teacher/list/${page}/${limit}`,
      method: 'GET',
      params: searchObj
    })
  },

  // 根据ID删除讲师
  removeTeacherById(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'DELETE'
    })
  },
  // 添加讲师
  saveTeacher(teacher) {
    return request({
      url: `/admin/edu/teacher/add`,
      method: 'POST',
      data: teacher
    })
  },
  // 根据ID获取讲师信息
  getTeacherById(id) {
    return request({
      url: `/admin/edu/teacher/get/${id}`,
      method: 'GET'
    })
  },
  // 根据ID修改讲师信息
  updateTeacherById(teacher) {
    return request({
      url: `/admin/edu/teacher/update`,
      method: 'PUT',
      data: teacher
    })
  },

  // 批量删除讲师
  batchRemoveTeacherByIdList(idList) {
    return request({
      url: '/admin/edu/teacher/batchRemove',
      method: 'delete',
      data: idList
    })
  },
  // 查询列表讲师姓名智能补全
  selectLikeName(key) {
    return request({
      url: `/admin/edu/teacher/selectLikeNameByKet/${key}`,
      method: 'GET'
    })
  }
}
