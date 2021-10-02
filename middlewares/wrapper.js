module.exports.logger = (Logger, component) => {
  return (req, res, next) => {
    const isAuth = !!req.session.sid ? true : false

    Logger.logOptions.headers = req.headers
    Logger.logOptions.path = req.originalUrl
    Logger.logOptions.method = req.method
    Logger.logOptions.component = component
    Logger.logOptions.status = res.statusCode
    Logger.auth.authenticated = isAuth
    Logger.auth.name = isAuth ? req.session.name : null
    Logger.auth.role = isAuth ? req.session.role : null
    next()
  }
}