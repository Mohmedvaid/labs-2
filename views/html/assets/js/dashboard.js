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
		let accesslocationArr = []
		$(`input:checkbox[name='userLocations']:checked`).each(function () {
			accesslocationArr.push($(this).val())
		})
		var firstName = $(`input[name='fname']`).val()
		var lastName = $(`input[name='lname']`).val()
		let userType = $(`#userType option:selected`).val()
		if (!firstName || !lastName) {
			clearErrors()
			return $(`#error`).append(`<div id="main-err" class="text-danger">Please enter your first and last name!<div>`)
		}
		if (accesslocationArr.length === 0) {
			clearErrors()
			return $(`#error`).append(`<div id="main-err" class="text-danger">Please select at least one location!<div>`)
		}
		if (userType === 'Select a user type') {
			clearErrors()
			return $(`#error`).append(`<div id="main-err" class="text-danger">Please select a user type!<div>`)
		}
		if (!password) {
			clearErrors()
			return $(`#error`).append(`<div id="main-err" class="text-danger">Please enter a password!<div>`)
		}
		if (!email) {
			clearErrors()
			return $(`#error`).append(`<div id="main-err" class="text-danger">Please enter an email!<div>`)
		}

		try {
			let data = {
				email,
				password,
				location: accesslocationArr,
				firstName,
				lastName,
				userType,
			}
			axios
				.post('/register', data)
				.then((res) => {
					console.log(res.data)
					clearErrors()
					$(`#signupMessage`).text('User created successfully')
					$(`#signUpForm`).trigger('reset')
					setTimeout(function () {
						$('#signupMessage').text('')
					}, 5000)
				})
				.catch((err) => handleSignUpErrors(err.response.data))
			if (data.user) {
				$(`#signupMessage`).text('')
				$(`#signupMessage`).text('User created successfully')
			}
		} catch (err) {
			console.log('error', err)
		}
	})
	function clearErrors() {
		$(`#error`).empty()
	}

	function handleSignUpErrors(errors) {
		clearErrors()
		console.log(errors)
		if (errors.message) {
			$(`#error`).append(`<div id="main-err" class="text-danger">${errors.message}<div>`)
			return
		}
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
	function initLocations() {
		axios.get('/api/location').then((res) => {
			let locations = res.data
			let checkBoxDiv = $(`#locationCheckboxes`)
			checkBoxDiv.empty()
			if (locations.length === 0) return checkBoxDiv.append(`<p>No locations added yet</p>`)
			locations.forEach((location) => {
				checkBoxDiv.append(`
				<input name="userLocations" type="checkbox" id="${location.name}" value=${location.name}>
				<label for="${location.name}">${location.name}</label>
			`)
			})
		})
	}
	function initAllUsers() {
		axios.get('/api/users').then(function (response) {
			let users = response.data
			let userSelect = $(`#allUsersSelect`)
			userSelect.empty()
			if (users.length === 0) return userSelect.append(`<option>No users added yet</option>`)
			users.forEach(function (user) {
				userSelect.append(
					$('<option>', {
						value: `${user._id}`,
						text: `${user.firstName} ${user.lastName} - ${user.email}`,
					})
				)
			})
		})
	}

	$(`#getLeadsByUsers`).click(function (e) {
		e.preventDefault()
		let date = $(`#daterangepicker`).val()

		if (date.toLowerCase() === 'select a date range') return alert('Please select a date range')
		let fromDate = date.split('-')[0].trim()
		let toDate = date.split('-')[1].trim()
		// dateRange objects are initialized in the script tags of dahboard.html
		let fromDateUTC = dateRange.fromDate
		let toDateUTC = dateRange.toDate
		if (!fromDateUTC || !toDateUTC) {
			alert('Please select a date range')
			return
		}
		let userID = $(`#allUsersSelect option:selected`).val()
		axios.get(`/api/customers/byUser/${userID}?fromDate=${fromDateUTC}&toDate=${toDateUTC}`).then((customerData) => {
			clearAppendResults(customerData.data, { fromDate, toDate })
			initInDateRangeCustomer(customerData.data)
			initDuplicateCustomers(customerData.data)
		})
	})

	function initDuplicateCustomers(customers) {
		var table = $('#duplicateCustomerTable')
		$(`#noDuplicateCustomer`).remove()

		var settings = {
			sDom: "<t><'row'<p i>>",
			destroy: true,
			scrollCollapse: true,
			oLanguage: {
				sLengthMenu: '_MENU_ ',
				sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
			},
			iDisplayLength: 5,
			aoColumns: [{ sWidth: '20%' }, { sWidth: '40%' }, { sWidth: '40%' }],
			// fnCreatedRow: function (nRow, aData, iDataIndex) {
			// 	$(nRow).attr('id', aData[2])
			//},
		}

		table.dataTable(settings)
		let duplicateCount = 0
		let tableNumbers = 0
		customers.forEach((customer) => {
			if (customer.isDuplicate > 0) {
				duplicateCount++
				table.fnAddData([`${tableNumbers + 1}`, `${customer.firstName} ${customer.lastName}`, `${customer.email}`])
			}
		})
		if (duplicateCount === 0) {
			table.append(`<p id="noDuplicateCustomer">No duplicate customers found</p>`)
		}

		// search box for table
		table.keyup(function () {
			table.fnFilter($(this).val())
		})
	}
	function clearAppendResults(customers, dates) {
		let resultAccordion = $(`#resultsAccordion`)
		resultAccordion.empty()
		let div = `
      <div class="row">
        <div class="col-md-4 d-flex justify-content-center align-items-center">
        Number of Customers from ${dates.fromDate} to ${dates.toDate}
        </div>
        <div class="col-md-6 d-flex justify-content-left align-items-center">
        ${customers.length}
        </div>
      </div>
    `
		resultAccordion.append(div)
	}

	function initInDateRangeCustomer(customers) {
		var table = $('#inRangeCustomersTable')

		var settings = {
			sDom: "<t><'row'<p i>>",
			destroy: true,
			scrollCollapse: true,
			oLanguage: {
				sLengthMenu: '_MENU_ ',
				sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
			},
			iDisplayLength: 5,
			aoColumns: [{ sWidth: '20%' }, { sWidth: '40%' }, { sWidth: '40%' }],
			// fnCreatedRow: function (nRow, aData, iDataIndex) {
			// 	$(nRow).attr('id', aData[2])
			//},
		}

		table.dataTable(settings)
		customers.forEach((customer, index) => {
			table.fnAddData([`${index + 1}`, `${customer.firstName} ${customer.lastName}`, `${customer.email}`])
		})

		// search box for table
		table.keyup(function () {
			table.fnFilter($(this).val())
		})
	}

	$(``)

	initLocations()
	initAllUsers()
})
