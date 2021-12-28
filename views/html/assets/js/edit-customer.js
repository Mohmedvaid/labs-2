$(document).ready(function () {
  let customerID = window.location.search.substring(1);
  if (!customerID) return;
  else {
    axios.get(`/api/customer/${customerID}`).then((response) => {
      console.log(response.data);
      appendCustomerInfo(response.data);
      FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginFileEncode);
      FilePond.parse(document.body);
	  return 
    });
  }
  // Ready ends

  function appendCustomerInfo(customer) {
    let basicInfoEl = $(`#basicustomerInfo`);
    let mainInfoEl = $(`#mainCustomerInfo`);
    basicInfoEl.empty();
    mainInfoEl.empty();
    let customerImg = `${customer.image ? customer.image : 'https://via.placeholder.com/150'}`;
    let basicInfoContent = `                                        
	  <div class="pv-lg"><img class="center-block img-responsive img-circle img-thumbnail thumb96"
			src="${customerImg}" alt="Contact"></div>
	<h3 class="m0 text-bold">${customer.firstName} ${customer.lastName}</h3>`;
    let mainInfoContent = `
		<form id="updateCustomerForm" role="form" action="/api/customer" method="POST">
				<div class="row">
					<div class="col-sm-6">
						<div class="form-group form-group-default">
							<label for="firstname"> First Name</label>
							<input required name="firstname" id="firstName" type="text" class="form-control" value="${customer.firstName}">
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group form-group-default">
							<label for="lastname">Last Name</label>
							<input required name="lastname" id="lastName" type="text" class="form-control" value="${customer.lastName}">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-12">
						<div class="form-group form-group-default">
							<label for="email">Email</label>
							<input required name="email" id="email" type="text" class="form-control"
								value="${customer.email}">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-12">
						<div class="form-group form-group-default">
							<label for="address">Address</label>
							<input required name="address" id="address" type="text" class="form-control"
								value="${customer.address}">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-12">
						<div class="form-group form-group-default">
							<label for="location">Testing Location</label>
							<input required name="location" id="customerLocation" type="text" class="form-control"
								value="${customer.location}">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-12">
						<div class="form-group form-group-default">
							<label for="dob">Date of Birth</label>
							<input required name="dob" id="dob" type="text" class="form-control" value="${customer.dob}">
						</div>
					</div>
				</div>
				<div>
					<label for="testResults">Test Results/Documents</label>
					<input type="file" name="testResults" class="filepond">
				</div>
				<div class="modal-footer">
					<button aria-label="" id="updateCustomer" class="btn btn-primary  btn-cons" type="submit">Save Customer</button>
					<button aria-label="" type="button" class="btn btn-cons" >Discard Changes</button>
				</div>
			</form>	`;
    basicInfoEl.append(basicInfoContent);
    mainInfoEl.append(mainInfoContent);
  }
});
