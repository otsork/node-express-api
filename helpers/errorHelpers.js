const logRepo = require('../repos/logRepo')

const errorHelpers = {
  logErrorsToConsole: (err, req, res, next) => {
    console.error(`Log Entry: ${JSON.stringify(errorHelpers.errorBuilder(err))}`)
    console.error('*'.repeat(80))
    next(err)
  },
  logErrorsToFile: (err, req, res, next) => {
    const errorObject = errorHelpers.errorBuilder(err)
    errorObject.requestInfo = {
      hostName: req.hostname,
      path: req.path,
      app: req.app
    }
    logRepo.write(
      errorObject,
      (data) => { console.log(data) },
      (err) => { console.error(err) }
    )
    next(err)
  },
  clientErrorHandler: (err, req, res, next) => {
    if (req.xhr) {
      res.status(500).json({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'XMLHttpRequest error',
        error: {
          errno: 0,
          call: 'XMLHttpRequest Call',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'XMLHttpRequest error'
        }
      })
    } else {
      next(err)
    }
  },
  errorHandler: (err, req, res, next) => {
    res.status(500).json(errorHelpers.errorBuilder(err))
  },
  errorBuilder: (err) => ({
    status: 500,
    statusText: 'Internal Server Error',
    message: err.message,
    error: {
      errno: err.errno,
      call: err.syscall,
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message
    }
  })
}

module.exports = errorHelpers