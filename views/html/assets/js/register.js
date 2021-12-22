$(document).ready(function () {
	$('form').submit(function (e) {
		e.preventDefault()
		// or return false;
	})
	$('#btn-signup').click(async function (event) {
		event.preventDefault()
		var email = $(`input[name='email']`).val()
		var password = $(`input[name='pass']`).val()
		// var _username = $(`input[name='uname']`).val()
		let accesslocation = $('.form-select option:selected').text()
		var _fname = $(`input[name='fname']`).val()
		var _lname = $(`input[name='lname']`).val()
		if (accesslocation === 'Select a Location') {
			clearErrors()
			$(`#error`).append(`<div id="main-err" style="color:red;">Please select a location!<div>`)
			return
		}
		try {
			const res = await fetch('/signup', {
				method: 'POST',
				body: JSON.stringify({ email, password, location: accesslocation }),
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await res.json()
			console.log(data)
			if (data.errors) {
				clearErrors()
				if (data.errors.email)
					$(`#error`).append(`<div id="main-err" style="color:red;">${data.errors.email}<div>`)
				if (data.errors.password)
					$(`#error`).append(`<div id="main-err" style="color:red;">${data.errors.password}<div>`)
				if (data.errors.location)
					$(`#error`).append(`<div id="main-err" style="color:red;">${data.errors.location}<div>`)
			}
			if (data.user) {
				location.assign('/dashboard')
			}
		} catch (err) {
			console.log(err)
		}
	})
	function clearErrors() {
		$('#error').empty()
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
