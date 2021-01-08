const connection = require('./connectSql/index')

const getInfo = (sql) => {
    return new Promise((resolve, reject) => {
        if(!sql) reject({ msg: 'sql must be not empty' })
        connection.query(sql, (err, res, fields) => {
            err ? reject(err) : resolve(res)
        })
    })
}

//更新博客访问次数
const changeBlogVisits = (sql, id) => {
    if(!sql) reject({ msg: 'sql must be not empty' })
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res, fields) => {
            if(err) {
                reject(err)
                return
            }
            let increment = res[0].blogVisits + 1,
                updateBlogVisits = `update blog set blogVisits=${increment} where id=${id}`
            connection.query(updateBlogVisits, (err, res, fields) => {
                if(err) {
                    reject(err)
                    return
                }
                console.log('访问次数已更新')
            })
            resolve(res)
        })
    })
}

//查询个性标签
const getBlogTags = (sql) => {
    if(!sql) reject({ msg: 'sql must be not empty' })
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res, fields) => {
            err ? reject(err) : resolve(res)
        })
    })
}


module.exports = { getInfo, changeBlogVisits }