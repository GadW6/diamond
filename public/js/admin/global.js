const collapsed = e => {
	e.preventDefault();
	const collapsedState = MyStore.parseToBool(e.target.getAttribute('aria-expanded'))
	const collapsedList = document.querySelector('.collapse')
	e.target.setAttribute('aria-expanded', !collapsedState)
	if (collapsedState) {
		collapsedList.classList.remove('show')
		collapsedList.classList.add('hide')
	} else {
		collapsedList.classList.remove('hide')
		collapsedList.classList.add('show')
	}
}

const collapsedState = e => {
	const collapsedState = MyStore.parseToBool(e.target.getAttribute('aria-expanded'))
	if (collapsedState) e.target.lastElementChild.style.display = 'none'
	else e.target.lastElementChild.style.display = 'inline'
}

function openNav() {
	document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
	document.getElementById("myNav").style.height = "0%";
}

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})