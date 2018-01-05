#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log(`
    --config  /path/to/config.json
    --auth    /path/to/auth.json
    --source  invbg
    --env     [environment]
  `)
  process.exit()
}

;['config', 'auth'].forEach((flag) => {
  if (!argv[flag]) {
    console.log(`Specify --${flag} /path/to/${flag}.json`)
    process.exit()
  }
})

var env = process.env.NODE_ENV || argv.env || 'development'


var fs = require('fs')
var path = require('path')

var fpath = {
  config: path.resolve(process.cwd(), argv.config),
  auth: path.resolve(process.cwd(), argv.auth),
}

var settings = {
  config: require(fpath.config),
  auth: require(fpath.auth),
}

var money = require('../')


;(async () => {
  if (argv.source === 'invbg') {
    var config = settings.config[env].invbg
    var auth = settings.auth[env].invbg

    var invbg = money.invbg(config, auth)

    if (auth.expires <= Date.now()) {

      var [_, {token, expires}] = await invbg.token()

      auth.token = token
      auth.expires = expires * 1000

      fs.writeFileSync(fpath.auth, JSON.stringify(settings.auth, null, 2))
    }

    var [_, xls] = await invbg.cashbox()

    fs.writeFileSync(config.xls, xls)

    var json = invbg.parse(config.xls)
    fs.writeFileSync(config.json, JSON.stringify(json))
  }

  else {
    console.log('Specify --source invbg')
  }
})().catch(console.error)
