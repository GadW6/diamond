require('dotenv').config()
const { accessSync, mkdirSync } = require('fs')
const { join } = require('path')
const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file');
const loggerFiles = require('./loggerFiles.json')

// TODO:
// [/] - Adding Download Capability From Dashboard
// [x] - Get User Data (Role, Email, ?Logged Status)
// [x] - Logger Message Levels (Warning, Notice)
// [.] - Spread logs globally
// [ ] - Visual Logs
// [ ] - Implement Grafana + ELK Beats
// [ ] - 

class Logger {

  constructor(name){
    this.name = name
    this.label = 'No Label'
    this.logRotate = {}
    this.logOptions = {
      component: null,
      path: null,
      status: null,
      method: null,
      headers: null,
    }
    this.auth = {}
    this.wasEnvironmentChecked = false
  }

  getLoggerSchema(loggerName){
    return loggerFiles.find(logger => logger.name === loggerName)
  }

  getLoggerDirectory(name){
    let DEFAULT_PATH = 'logs';
    const selectedLoggerPath = this.getLoggerSchema(name).path
    selectedLoggerPath.split('/').slice(1).forEach(slug => {
      return DEFAULT_PATH = join(DEFAULT_PATH, slug)
    })
    return DEFAULT_PATH
  }

  getTransportByEnvironment(){
    if (process.env.NODE_ENV === 'prod') {
      return new transports.DailyRotateFile(this.logRotate);
    } else if (process.env.NODE_ENV === 'dev') {
      // return new transports.DailyRotateFile(this.logRotate);
      return new transports.Console()
    }
  }

  getBaseFormatLogger(){
    return format.combine(
      format.timestamp(),
      format.label({ label: this.label }),
      format.json(),
    )
  }

  setLabel(l){
    this.label = !!l ? l : 'No Label'
    return this
  }

  setRootFolderDependency(){
    try {
      accessSync(join('logs'))
    } catch (error) {
      mkdirSync(join('logs'))
    }
  }

  setLogRotate(){
    this.logRotate.filename = `${this.getLoggerSchema(this.name).filename}-%DATE%`
    this.logRotate.dirname = this.getLoggerDirectory(this.name)
    this.logRotate.maxSize = `${this.getLoggerSchema(this.name).rotateSize}k`
    this.logRotate.extension = '.log'
  }

  setEnvironmentDepencies(){
    this.setLogRotate()
  }

  clearLabel(){
    this.label = 'No Label'
    return this
  }

  init(){
    if (!this.wasEnvironmentChecked) this.setEnvironmentDepencies()
    return createLogger({
      format: this.getBaseFormatLogger(),
      defaultMeta: { options: this.logOptions, auth: this.auth },
      transports: this.getTransportByEnvironment()
    });
  }
}

class DefaultLogger extends Logger {
  constructor(){
    super(DefaultLogger.name)
  }
}

class LoginLogger extends Logger {
  constructor(){
    super(LoginLogger.name)
  }
}

class RouterLogger extends Logger {
  constructor(){
    super(RouterLogger.name)
  }
}

class ContentLogger extends Logger {
  constructor(){
    super(ContentLogger.name)
  }
}

class GalleryLogger extends Logger {
  constructor(){
    super(GalleryLogger.name)
  }
}

class MessageLogger extends Logger {
  constructor(){
    super(MessageLogger.name)
  }
}

class UserLogger extends Logger {
  constructor(){
    super(UserLogger.name)
  }
}

module.exports = {
  Logger: new Logger,
  Default: new DefaultLogger,
  Login: new LoginLogger,
  Router: new RouterLogger,
  Content: new ContentLogger,
  Gallery: new GalleryLogger,
  Message: new MessageLogger,
  User: new UserLogger,
}