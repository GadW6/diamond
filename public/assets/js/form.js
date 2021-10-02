// Executable Functions
const sendMail = async (e) => {
  const spinner = document.getElementsByClassName('loadingio-spinner-rolling-mw05eust31m')[0]
  spinner.style.display = 'inline-block'
  const nameRegx = /^[a-z ,.'-]+$/i
  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const nameField = document.getElementById('name')
  const nameVal = nameField.value.trim().match(nameRegx)
  const emailField = document.getElementById('email')
  const emailVal = emailField.value.trim().match(emailRegx)
  const bodyField = document.getElementById('message')
  const bodyVal = bodyField.value.trim()
  const msg = document.querySelector('#msgText')

  const loadingMessage = (msgInput, colorText, loadingTime, flashingTime) => {
    setTimeout(() => {
      spinner.style.display = 'none'
      msg.innerText = msgInput
      msg.style.display = 'block'
      msg.style.color = colorText
    }, loadingTime)
    setTimeout(() => {
      msg.style.display = 'none'
    }, (loadingTime + flashingTime));
  }
  
  if (nameVal && emailVal && bodyVal) {
    try {
      let response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal.input,
          email: emailVal.input,
          body: bodyVal
        })
      })
      response = await response.json()
      if (response.status === 'success') {
        loadingMessage('Your mail was sent succesfully', 'green', 1500, 3000)
        nameField.value = emailField.value = bodyField.value = ''
      }
    } catch (error) {
      loadingMessage(`Oops! There was an error fetching data... Error: ${error}`, 'red', 0, 3000)
    }
  } else {
    loadingMessage('* Please fill out all fields properly', 'red', 0, 3000)
  }
}