$(document).ready(function () {
	let spinner = $(`.loader-spinner`)
	spinner.addClass('hide')
	function getUrlQuery() {
		let query = window.location.search
		if (!query) return false
		return query.split('query=')[1]
	}

	$('#passResetForm').submit(function (e) {
		e.preventDefault()

		const messageDiv = $('#message')
		const pass1 = $('#passResetFormPass').val().trim()
		const pass2 = $('#passResetFormPass2').val().trim()

		if (pass1 !== pass2) {
			messageDiv.empty()
			messageDiv.append(`<div class="alert alert-danger mt-3">Passwords do not match</div>`)
			return
		}
		const token = getUrlQuery()
		console.log(token)
		if (!token) {
			messageDiv.empty()
			messageDiv.append(
				`<div class="alert alert-danger mt-3">Invalid Request, please click the email password link sent to your email.</div>`
			)
			return
		}
		spinner.addClass('hide')
		axios
			.post('/reset-password', { password: pass1, token: token })
			.then((res) => {
				clearErrors()
				messageDiv.append(
					`<div class="alert alert-success mt-3">Password reset successfully</div><a href="login">Please login</a>`
				)
				console.log(res.data)
				$(`#passResetForm`).trigger('reset').hide()
			})
			.catch((err) => handleErrors(err))
			.finally(() => spinner.addClass('hide'))
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
