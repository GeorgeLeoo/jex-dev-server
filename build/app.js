const { APP_PATH, DEV_PATH, openDir, readFile, createFile, removeFile, writeFile, renderRouter } = require('./utils')

async function read (path, filename) {
    const readFilePath = `${path}/${filename}`
    return await readFile(readFilePath)
}

async function write (path, data) {
    const pathSplit = path.split('/')
    const last = pathSplit[pathSplit.length - 1]
    if (last === 'dev') {
        return
    }
    const routerFilePath = `${APP_PATH}/routes/${last}Router.js`
    
    // 将路由写入文件
    await writeFile(routerFilePath, renderRouter(data))
}

async function build (path) {
    const writeList = []
    try {
        const dir = await openDir(path)
        for await (const dirent of dir) {
            if (dirent.isFile()) {
                writeList.push(dirent.name)
            }
        }
    } catch (e) {
        throw e
    }
    return writeList
}

//app.use('/jex', require('./routes/jexRouter'))

module.exports = function (app) {
    build(`${APP_PATH}/routes`).then(list => {
        for (let item of list) {
            app.use(`/${item.split('Router')[0]}`, require(`@/routes/${item}`))
        }
    })
}
