/* ===============
 * Dashboard
 * Generates widgets in the dashboard
 * For DEMO purposes only. Extract what you need.
 * =============== */
;(function ($) {
	'use strict'

	$(document).ready(function () {
		//  User creation
		$(document).ready(function () {
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
			// ready ends
		})

		// Ready Ends
	})
})(window.jQuery)
