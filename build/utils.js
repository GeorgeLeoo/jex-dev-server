const path = require('path')
const exec = require('child_process').exec
const fs = require('fs')
const { isArray } = require('../src/utils/dataType')

exports.resolve = function (dir) {
    return path.join(__dirname, '..', dir)
}

exports.renderSchema = function (collectionName, collectionStructure) {
    return `// Auto build by build/index.js
  
const db = require('../../db/conn')
const Schema = db.Schema
const JexSchema = new Schema(${collectionStructure})
module.exports = db.model('${collectionName}s', JexSchema)
`
}

exports.removeFile = function (path, success, fail) {
    exec('rm -r ' + path, function (err, stdout, stderr) {
        if (err) {
            typeof fail === 'function' && fail()
            throw err
        }
        typeof success === 'function' && success()
    })
}

exports.createFile = function (path, success, fail) {
    exec('mkdir ' + path, function (err, stdout, stderr) {
        if (err) {
            typeof fail === 'function' && fail()
            throw err
        }
        typeof success === 'function' && success()
    })
}

exports.hasFile = function (path) {
    return new Promise(resolve => {
        fs.access(path, err => {
            if (err) {
                createFile(path)
                resolve(true)
            }
            resolve(true)
        })
    })
}

exports.APP_PATH = exports.resolve('src')
exports.DIST_PATH = exports.resolve('dist')
exports.DEV_PATH = exports.resolve('dev')

exports.renderRouter = function (fn) {
    let templateHead = '' +
        'const express = require(\'express\')' +
        'const Router = express.Router()'
    
    let templateLast = 'module.exports = Router'
    
    let templateContent = ''
    
    for (let route of fn) {
        const url = exports.getUrlFromDev(route)
        const method = exports.getMethodFromDev(route)
    
        route = route.replace(/@url\("(.*)"\)/g, '')
        route = route.replace(/@method\("(\b\w+\b)"\)/g, '')
    
        templateContent += `
Router.${method}('${url}', async function (req, res) {
${route}
main({req, res})

})

`
    }
    return templateHead + templateContent + templateLast
}

exports.writeFile = function (path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) {
                reject(err)
            } else {
                resolve()
                console.log(`${path} create success`)
            }
        })
    })
}

exports.readFile = function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

exports.openDir = function(path){
    return new Promise((resolve, reject) => {
        fs.opendir(path, async (err, dir) => {
            if (err) {
                reject(err)
            } else {
                resolve(dir)
            }
        })
    })
}

exports.getUrlFromDev = function (fileData) {
    let url = '/'
    const matchArray = fileData.match(/@url\("(.*)"\)/g)
    if (isArray(matchArray) && matchArray.length !== 0) {
        const urlArray = matchArray[0].match(/"([^"]*)"/g)
        if (isArray(urlArray) && urlArray.length !== 0) {
            url = urlArray[0].replace(/"/g, '')
        }
    }
    return url
}

exports.getMethodFromDev = function (fileData) {
    let method = '/post'
    const matchArray = fileData.match(/@method\("(\b\w+\b)+"\)/g)
    if (isArray(matchArray) && matchArray.length !== 0) {
        const methodArray = matchArray[0].match(/"([^"]*)"/g)
        if (isArray(methodArray) && methodArray.length !== 0) {
            method = methodArray[0].replace(/"/g, '')
        }
    }
    return method
}
