const dayjs = require("dayjs");

const template = ({ fullName, email, message, date }) => `
<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
  <tr>
    <td align="center" style="padding:0;">
      <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
        <tr>
          <td align="center" style="padding:10px 0 0;background:#E6E6E6;">
            <img src="https://hassanali.tk/logo.png" alt="" width="70" style="height:auto;display:block;margin-top:5px" />
            <h2 style="font-family:Arial,sans-serif;color: #153643;margin-top:5px">Hassan Ali</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 30px 42px 30px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
              <tr>
                <td style="color:#153643;">
                  <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;direction:ltr">New Message From Contact Us Form</h1>
                  <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;direction:ltr">Hi Hassan, There is a new message from contact us form sent to you, Check out the message :</p>
                  <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                    <b>From: </b> <span>${fullName} - ${email}</span>
                    <br/>
                    <b>Message: </b> <span>${message}</span>
                    <br/>
                    <b>Sent At: </b> <span>${dayjs(date).format('DD/MM/YYYY | hh:mm a')}</span>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;background:#3A3C41;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;direction:ltr">
              <tr>
                <td style="padding:0;width:50%;" align="left">
                  <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;direction:ltr">
                    &reg; Hassan Ali, Portfolio 2021
                  </p>
                </td>
                <td style="padding:0;width:50%;" align="right">
                  <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 0 10px;width:38px;direction:ltr">
                        <a href="http://admin.hassanali.tk/" style="color:#ffffff;"><img src="https://hassanali.tk/logo.png" alt="Logo" width="38" style="height:auto;display:block;border:0;" /></a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`

module.exports = template;