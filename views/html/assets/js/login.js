$(document).ready(function () {
	//form submit
	$('#btn-login').click(function (event) {
		event.preventDefault()
		var _email = $(`input[name='email']`).val()
		var _password = $(`input[name='password']`).val()
		if (!_email || !_password) {
			clearErrors()
			let err = '<div id="main-err" style="color:red;">Please enter a valid credentials.<div>'
			$(err).insertAfter('h2')
			return
		}
		clearErrors()
		axios
			.post('/login', {
				email: _email,
				password: _password,
			})
			.then((res) => {
				let { location: userLocation, userType, firstName, lastName } = res.data
				localStorage.setItem('location', JSON.stringify(userLocation))
				localStorage.setItem('userType', JSON.stringify(userType))
				localStorage.setItem('userName', JSON.stringify({ firstName, lastName }))
				if (res.data.userType === 'admin') location.assign('/dashboard')
				else location.assign('/customers')
			})
			.catch(handleError)
	})

	function handleError(err) {
		let formErr,
			status = err.response.status,
			data = err.response.data
		if (status === 400 || status === 401) {
			formErr = `<div id="main-err" style="color:red;">${data.error}<div>`
		} else {
			formErr = '<div id="main-err" style="color:red;">Something went wrong.<div>'
		}
		clearErrors()
		$(formErr).insertAfter('h2')
	}

	function clearErrors() {
		$('#main-err').remove()
	}

	// ready ends below
})
