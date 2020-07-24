// 创建一个邮件对象
module.exports = function (sendInfo) {
  return {
    from: 'Jex科技 <18921483103@qq.com>', // sender address
    to: sendInfo.to, // list of receivers
    subject: '【Jex科技】验证码', // Subject line
    text: ``, // plain text body
    html: `
    <div
      style="
        border: 1px solid #dcdcdc;
        color: #676767;
        width: 600px;
        margin: 0 auto;
        padding-bottom: 50px;
        position: relative;
      "
    >
      <div style="padding: 25px;">
        <p style="text-indent: 2em;">尊敬的${sendInfo.user}：</p>
        <div>
          您的验证码是<span style="font-weight: bold;font-size: 20px;color: #333;">${sendInfo.code}</span>，此验证码用于重置密码，验证码有效时间30分钟。
        </div>
        <div style="padding: 5px; background: #f2f2f2;">
          如果该邮件不是由你本人操作，请勿进行使用！
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
