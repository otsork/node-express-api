const fs = require('fs')

const FILE_NAME = './logs/log.txt'

const logRepo = {
  write: (data, resolve, reject) => {
    let toWrite = '*'.repeat(80) + '\r\n'
    toWrite += `Date/Time ${new Date().toLocaleDateString()}\r\n`
    toWrite += `Exception info ${JSON.stringify(data)} \r\n`
    toWrite += '*'.repeat(80) + '\r\n'

    fs.writeFile(FILE_NAME, toWrite, (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  }
}

module.exports = logRepo