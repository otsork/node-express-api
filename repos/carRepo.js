const fs = require('fs')

const FILE_NAME = './assets/cars.json'

const carRepo = {
  get: (resolve, reject) => {
   fs.readFile(FILE_NAME, (err, data) => {
     if (err) reject(err)
     else {
       resolve(JSON.parse(data))
     }
   })
  },
  getById: (id, resolve, reject) => {
    fs.readFile(FILE_NAME, (err, data) => {
      if (err) reject(err)
      else {
        resolve(JSON.parse(data).find(item => item.id == id))
      }
    })
  },
  search: (searchObject, resolve, reject) => {
    fs.readFile(FILE_NAME, (err, data) => {
      if (err) reject(err)
      else {
        let cars = JSON.parse(data)
        if (searchObject) {
          cars = cars.filter(
            item => (
              (searchObject.id ? item.id == searchObject.id : true) &&
              (searchObject.name ? item.name.toLowerCase().includes(searchObject.name.toLowerCase()) : true)
            )
          )
        }
        resolve(cars)
      }
    })
  },
  insert: (newData, resolve, reject) => {
    fs.readFile(FILE_NAME, (err, data) => {
      if (err) reject.err()
      else {
        const cars = JSON.parse(data)
        cars.push(newData)
        fs.writeFile(FILE_NAME, JSON.stringify(cars), (err) => {
          if (err) reject(err)
          else resolve(newData)
        })
      }
    })
  },
  update: (newData, id, resolve, reject) => {
    fs.readFile(FILE_NAME, (err, data) => {
      if (err) reject.err()
      else {
        const cars = JSON.parse(data)
        let car = cars.find(item => item.id == id)
        if (car) {
          Object.assign(car, newData)
          fs.writeFile(FILE_NAME, JSON.stringify(cars), (err) => {
            if (err) reject(err)
            else resolve(newData)
          })
        }
      }
    })
  },
  deleteById: (id, resolve, reject) => {
    fs.readFile(FILE_NAME, (err, data) => {
      if (err) reject.err()
      else {
        const cars = JSON.parse(data)
        const index = cars.findIndex(item => item.id == id)
        if (index != -1) {
          cars.splice(index, 1)
          fs.writeFile(FILE_NAME, JSON.stringify(cars), (err) => {
            if (err) reject(err)
            else resolve(index)
          })
        }
      }
    })
  },
  patchById: (newData, id, resolve, reject) => {
    fs.readFile(FILE_NAME, (err, data) => {
      if (err) reject.err()
      else {
        const cars = JSON.parse(data)
        const index = cars.findIndex(item => item.id == id)
        if (index != -1) {
          cars[index] = { ...cars[index], ...newData }
          fs.writeFile(FILE_NAME, JSON.stringify(cars), (err) => {
            if (err) reject(err)
            else resolve(index)
          })
        }
      }
    })
  }
}

module.exports = carRepo