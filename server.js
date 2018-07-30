const express = require('express')
const app = express()
// const cors = require('cors')

app.listen(8080, function(){
  console.log('server start')
})

app.get('/api/jsonp', function(req,res){
  var { 
    name,
    time
  } = req.query

  var content = `${name}，您的 jsonp 请求成功！！时间：${time}`

  res.jsonp({ // 请求成功
    code: true,
    mes: content
  })
})