const redis = require('redis')
const { promisifyAll } = require('bluebird')
const redisConfig = require('./../../configuration/redis.json')
console.log(redisConfig)
/**
 * redis配置
 * @type {{password: string | string, port: *, host: *, detect_buffers: boolean, retry_strategy: options.retry_strategy}}
 */
const options = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  detect_buffers: true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
}

// const client = redis.createClient(options)
const client = promisifyAll(redis.createClient(options))

client.on('error', (err) => {
  console.log('<<<<< Redis Client Error:' + err)
})

/**
 * 添加
 * @param key
 * @param value
 * @param time
 */
const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      client.set(key, value, 'EX', time)
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    // { key1: value1, key2: value2}
    // Object.keys(value) => [key1, key2]
    Object.keys(value).forEach((item) => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

// const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);

/**
 * 根据 key 获取
 * @param key
 * @returns {*} 返回一个promise 成功回调返回 key 对应的值
 */
const getValue = (key) => {
  return client.getAsync(key)
}

const getHValue = (key) => {
  // v8 Promisify method use util, must node > 8
  // return promisify(client.hgetall).bind(client)(key)

  // bluebird async
  return client.hgetallAsync(key)
}

/**
 *  根据 key 删除
 * @param key
 */
const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('<<<<< delete successfully');
    } else {
      console.log('<<<<< delete redis key error:' + err)
    }
  })
}

module.exports = {
  client,
  setValue, // 添加
  getValue, // 获取
  delValue,  // 删除
  getHValue  // 获取哈希
}
