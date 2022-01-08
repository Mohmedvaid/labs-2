$(document).ready(function () {
    //FilePond.registerPlugin(FilePondPluginImagePreview);
    //FilePond.parse(document.body);
  let customerID = window.location.search.substring(1);
  if (!customerID) return;
  else {
    axios.get(`/api/customer/${customerID}`).then((response) => {
      appendCustomerInfo(response.data);
      return;
    });
  }
  // Ready ends

  function appendCustomerInfo(customer) {
    let basicInfoEl = $(`#basicustomerInfo`);
    let mainInfoEl = $(`#mainCustomerInfo`);
    let existingAssetEl = $(`#existingAssets`);
    basicInfoEl.empty();
    mainInfoEl.empty();
    existingAssetEl.empty();
    let customerImg = `${customer.image ? customer.image.path : 'https://via.placeholder.com/150'}`;
    let basicInfoContent = `                                        
	  <div class="pv-lg"><img class="center-block img-responsive img-circle img-thumbnail thumb96"
			src="${customerImg}" alt="Contact"></div>
	<h3 class="m0 text-bold">${customer.firstName} ${customer.lastName}</h3>`;
    let mainInfoContent = `
    <div class="m-2 card-heading bold">Details
   </div>
		<form id="updateCustomerForm" role="form" action="/" method="POST">
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
							<input disabled required name="location" id="customerLocation" type="text" class="form-control"
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
        <div class="row">
					<div class="col-sm-12">
						<div class="form-group form-group-default">
							<label for="phone">Phone</label>
							<input required name="phone" id="phone" type="text" class="form-control" value="${customer.phone}">
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<button aria-label="" id="updateCustomer" class="btn btn-primary  btn-cons" type="submit">Save Customer</button>
					<button aria-label="" type="button" class="btn btn-cons" >Discard Changes</button>
				</div>
			</form>	`;
    basicInfoEl.append(basicInfoContent);
    mainInfoEl.append(mainInfoContent);
    let existingAssetContent = customer.testResults.map((asset) => {
      return `<a class="m-1" href="${asset.path}" download>${asset.name}</a>`;
    });
    if (existingAssetContent.length > 0) {
      existingAssetEl.append(existingAssetContent);
    } else {
      existingAssetEl.append(`<p>No files found</p>`);
    }
  }

  //   Handle form submit
  $(document).on('submit', '#updateCustomerForm', function (e) {
    e.preventDefault();
    let customerID = window.location.search.substring(1);
    let formData = $(this).serialize();
    axios
      .put(`/api/customer/${customerID}`, formData)
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function showSpinner() {
    $(`#addCustomerSpinner`).show();
  }
  function hideSpinner() {
    $(`#addCustomerSpinner`).css('display', 'none');
  }
  function showError(error) {
    $(`#mainCustomerInfo`).append(`<div id="errors"><p style="color:red">${error}</p></div>`);
  }
  function clearErrors() {
    $(`#errors`).remove();
  }

  $(document).on('submit', '#customerAssets', function (e) {
    e.preventDefault();
    let customerID = window.location.search.substring(1);
    let file = $(`input[name="testResults"`).prop('files');
    clearErrors();
    if (file.length === 0) return showError('Please select a file');
    showSpinner();
    let formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('testResults', file[i]);
    }
    axios
      .put(`/api/customer/upload/${customerID}`, formData)
      .then((res) => appendCustomerInfo(res.data))
      .then(hideSpinner)
      .catch((err) => console.log(err));
  });
  hideSpinner();

  // Ready ends
});
