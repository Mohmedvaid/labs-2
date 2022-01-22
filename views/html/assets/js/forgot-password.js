$(document).ready(function () {
	let spinner = $(`#spinner`)
	spinner.hide()

	$('#forgotPassForm').submit(function (e) {
		e.preventDefault()
		clearErrors()

		spinner.show()
		let email = $('#forgotPassEmail').val()
		axios
			.post('/forgot-password', { email })
			.then((res) => {
				$('#forgotPassEmail').val('')
				$(`#message`).append(`<div class="alert alert-success mt-3">${res.data.message}</div>`)
			})
			.catch((err) => handleErrors(err))
			.finally(() => spinner.hide())
	})

	const handleErrors = (errors) => {
		console.log(errors.response)
		let message = errors.response.data.message ? errors.response.data.message : 'Something went wrong'
		let messageDiv = $('#message')
		messageDiv.empty()
		messageDiv.append(`<div class="alert alert-danger mt-3">${message}</div>`)
	}

	const clearErrors = () => {
		let messageDiv = $('#message')
		messageDiv.empty()
	}

	// ready ends
})
