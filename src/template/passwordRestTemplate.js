// 创建一个邮件对象
module.exports = function (sendInfo) {
  return {
    from: 'Jex科技 <18921483103@qq.com>', // sender address
    to: sendInfo.to, // list of receivers
    subject: '【Jex科技】找回密码', // Subject line
    text: ``, // plain text body
    html: `
    <div
      style="
        border: 1px solid #dcdcdc;
        color: #676767;
        width: 600px;
        margin: 0 auto;
        padding-bottom: 50px;
        position: relative;s
      "
    >
      <div style="padding: 25px;">
        <p style="text-indent: 2em;">尊敬的${sendInfo.user}：</p>
        <div>
          请点击下方"立即重置"按钮进行重置密码，重置链接有效时间30分钟，请在${sendInfo.expire}之前重置您的密码：
        </div>
        <div style="text-align: center;">
          <a
            href="http://www.baidu.com"
            target="_blank"
            style="
              padding: 10px 20px;
              color: #fff;
              background: #009e94;
              display: inline-block;
              margin: 15px 0;
              text-decoration: none;
            "
            >立即重置</a
          >
        </div>
        <div style="padding: 5px; background: #f2f2f2;">
          如果该邮件不是由你本人操作，请勿进行点击！否则你的账号密码将被他人盗取。
        </div>
      </div>
      <div
        style="
          background: #fafafa;
          color: #b4b4b4;
          text-align: center;
          line-height: 45px;
          height: 45px;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
        "
      >
        系统邮件，请勿直接回复
      </div>
    </div>
` // html body
  }
}
