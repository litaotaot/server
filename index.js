const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000

const jsonParser = bodyParser.json()
const urlencodeParser = bodyParser.urlencoded({ extended: false })

const { getInfo, changeBlogVisits } = require('./API')

const { base64 } = require('./exp')

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);//获取请求源 这样所有请求就都有访问权限了
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next()
});

app.use(jsonParser)
app.use(urlencodeParser)

app.get('/articleList', (req, res) => {
    let list  = req.query.list
    let sql = `select * from article limit ${list-5},${list}`
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//blog详情页接口
app.get('/blog/detail', (req, res) => {
    let id = req.url.split('=')[1],
        sql = `select * from blog where id=${id}`
    changeBlogVisits(sql, id).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//blog tags接口
app.get('/blog/tags', (req, res) => {
    let sql = `select blogTags from blog`, data = []
    changeBlogVisits(sql).then(result => {
        result.forEach(item => {
            data = data.concat(item.blogTags.split(','))
        })
        res.send(data)
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//blog 列表
app.get('/blog', (req, res) => {
    let sql = "select id, blogName, blogMessage, blogTime, blogTags, blogVisits, blogAuthor, blogImg, blogText from blog"
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//blog hotSearch接口
app.get('/blog/hotSearch', (req, res) => {
    //查询blogVisits数值最大的九条数据
    let sql = `select blogName, id from blog order by blogVisits desc limit 0,9`
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//blog search接口
app.post('/blog/search', (req, res) => {
    let txt = req.body.searchTxt,
    //模糊查询
        sql = `select * from blog where blogName like '%${txt}%'`
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})
//blog 根据tags获取列表
app.post('/blog/getTags', (req,res) => {
    let tags = req.body.searchTags,
        sql = `select * from blog where blogTags like '%${tags}%'`
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//获取record列表
app.get('/record',(req, res) => {
    let sql = `select id, recordName, recordUrl from record`
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

//获取record详情
app.get('/record/detail',(req, res) => {
    let sql = `select id, recordName, recordInfo, recordText, recordUrl from record`
    getInfo(sql).then(result => {
        res.send(JSON.stringify(result))
    }).catch(error => {
        res.send(JSON.stringify(error))
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
