const express = require('express')
const app = express()
const carRepo = require('./repos/carRepo')
const errorHelpers = require('./helpers/errorHelpers')
const cors = require('cors')

const router = express.Router()

// Configure middleware to support JSON data parsing
app.use(express.json())

// allow CORS
app.use(cors())

const PORT = 5000

const notFoundResponse = (req) => ({
  status: 404,
  statusText: 'Not Found',
  message: `The car "${req.params.id} could not be found`,
  error: {
    code: 'NOT_FOUND',
    message: `The car "${req.params.id} could not be found`
  }
})

router.get('/', (req, res, next) => {
  carRepo.get((data) => {
    res.status(200).json({
      status: 200,
      statusText: 'OK',
      message: 'All data retrieved.',
      data
    })
  }, (err) => { next(err) }
)})

router.get('/search', (req, res, next) => {
  const searchObject = {
    id: req.query.id,
    name: req.query.name
  }

  carRepo.search(
    searchObject,
    (data) => {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: `All cars matching search params retrieved`,
        data: data
      })
    },
    (err) => { next(err) })
})

router.get('/:id', (req, res, next) => {
  carRepo.getById(req.params.id, (data) => {
    if (data) {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'Single car retrieved.',
        data
      })
    }
    else { res.status(404).json(notFoundResponse(req)) }
  }, (err) => { next(err) }
)})

router.post('/', (req, res, next) => {
  carRepo.insert(req.body,
    (data) => {
      res.status(201).json({
        status: 201,
        statusText: 'Created',
        message: 'New car added',
        data
      })
    },
    (err) => { next(err) })
})

router.put('/:id', (req, res, next) => {
  carRepo.getById(req.params.id,
    (data) => {
      if (data) {
        // Attempt to update the whole car entry
        carRepo.update(req.body, req.params.id, (data) => {
          res.status(200).json({
            status: 200,
            statusText: 'updated',
            message: `Car ${req.params.id} updated`,
            data
          })
        })
      }
      else { res.status(404).json(notFoundResponse(req)) }
    },
    (err) => { next(err) }
  )
})

router.delete('/:id', (req, res, next) => {
  carRepo.deleteById(req.params.id, (data) => {
    if (data) {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: `car ${req.params.id} deleted`,
        data
      })
    }
    else { res.status(404).json(notFoundResponse(req)) }
  }, (err) => { next(err) }
)})

router.patch('/:id', (req, res, next) => {
  carRepo.patchById(req.body, req.params.id, (data) => {
    if (data) {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: `car ${req.params.id} updated successfully`,
        data
      })
    }
    else { res.status(404).json(notFoundResponse(req)) }
  }, (err) => { next(err) }
)})




app.use('/api/', router)

// Configure exception logger to console
app.use(errorHelpers.logErrorsToConsole)

// Configure exception logger to file
app.use(errorHelpers.logErrorsToFile)

// Configure client error handler
app.use(errorHelpers.clientErrorHandler)

// Configure catch-all exception middleware last
app.use(errorHelpers.errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Node server is running on port ${PORT}`)
})
