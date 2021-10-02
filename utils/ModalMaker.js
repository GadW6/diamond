class ModalMaker {
  constructor(BTN_TITLE = 'Close', SEVERITY = 'info', DISMISS = true){
    this.btnTitle = BTN_TITLE
    this.dismiss = DISMISS
    this.tag = 'modal'
    this.title = 'Are you sure ?'
    this.msg = false
    this.severity = SEVERITY
    this.action = {
      xhrStatus: true,
      link: '',
      method: 'get',
      after: '',
    }
  }

  setBtn (val) {
    this.btnTitle = val
    return this
  }

  setTag (val) {
    this.tag = val
    return this
  }
  
  setMsg (val) {
    this.msg = val
    return this
  }

  sendGet (val, xhr = true) {
    this.action.link = val
    this.action.xhrStatus = xhr
    return this
  }

  sendDelete (val) {
    this.action.link = val
    this.action.method = 'delete'
    return this
  }

  goTo (val) {
    this.action.after = val
    return this
  }
}

class AlertModalMaker extends ModalMaker {
  constructor(){
    super('Delete', 'danger', true)
  }
}

class InfoModalMaker extends ModalMaker {
  constructor(){
    super('Confirm', 'info', true)
  }
}

class SuccessModalMaker extends ModalMaker {
  constructor(){
    super('Close', 'success', false)
  }
}

module.exports = {
  AlertModalMaker,
  InfoModalMaker,
  SuccessModalMaker,
}