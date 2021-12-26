/* ============================================================
 * DataTables
 * Generate advanced tables with sorting, export options using
 * jQuery DataTables plugin
 * For DEMO purposes only. Extract what you need.
 * ============================================================ */
;(function ($) {
	'use strict'

	var responsiveHelper = undefined
	var breakpointDefinition = {
		tablet: 1024,
		phone: 480,
	}
	FilePond.registerPlugin(
		FilePondPluginImagePreview,
		FilePondPluginImageResize,
		FilePondPluginFileEncode
	)
	FilePond.parse(document.body)
	// Customer Spinner
	hideNewCustomerSpinner()
	function showNewCustomerSpinner() {
		$(`#addCustomerSpinner`).show()
	}
	function hideNewCustomerSpinner() {
		$(`#addCustomerSpinner`).css('display', 'none')
	}

	// Initialize datatable showing a search box at the top right corner
	var initTableWithSearch = function () {
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
		}

		table.dataTable(settings)

		// search box for table
		$('#search-table').keyup(function () {
			table.fnFilter($(this).val())
		})
	}

	// Initialize datatable with ability to add rows dynamically
	var initTableWithDynamicRows = function () {
		var table = $('#tableWithDynamicRows')

		var settings = {
			sDom: "<t><'row'<p i>>",
			destroy: true,
			scrollCollapse: true,
			oLanguage: {
				sLengthMenu: '_MENU_ ',
				sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
			},
			iDisplayLength: 5,
		}

		table.dataTable(settings)

		$('#show-modal').click(function () {
			$('#addNewAppModal').modal('show')
		})

		// Add customers

		$('#addCustomerForm').submit(function (e) {
			e.preventDefault()
			let form = $(this)
			let payload = form.serialize()
			showNewCustomerSpinner()
			axios
				.post('/api/customer', payload)
				.then(({ data }) => {
					console.log(data)
					let td = ` <tr>
		              <td class="v-align-middle semi-bold">
		                <p>${data.firstName}</p>
		              </td>
		              <td class="v-align-middle">
		                <p>${data.lastName}</p>
		              </td>
		              <td class="v-align-middle">
		                <p>${data.email}</p>
		              </td>
		              <td class="v-align-middle">
		                <p>${data.address}</p>
		              </td>
		             <td class="v-align-middle">
		                <p>${data.location}</p>
		              </td>
					  					  <td class="v-align-middle">
					  ${
							data.image
								? `<a href="${data.image}" data-lightbox="${data.image}" data-title="My caption">
							<img style="width:100%" src="${data.image}">
						</a>`
								: '<p>No ID Found</p>'
						}
                      </td>
		            </tr>`
					$('tbody').append(td)
				})
				.then(() => hideNewCustomerSpinner())
				.then(() => $('#addNewAppModal').modal('hide'))
				.catch(handleError)
		})
	}

	function handleError(err) {
		clearErrors()
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

	// Initialize datatable showing export options
	var initTableWithExportOptions = function () {
		var table = $('#tableWithExportOptions')

		var settings = {
			sDom: "<'exportOptions'T><'table-responsive sm-m-b-15't><'row'<p i>>",
			destroy: true,
			scrollCollapse: true,
			oLanguage: {
				sLengthMenu: '_MENU_ ',
				sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
			},
			iDisplayLength: 5,
			oTableTools: {
				sSwfPath: 'assets/plugins/jquery-datatable/extensions/TableTools/swf/copy_csv_xls_pdf.swf',
				aButtons: [
					{
						sExtends: 'csv',
						sButtonText: "<i class='pg-grid'></i>",
					},
					{
						sExtends: 'xls',
						sButtonText: "<i class='fa fa-file-excel-o'></i>",
					},
					{
						sExtends: 'pdf',
						sButtonText: "<i class='fa fa-file-pdf-o'></i>",
					},
					{
						sExtends: 'copy',
						sButtonText: "<i class='fa fa-copy'></i>",
					},
				],
			},
			fnDrawCallback: function (oSettings) {
				$('.export-options-container').append($('.exportOptions'))

				$('#ToolTables_tableWithExportOptions_0').tooltip({
					title: 'Export as CSV',
					container: 'body',
				})

				$('#ToolTables_tableWithExportOptions_1').tooltip({
					title: 'Export as Excel',
					container: 'body',
				})

				$('#ToolTables_tableWithExportOptions_2').tooltip({
					title: 'Export as PDF',
					container: 'body',
				})

				$('#ToolTables_tableWithExportOptions_3').tooltip({
					title: 'Copy data',
					container: 'body',
				})
			},
		}

		table.dataTable(settings)
	}

	function initTableData() {
		let temp = ''
		showNewCustomerSpinner()
		axios
			.get('/api/customer')
			.then((res) => {
				console.log(res.data)
				if (res.data.length > 0) {
					return res.data.forEach((customer) => {
						temp += ` <tr>
                      <td class="v-align-middle semi-bold">
                        <p>${customer.firstName}</p>
                      </td>
                      <td class="v-align-middle">
                        <p>${customer.lastName}</p>
                      </td>
                      <td class="v-align-middle">
                        <p>${customer.email}</p>
                      </td>
                      <td class="v-align-middle">
                        <p>${customer.address}</p>
                      </td>
                     <td class="v-align-middle">
                        <p>${customer.location}</p>
                      </td>
					  <td class="v-align-middle">
					  ${
							customer.image
								? `<a href="${customer.image}" data-lightbox="${customer.image}" data-title="My caption">
							<img style="width:100%" src="${customer.image}">
						</a>`
								: '<p>No ID Found</p>'
						}
                      </td>
					 <td class="v-align-middle">
                        <p>${customer.result ? customer.result : '<p>Pending</p>'}</p>
                      </td>
                    </tr>`
					})
				}
				temp = `<tr class="odd"><td valign="top" colspan="6" class="dataTables_empty">No data available in table</td></tr>`
				return
			})
			.then(() => $('tbody').append(temp))
			.then(() => hideNewCustomerSpinner())
	}

	function clearErrors() {
		$(`#errors`).empty()
	}
	initTableWithSearch()
	initTableWithDynamicRows()
	initTableWithExportOptions()
	initTableData()
})(window.jQuery)
