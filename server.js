const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const axios = require('axios')




app.use(express.static('test'))

app.listen(8080, function(){
  console.log('server start')
})

app.get('/home', (req,res)=>{
  res.redirect('/XHR请求/XHR.html')
})

app.get('/worker', (req, res)=>{
  res.redirect('/webWorker/index.html')
})

app.get('/sse', (req, res)=>{
  res.redirect('/SSE/sse.html')
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

app.get('/api/xhr', (req, res)=>{
  var { 
    name
  } = req.query

  console.log(name)

  res.json({
    code: true,
    mes: 'xhr'
  })
})


app.get('/api/httpStream', (req, res)=>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST, GET')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Max-Age', '1728000')

  let i = 4
  let timer = setInterval(()=>{
    if(i--) {
      res.pipe('data: index = '+i)
    }
    else {
      clearInterval(timer)
      res.end()
    }
  }, 1000)
})

app.get('/api/SSE', (req, res)=>{
  res.header('Content-Type', 'text/event-stream')
  res.header('Cache-Control: no-cache')
  let i = 4
  let timer = setInterval(()=>{
    if(i--) {
      res.write('data: index = '+i)
    }
    else {
      clearInterval(timer)
      res.end()
    }
  }, 1000)
})


app.get('/new', (req,res)=>{
res.redirect('./html/show-4.html')
})
app.get('/newData/getIndexData', (req,res)=>{
  console.log('123')
  if(req.query.distinct){
    res.json({
      result: 'success',
      message: [
          {
            "name":"海珠区",
            "rate2":0.48
          },
          {
            "name":"越秀区",
            "rate2":0.46
          },
          {
            "name":"通信区",
            "rate2":0
          },
          {
            "name":"南沙区",
            "rate2":0.7
          },
          {
            "name":"番禺区",
            "rate2":0.76
          },
          {
            "name":"天河区",
            "rate2":0.53
          },
          {
            "name":"从化区",
            "rate2":0.5
          },
          {
            "name":"荔湾区",
            "rate2":0.89
          },
          {
            "name":"花都区",
            "rate2":0.48
          },
          {
            "name":"白云区",
            "rate2":0.68
          },
          {
            "name":"黄埔区",
            "rate2":0.93
          },
          {
            "name":"萝岗区",
            "rate2":2
          },
          {
            "name":"增城区",
            "rate2":0.72
          }
        ]
    })
  }else {
    res.json({
      result: 'success',
      message:  [
          {
            "name":"投资",
            "plan":"409729",
            "actual":"266176",
            "rate":"0.65",
            "time":"2018-10-24 00:00:00"
          },
          {
            "name":"进度",
            "plan":"6337",
            "actual":"4146",
            "rate":"0.65"
          },
          {
            "name":"施工",
            "plan":"9217",
            "actual":"8112",
            "rate":"0.88"
          },
          {
            "name":"开工",
            "plan":"7890",
            "actual":"7246",
            "rate":"0.92"
          },
          {
            "name":"完工",
            "plan":"6009",
            "actual":"3533",
            "rate":"0.59"
          },
          {
            "name":"结算",
            "plan":"4204",
            "actual":"1374",
            "rate":"0.33"
          }
        ]
    })
  }
  return 
  res.json({
    result: 'success',
    message: [
      {

      }
    ]
  })
})



app.use(cors())
var proxy = require('http-proxy-middleware');
var proxyTable = {
  '/jjfzjc/**': {
    target: 'http://192.168.1.231:8080',
    changeOrigin: true
  }
}
Object.keys(proxyTable).forEach(function(key){
  app.use(proxy(key,proxyTable[key]));
})

// app.get('/jjfzjc/newData/leftThreeRate', function (req, res) {
//   axios({
//     url: 'http://192.168.1.231:8080' + req.originalUrl,
//     method: 'get'
//   }).then((e)=>{
//     console.log(e.data)
//     res.json(e.data)
//   })
//   // console.log(req)
// })

app.get('/proxy', (req,res)=>{
  res.redirect('/proxy/proxy.html')
})
