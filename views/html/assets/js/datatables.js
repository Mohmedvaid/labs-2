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
			let url = form.attr('action')
			let payload = form.serialize()
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
		            </tr>`
					$('tbody').append(td)
				})
				.then(() => $('#addNewAppModal').modal('hide'))
				.catch(handleError)
		})
	}

	function handleError(err) {
		$(`#errors`).append(`<div id="main-err" style="color:red;">${err.response.data.message}</div>`)
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
		axios
			.get('/api/customer')
			.then((res) => {
				res.data.forEach((customer) => {
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
						<a href="${customer.image}" data-lightbox="${customer.image}" data-title="My caption">
							<img style="width:100%" src="${customer.image}">
						</a>
                      </td>
                    </tr>`
				})
			})
			.then(() => $('tbody').append(temp))
	}

	function clearErrors() {
		$(`#errors`).empty()
	}
	initTableWithSearch()
	initTableWithDynamicRows()
	initTableWithExportOptions()
	initTableData()
})(window.jQuery)
