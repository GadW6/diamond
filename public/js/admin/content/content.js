const inputChange = (e) => {
  e.preventDefault()
  const status = e.target.getAttribute('data-status')
  const pop = e.target.getAttribute('data-pop')
  const parentDiv = e.target.parentElement
  const newDiv = document.createElement('div')
  newDiv.className = 'input-group-append btn-group ml-n1'
  newDiv.style.zIndex = '5'
  newDiv.innerHTML = `
      <button class="input-group-text bg-success border-right-0" onclick="saveToDb(event)"><i class="fas fa-check text-light"></i></button>
      <button class="input-group-text bg-danger" onclick="cancelChange(event)"><i class="fas fa-times text-light" style="min-width: 16px;"></i></button>
    `
  if (status === 'false') {
    e.target.setAttribute('data-status', 'true')

    parentDiv.append(newDiv)
  } else if (pop === e.target.value && status === 'true') {
    e.target.setAttribute('data-status', 'false')

    e.target.nextElementSibling.remove()
  }
}

const cancelChange = (e) => {
  let inputField = e.target.closest('.input-group').firstElementChild
  if (inputField.classList[0] !== 'form-control') {
    inputField = e.target.closest('.input-group').children[1]
  }
  const pop = inputField.getAttribute('data-pop')

  e.target.closest('.input-group-append').remove()
  inputField.setAttribute('data-status', 'false')
  inputField.value = pop
}

const saveToDb = (e) => {
  let inputField = e.target.closest('.input-group').firstElementChild
  if (inputField.classList[0] !== 'form-control') {
    inputField = e.target.closest('.input-group').children[1]
  }
  fetch('/admin/content', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: inputField.getAttribute('data-key'),
        value: inputField.value
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        e.target.closest('.input-group-append').remove()
        inputField.setAttribute('data-status', 'false')
        inputField.setAttribute('data-pop', inputField.value)
        inputField.style.backgroundColor = 'limegreen'
        inputField.style.color = '#EBEBEB'

        setTimeout(() => {
          inputField.style.backgroundColor = 'white'
          inputField.style.color = '#495057'
        }, 750);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const addSection = (e) => {
  const main = e.target.parentElement.children[1]
  const dest = (e.target.parentElement.id === 'nav-terms') ? 'termsBody' : 'privacyBody'
  const index = document.querySelectorAll(`#${main.id}>.form.border.rounded.p-3`).length
  const newDiv = document.createElement('div')

  newDiv.setAttribute('data-pos', `${dest}-${index}`)
  newDiv.className = 'form border rounded p-3 my-2'
  newDiv.innerHTML = `
      <h6 class="text-center">
        <mark class="alert-primary mr-n3">Section ${index}</mark>
        <button class="float-right rounded-circle mt-n1 mr-n1" onclick="cancelSection(event)"><i class="fas fa-times-circle text-secondary"></i></button>
        <button class="float-right rounded-circle mt-n1" onclick="confirmSection(event)"><i class="fas fa-check-circle text-success"></i></button>
      </h6>
      <div class="form-group">
        <label class="control-label">Sub-Title:</label>
        <div class="form-group">
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="title" value=""
              data-status="false" data-pop=""
              data-key="${dest}-${index}-sub" oninput="">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">Paragraph:</label>
        <div class="form-group">
          <div class="input-group mb-3">
            <textarea data-status="false" data-pop=""
              data-key="${dest}-${index}-para" class="form-control" rows="5"
              oninput=""></textarea>
          </div>
        </div>
      </div>
  `
  main.appendChild(newDiv)
  e.target.remove()
}

const cancelSection = (e) => {
  const divTarget = e.target.closest('.tab-pane')
  e.target.closest('.form.border.rounded.p-3.my-2').remove()

  const newBtn = document.createElement('button')
  newBtn.className = 'btn btn-outline-secondary w-100'
  newBtn.id = 'add-terms-section-btn'
  newBtn.innerText = 'Add Section'
  newBtn.onclick = (e) => {
    addSection(event)
  }
  divTarget.appendChild(newBtn)
}

const confirmSection = e => {
  const card = e.target.closest('.form.border.rounded.p-3.my-2')
  const subField = card.children[1].children[1].firstElementChild
    .firstElementChild
  const paraField = card.children[2].children[1].firstElementChild
    .firstElementChild

  if (!subField.value || !paraField.value) {
    subField.style.borderColor = 'red'
    paraField.style.borderColor = 'red'
    if (subField.value) {
      subField.style.borderColor = '#ced4da'
    }
    if (paraField.value) {
      paraField.style.borderColor = '#ced4da'
    }
  }
  if (subField.value && paraField.value) {
    fetch('/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: subField.getAttribute('data-key'),
          value: {
            sub: subField.value,
            para: paraField.value
          }
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          const divTarget = e.target.closest('.tab-pane')

          //// Setting 'Add Section' Button
          const newBtn = document.createElement('button')
          newBtn.className = 'btn btn-outline-secondary w-100'
          newBtn.id = 'add-terms-section-btn'
          newBtn.innerText = 'Add Section'
          newBtn.onclick = (e) => {
            addSection(e)
          }
          divTarget.appendChild(newBtn)

          //// Resetting Validation
          subField.style.borderColor = '#ced4da'
          paraField.style.borderColor = '#ced4da'
          card.querySelectorAll('button').forEach(btn => {
            btn.remove()
          })

          //// Setting 'Trash' Button
          const header = card.querySelector('h6.text-center')
          const newBtnTrash = document.createElement('button')
          newBtnTrash.className = 'float-right rounded-circle mt-n1 mr-n1'
          newBtnTrash.onclick = (e) => {
            removeSection(e)
          }
          newBtnTrash.innerHTML = '<i class="fas fa-trash-alt text-danger"></i>'
          header.appendChild(newBtnTrash)

          //// Setting Data Attribute & oninput
          subField.setAttribute('data-pop', subField.value)
          subField.oninput = (e) => {
            inputChange(e)
          }
          paraField.setAttribute('data-pop', paraField.value)
          paraField.oninput = (e) => {
            inputChange(e)
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

const removeSection = (e) => {
  const card = e.target.closest('.form.border.rounded.p-3.my-2')
  const seq = card.getAttribute('data-pos')
  const [dest, index] = seq.split('-')
  fetch('/admin/content', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: dest,
        value: index
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        card.remove()
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}