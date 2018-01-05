
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})
var xlsx = require('xlsx')


module.exports = (config, auth) => {

  var invbg = purest({
    provider: 'invbg',
    config: config.purest || require('../config/purest'),
  })


  var token = () =>
    invbg
      .post('login/token')
      .json({
        email: auth.email,
        password: auth.password,
        domain: auth.domain,
      })
      .request()


  var cashbox = () =>
    invbg
      .get(`cashboxes/${config.cashbox}/xls-export`)
      .qs({
        from_date: config.from,
        to_date: config.to,
      })
      .auth(auth.token)
      .options({encoding: 'binary'})
      .request()


  var parse = (file) => {
    var data = xlsx.readFile(file)
    var json = xlsx.utils.sheet_to_json(data.Sheets.Worksheet)
    return json
  }


  return {token, cashbox, parse}
}
