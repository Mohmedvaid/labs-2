$(document).ready(function () {
	let userNameEl = $(`#userNameTopRight`)
	let userNames = JSON.parse(localStorage.getItem('userName'))
	userNameEl.empty()
	userNameEl.text(`${userNames.firstName} ${userNames.lastName}`)

	// clear cache on logout
	$('#logoutBtn').click(function () {
		localStorage.clear()
	})
	// Ready ends
})
