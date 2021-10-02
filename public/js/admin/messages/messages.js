// UI Elements
const mailRows = document.querySelectorAll('tr[data-href]')
mailRows.forEach(row => {
    row.addEventListener('click', (e) => {
    const targetHref = e.target.parentElement.getAttribute('data-href')
    window.location.href = targetHref
    })
})