// Adding UI Element
const viewBtnHover = document.querySelectorAll(
  'tbody td.input-group button:first-child'
)
const parentImgDisplay = document.querySelector('#img-display')
const imgDisplay = document.querySelector('#img-display img')
const modifyBtn = document.querySelectorAll('a.modify-row')

// Adding Event Listeners
viewBtnHover.forEach(btn => {
  btn.addEventListener('mouseover', e => {
    const hrefTarget = e.target.getAttribute('href')
    imgDisplay.setAttribute('src', hrefTarget)
    parentImgDisplay.classList.remove('d-none')
    parentImgDisplay.classList.add('d-flex')
  })
  btn.addEventListener('mouseleave', () => {
    parentImgDisplay.classList.remove('d-flex')
    parentImgDisplay.classList.add('d-none')
  })
})

modifyBtn.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault()
    const targetDiv =
      e.target.parentElement.parentElement.parentElement.parentElement
    const tableBody = document.querySelector('tbody')
    const formTR = document.createElement('tr')
    formTR.className = 'table-info'
    let siblingTarget, trTarget

    if (e.target.classList.contains('modifyC')) {
      siblingTarget = targetDiv.parentElement.nextElementSibling
      trTarget = targetDiv.parentElement
    }
    if (e.target.classList.contains('modifyP')) {
      siblingTarget = targetDiv.nextElementSibling
      trTarget = targetDiv
    }

    formTR.innerHTML = `
    <tr>
      <td colspan="5" class="px-5">
        <form class="text-center">
          <div class="form-group d-flex align-items-center">
            <label class="m-0 " for="input-title">Title:</label>
            <input type="text" class="form-control ml-3" id="input-title" aria-describedby="input title"
              value="${trTarget.childNodes[3].textContent}">
          </div>
          <div class="form-group d-flex align-items-start">
            <label class="m-0 " for="input-description">Description:</label>
            <textarea class="form-control ml-3" id="input-description" rows="3">${trTarget.childNodes[5].textContent}</textarea>
          </div>
          <button type="button" class="btn text-dark btn-outline-secondary disabled" onclick="saveFields(event,'${trTarget.id}')">save</button>
          <button type="button" class="btn disabled" onclick="closeFields('${trTarget.id}')">cancel</button>
        </form>
      </td>
    </tr>
    `

    tableBody.insertBefore(formTR, siblingTarget)
  })
})

// Callable Functions
const saveFields = (e, id) => {
  e.preventDefault()
  const titleField = e.target.parentElement.children[0].children[1].value
  const descField = e.target.parentElement.children[1].children[1].value

  fetch('/admin/gallery', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        title: titleField,
        description: descField
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'Success') e.target.parentElement.submit()
      else console.log('Issue with Fetch')
    })
}

const closeFields = id => {
  document.getElementById(id).nextElementSibling.remove()
}

const openImageForm = () => {
  // UI Elements
  const addImgForm = document.querySelector('form#add-img-form')
  const addImgBtn = document.querySelector('#add-img-btn')

  // Actions
  addImgForm.classList.remove('d-none')
  addImgForm.classList.add('d-block')
  addImgBtn.classList.remove('d-block')
  addImgBtn.classList.add('d-none')
}

const cancelAddPic = (e) => {
  e.preventDefault()
  const addImgBtn = document.querySelector('#add-img-btn')
  e.target.parentElement.parentElement.classList.remove('d-block')
  e.target.parentElement.parentElement.classList.add('d-none')
  addImgBtn.classList.add('d-block')
}

const openModal = (id) => {
  const modal = document.querySelector('#removePicture .modal-footer')
  modal.lastElementChild.onclick = () => MyStore.modalAction(`/admin/gallery/${id}`, 'delete', '/admin/gallery')
}

const upImg = (e) => {
  if (e.target.files.length > 0) {
    const fileName = e.target.files[0].name
    const fieldName = e.target.nextElementSibling

    if (e.target.files[0].size > (1024 * 1024 * 5)) {
      fieldName.innerHTML = `<p class="text-danger">Size exceeded !</p>`
    } else if (fileName.split('.').reverse()[0] === 'png' || fileName.split('.').reverse()[0] === 'PNG' || fileName.split('.').reverse()[0] === 'jpg' || fileName.split('.').reverse()[0] === 'JPG' || fileName.split('.').reverse()[0] === 'jpeg' || fileName.split('.').reverse()[0] === 'JPEG') {
      fieldName.innerText = fileName
    } else {
      fieldName.innerHTML = `<p class="text-danger">Type not supported !</p>`
    }
  }
}

const uploadValid = (e) => {
  // UI Elements
  const form = e.target.parentElement.parentElement
  const uploadField = form.children[2].children[0]
  const uploadFiles = uploadField.firstElementChild.files
  const titleField = form.children[2].children[1].children[1]
  const descField = form.children[2].children[2].children[1]

  // Logic
  if (uploadFiles.length === 0) {
    e.preventDefault()
    uploadField.children[1].classList.add('border-danger')
  } else if (!(uploadFiles[0].name.split('.').reverse()[0] === 'png' || uploadFiles[0].name.split('.').reverse()[0] === 'PNG' || uploadFiles[0].name.split('.').reverse()[0] === 'jpg' || uploadFiles[0].name.split('.').reverse()[0] === 'JPG' || uploadFiles[0].name.split('.').reverse()[0] === 'jpeg' || uploadFiles[0].name.split('.').reverse()[0] === 'JPEG')) {
    e.preventDefault()
    uploadField.children[1].classList.add('border-danger')
  } else if (uploadFiles[0].size > (1024 * 1024 * 5)) {
    e.preventDefault()
    uploadField.children[1].classList.add('border-danger')
  } else {
    if (uploadField.children[1].classList.contains('border-danger')) {
      uploadField.children[1].classList.remove('border-danger')
    }
  }
  if (!titleField.value) {
    e.preventDefault()
    titleField.classList.add('border-danger')
  } else if (titleField.value && titleField.classList.contains('border-danger')) {
    titleField.classList.remove('border-danger')
  }
  if (!descField.value) {
    e.preventDefault()
    descField.classList.add('border-danger')
  } else if (descField.value && descField.classList.contains('border-danger')) {
    descField.classList.remove('border-danger')
  }
}