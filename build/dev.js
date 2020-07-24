const fs = require('fs')
const { APP_PATH, DEV_PATH, openDir, readFile, createFile, removeFile, writeFile, renderRouter } = require('./utils')

async function read (path, dirent) {
    const readFilePath = `${path}/${dirent.name}`
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
    try {
        const writeList = []
        const dir = await openDir(path)
        for await (const dirent of dir) {
            if (dirent.isDirectory()) {
                build(`${path}/${dirent.name}`).then()
            } else if (dirent.isFile()) {
                const data = await read(path, dirent)
                writeList.push(data)
            }
        }
        await write(path, writeList)
    } catch (e) {
        throw e
    }
}

build(DEV_PATH).then()

