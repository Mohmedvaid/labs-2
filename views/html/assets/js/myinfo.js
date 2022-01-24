$(document).ready(function () {
	let customerID = window.location.search.split('=')[1]
	const displayError = () => $('#customerDetailsTable').append(`<tr><td colspan="2">No customer found</td></tr>`)

	axios
		.get(`/api/myinfo/${customerID}`)
		.then((response) => createCustomerDetailsTable(response.data))
		.catch(displayError)
	const createCustomerDetailsTable = (customer) => {
		let customerDetails = {
			'First Name': customer.firstName,
			'Last Name': customer.lastName,
			Email: customer.email,
			Address: customer.address,
			Location: customer.location,
			Phone: customer.phone,
			DOB: customer.dob,
			'Customer Signature': customer.customerSignature,
			'Test Result': customer.testResults,
		}
		let table = $('#customerDetailsTable')
		table.empty()
		table.append(`<thead><tr><th>Field</th><th>Value</th></tr></thead>`)
		table.append(`<tbody></tbody>`)
		let tbody = $('#customerDetailsTable tbody')
		for (let key in customerDetails) {
			if (key === 'Test Result') {
				let customerTestResult = customerDetails[key]
				if (customerTestResult.length === 0) {
					tbody.append(`<tr><td>${key}</td><td>No Test Result Uploaded Yet</td></tr>`)
				} else {
					let allTestResults = customerTestResult.map((testResult) => {
						return `<li><a href="${testResult.path}">${testResult.name}</a></li>`
					})
					tbody.append(
						`<tr>
                            <td>${key}</td>
                            <td style="display:flex; flex-direction: column;">
                                <ul>${allTestResults.join('')}
                                </ul>
                            </td>
                        </tr>`
					)
				}
			} else if (key === 'Customer Signature') {
				tbody.append(`<tr><td>${key}</td><td><img src="${customerDetails[key]}" alt="Customer Signature"></td></tr>`)
			} else {
				tbody.append(`<tr><td>${key}</td><td>${customerDetails[key]}</td></tr>`)
			}
		}
	}
})
