/**
 * 请求码
 */
module.exports = {
  SUCCESS: 200,  //  请求成功
  FAIL: 900,  //  获取数据失败
  EXPIRE: 412,  // 验证码过期
  UN_AUTHORIZATION: 401,  // 客户端未授权、未登录
  CLIENT_ERROR: 406, //  客户端错误，未传递正确的参数
  EXIST: 411, //  某个值已存在
  SERVICE_ERROR: 500  //  服务器内部错误
}
