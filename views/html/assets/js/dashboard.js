/* ===============
 * Dashboard
 * Generates widgets in the dashboard
 * For DEMO purposes only. Extract what you need.
 * =============== */
;(function ($) {
	'use strict'

	$(document).ready(function () {
		//  User creation
		$('#signUpForm').submit(function (e) {
			e.preventDefault()
			// or return false;
		})
		$('#createUser').click(async function (event) {
			event.preventDefault()
			var email = $(`input[name='email']`).val()
			var password = $(`input[name='pass']`).val()
			// var _username = $(`input[name='uname']`).val()
			let accesslocation = $('.form-select option:selected').text()
			var firstName = $(`input[name='fname']`).val()
			var lastName = $(`input[name='lname']`).val()
			if (accesslocation === 'Select a Location') {
				clearErrors()
				$(`#error`).append(`<div id="main-err" style="color:red;">Please select a location!<div>`)
				return
			}
			try {
				let data = {
					email,
					password,
					location: accesslocation,
					firstName,
					lastName,
				}
				console.log(data)
				axios
					.post('/signup', data)
					.then((res) => {
						console.log(res)
						clearErrors()
						$(`#signupMessage`).text('User created successfully')
						setTimeout(function () {
							$('#signupMessage').text('')
						}, 5000)
					})
					.catch((err) => handleSignUpErrors(err.response.data.errors))
				if (data.user) {
					$(`#signupMessage`).text('')
					$(`#signupMessage`).text('User created successfully')
				}
			} catch (err) {
				console.log(err)
			}
		})
		function clearErrors() {
			$(`#error`).empty()
		}

		function handleSignUpErrors(errors) {
			clearErrors()
			console.log(errors)
			let errorEl = $(`#error`)
			let div = ``
			for (const prop in errors) {
				if (errors[prop]) {
					div += `<p class="text-danger">${errors[prop]}</p>`
				}
			}
			errorEl.append(div)
		}

		// dropdown
		$(function () {
			$('.dropdown-menu li a').click(function () {
				$('.btn:first-child').text($(this).text())
				$('.btn:first-child').val($(this).text())
			})
		})

		$(`#addLocationBtn`).click(function (e) {
			console.log('add location button clicked')
			let errorEl = $(`#locationErrors`)
			errorEl.empty()
			let location = $(`input[name='newTestingLocation']`).val()
			let location2 = $(`input[name='newTestingLocation2']`).val()

			if (location === '' || location2 === '') {
				errorEl.append(`<p class="text-danger">Please enter a location</p>`)
				return
			}
			if (location !== location2) {
				errorEl.append(`<p class="text-danger">Location does not match</p>`)
				return
			}
			axios
				.post('/api/location', { name: location })
				.then((res) => {
					console.log(res)
					errorEl.append(`<p class="text-success">Location added!</p>`)
					setTimeout(function () {
						errorEl.empty()
					}, 3000)
				})
				.then(() => {
					location.val('')
					location2.val('')
				})
				.catch((err) => {
					if (err.response.data.error === 'Duplicate location') {
						errorEl.append(`<p class="text-danger">Location already exists</p>`)
					} else {
						errorEl.append(`<p class="text-danger">Something went wrong</p>`)
					}
				})
		})
		// ready ends
	})
	function initLocations(){
		axios.get('/api/location').then(res => {
			let locations = res.data
			let locationSelect = $('.form-select')
			let locationOptions = ''
			for (let i = 0; i < locations.length; i++) {
				locationOptions += `<option value="${locations[i]._id}">${locations[i].name}</option>`
			}
			locationSelect.append(locationOptions)
		})
	}
})(window.jQuery)
