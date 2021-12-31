/* ===============
 * DataTables
 * Generate advanced tables with sorting, export options using
 * jQuery DataTables plugin
 * For DEMO purposes only. Extract what you need.
 * =============== */
;(function ($) {
	'use strict'

	var responsiveHelper = undefined
	var breakpointDefinition = {
		tablet: 1024,
		phone: 480,
	}
	let customerSignature = ''
	FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize)
	FilePond.parse(document.body)
	//   FilePond.create(document.querySelector('.filepond'), {
	//     acceptedFileTypes: ['image/*'],
	//   });
	// Customer Spinner
	hideNewCustomerSpinner()
	function showNewCustomerSpinner() {
		$(`#addCustomerSpinner`).show()
	}
	function hideNewCustomerSpinner() {
		$(`#addCustomerSpinner`).css('display', 'none')
	}

	// Initialize datatable showing a search box at the top right corner
	var initTableWithSearch = async function () {
		var table = $('#tableWithSearch')

		var settings = {
			sDom: "<t><'row'<p i>>",
			destroy: true,
			scrollCollapse: true,
			oLanguage: {
				sLengthMenu: '_MENU_ ',
				sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
			},
			iDisplayLength: 5,
			fnCreatedRow: function (nRow, aData, iDataIndex) {
				$(nRow).attr('id', aData[6])
			},
		}

		table.dataTable(settings)

		let customers = await getCustomers()
		customers.forEach((customer) => {
			table.fnAddData([
				customer.firstName,
				customer.lastName,
				customer.email,
				customer.address,
				customer.location,
				`${
					customer.image
						? `<a href="${customer.image.path}" data-lightbox="${customer.image.path}">
							<img style="width:50%" src="${customer.image.path}">
						</a>`
						: '<p>No ID Found</p>'
				}`,
				customer._id,
			])
		})

		$(`#tableWithSearch td`).addClass('v-align-middle')
		// search box for table
		$('#search-table').keyup(function () {
			table.fnFilter($(this).val())
		})
		initAddNewCustomer(table)
	}
	function getCustomers() {
		return axios.get('/api/customer').then((response) => {
			return response.data
		})
	}

	// Initialize datatable with ability to add rows dynamically
	var initAddNewCustomer = function (table) {
		$('#show-modal').click(function () {
			$('#addNewAppModal').modal('show')
		})

		// Add customers
		$('#addCustomerForm').submit(function (e) {
			e.preventDefault()
			let form = $(this)
			let file = $(`input[name="idImage"`).prop('files')
			let testingLocation = $('select#addCustomerLocationSelector option:selected').val()

			let formData = new FormData()
			if (file.length === 0) {
				clearErrors()
				$(`#errors`).append(
					`<div id="main-err" style="color:red;">Please upload an image of a valid ID</div>`
				)
				return
			}
			if (!testingLocation) {
				clearErrors()
				$(`#errors`).append(`<div id="main-err" style="color:red;">Please select a location</div>`)
				return
			}
			clearErrors()
			for (let i = 0; i < file.length; i++) {
				formData.append('idImage', file[i])
			}
			formData.append('location', testingLocation)
			let initialFormData = form.serializeArray()
			initialFormData.forEach((data) => {
				formData.append(data.name, data.value)
			})

			showNewCustomerSpinner()
			axios
				.post('/api/customer', formData)
				.then(({ data: customer }) => {
					console.log(customer)
					table.fnAddData([
						customer.firstName,
						customer.lastName,
						customer.email,
						customer.address,
						customer.location,
						`${
							customer.image
								? `<a href="${customer.image.path}" data-lightbox="${customer.image.path}">
							<img style="width:100%" src="${customer.image.path}">
						</a>`
								: '<p>No ID Found</p>'
						}`,
						customer._id,
					])
				})
				.then(() => hideNewCustomerSpinner())
				.then(() => $('#addNewAppModal').modal('hide'))
				.then(() => $('#addCustomerForm').trigger('reset'))
				.then(removeEmptyTableMessage)
				.catch(handleError)
		})
	}

	function removeEmptyTableMessage() {
		$(`#noTableDataMessage`).remove()
	}

	function handleError(err) {
		clearErrors()
		hideNewCustomerSpinner()
		console.log(err)
		if (err.response.data.message) {
			$(`#errors`).append(
				`<div id="main-err" style="color:red;">${err.response.data.message}</div>`
			)
		} else {
			$(`#errors`).append(
				`<div id="main-err" style="color:red;">Hmmm, somethingn went wrong...</div>`
			)
		}
	}

	function clearErrors() {
		$(`#errors`).empty()
	}
	$(document).on('click', '#tableWithSearch > tbody > tr', function () {
		let customerID = $(this).attr('id')
		axios
			.get(`/api/customer/${customerID}`)
			.then((res) => showCustomerInfoModal(res.data, customerID))
			.catch((err) => {
				console.log(err)
			})
	})

	function showCustomerInfoModal(customer, customerID) {
		let newObj = cleanMongooseObject(customer)
		generateCustomerDetailTable(newObj, customerID)
		$(`#customerInfoBtn`).click()
	}
	function generateCustomerDetailTable(customer, customerID) {
		let access = localStorage.getItem('location')
		let printBtn = ''
		if (access.toLowerCase() === 'all') {
			$(`#editLink`).remove()
			let editBtn = `<a class="pull-right" id="editLink" href="/edit-customer?${customerID}"><button class="btn btn-primary btn-sm" id="editCustomerBtn">Edit</button></a>`
			$(editBtn).insertBefore(`#detailedTable`)
		}
		let tr = ''
		for (const property in customer) {
			const updatedProp = property.replace(/([A-Z])/g, ' $1')
			const finalResult = updatedProp.charAt(0).toUpperCase() + updatedProp.slice(1)
			let propName = property.toLowerCase()
			let testResultsDiv = ``
			if (propName === 'testresults') {
				if (customer[property].length > 0) {
					customer[property].forEach((result) => {
						testResultsDiv += `<a class="m-1" href="${result.path}">${result.name}</a>`
					})
				} else {
					testResultsDiv = `<p>Pending</p>`
				}
			}
			tr += `
			<tr>
				<td class="v-align-middle semi-bold">${finalResult}</td>
				<td class="v-align-middle">
							  ${
									propName === 'image'
										? `<a href="${customer[property].path}" data-lightbox="${customer[property].path}">
							<img style="width:50%" src="${customer[property].path}">
						</a>`
										: propName === 'customersignature' || propName === 'qrcodeurl'
										? `<a href="${customer[property]}" data-lightbox="${customer[property]}">
							<img style="width:50%" src="${customer[property]}">
						</a>`
										: propName === 'testresults'
										? testResultsDiv
										: customer[property]
								}</td>
			</tr>`
		}
		$('#customerDetailTable').empty().append(tr)
	}
	function cleanMongooseObject(obj) {
		for (const property in obj) {
			if (
				property === '_id' ||
				property === '__v' ||
				property === 'createdAt' ||
				property === 'updatedAt' ||
				property === 'id' ||
				property === 'imageType'
			) {
				delete obj[property]
			}
		}
		return obj
	}
	// Electronic Signature
	;(function () {
		window.requestAnimFrame = (function (callback) {
			return (
				window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimaitonFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60)
				}
			)
		})()

		var canvas = document.getElementById('sig-canvas')
		var ctx = canvas.getContext('2d')
		ctx.strokeStyle = '#222222'
		ctx.lineWidth = 4

		var drawing = false
		var mousePos = {
			x: 0,
			y: 0,
		}
		var lastPos = mousePos

		canvas.addEventListener(
			'mousedown',
			function (e) {
				drawing = true
				lastPos = getMousePos(canvas, e)
			},
			false
		)

		canvas.addEventListener(
			'mouseup',
			function (e) {
				drawing = false
			},
			false
		)

		canvas.addEventListener(
			'mousemove',
			function (e) {
				mousePos = getMousePos(canvas, e)
			},
			false
		)

		// Add touch event support for mobile
		canvas.addEventListener('touchstart', function (e) {}, false)

		canvas.addEventListener(
			'touchmove',
			function (e) {
				var touch = e.touches[0]
				var me = new MouseEvent('mousemove', {
					clientX: touch.clientX,
					clientY: touch.clientY,
				})
				canvas.dispatchEvent(me)
			},
			false
		)

		canvas.addEventListener(
			'touchstart',
			function (e) {
				mousePos = getTouchPos(canvas, e)
				var touch = e.touches[0]
				var me = new MouseEvent('mousedown', {
					clientX: touch.clientX,
					clientY: touch.clientY,
				})
				canvas.dispatchEvent(me)
			},
			false
		)

		canvas.addEventListener(
			'touchend',
			function (e) {
				var me = new MouseEvent('mouseup', {})
				canvas.dispatchEvent(me)
			},
			false
		)

		function getMousePos(canvasDom, mouseEvent) {
			var rect = canvasDom.getBoundingClientRect()
			return {
				x: mouseEvent.clientX - rect.left,
				y: mouseEvent.clientY - rect.top,
			}
		}

		function getTouchPos(canvasDom, touchEvent) {
			var rect = canvasDom.getBoundingClientRect()
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top,
			}
		}

		function renderCanvas() {
			if (drawing) {
				ctx.moveTo(lastPos.x, lastPos.y)
				ctx.lineTo(mousePos.x, mousePos.y)
				ctx.stroke()
				lastPos = mousePos
			}
		}

		// Prevent scrolling when touching the canvas
		document.body.addEventListener(
			'touchstart',
			function (e) {
				if (e.target == canvas) {
					e.preventDefault()
				}
			},
			false
		)
		document.body.addEventListener(
			'touchend',
			function (e) {
				if (e.target == canvas) {
					e.preventDefault()
				}
			},
			false
		)
		document.body.addEventListener(
			'touchmove',
			function (e) {
				if (e.target == canvas) {
					e.preventDefault()
				}
			},
			false
		)
		;(function drawLoop() {
			requestAnimFrame(drawLoop)
			renderCanvas()
		})()

		function clearCanvas() {
			canvas.width = canvas.width
		}

		// Set up the UI
		var sigText = $('#sig-dataUrl')
		var sigImage = document.getElementById('sig-image')
		var clearBtn = document.getElementById('sig-clearBtn')
		var submitBtn = document.getElementById('sig-submitBtn')
		clearBtn.addEventListener(
			'click',
			function (e) {
				e.preventDefault()
				clearCanvas()
				sigText.innerHTML = 'Data URL for your signature will go here!'
				sigImage.setAttribute('src', '/assets/img/sign-required.png')
			},
			false
		)
		submitBtn.addEventListener(
			'click',
			function (e) {
				e.preventDefault()
				customerSignature = canvas.toDataURL()
				sigText.val(customerSignature)
				sigImage.setAttribute('src', customerSignature)
			},
			false
		)
	})()

	$('#clearNewCustomerForm').click(function () {
		$('#addCustomerForm').trigger('reset')
	})
	// add locations
	function addLocationToSelect() {
		axios.get('/api/locations').then(function (response) {
			let locations = response.data
			let locationSelect = $(`.testing-location-ddl`)
			locationSelect.empty()
			locations.forEach(function (location) {
				locationSelect.empty().append(
					$('<option>', {
						value: `${location.name}`,
						text: `${location.name}`,
					})
				)
			})
		})
	}

	initTableWithSearch()
	// addLocationToSelect()
})(window.jQuery)
