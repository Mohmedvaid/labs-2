/* ===============
 * Dashboard
 * Generates widgets in the dashboard
 * For DEMO purposes only. Extract what you need.
 * =============== */
(function ($) {
  'use strict';

  $(document).ready(function () {
    //  User creation
    $('#signUpForm').submit(function (e) {
      e.preventDefault();
      // or return false;
    });
    $('#createUser').click(async function (event) {
      event.preventDefault();
      var email = $(`input[name='email']`).val();
      var password = $(`input[name='pass']`).val();
      let accesslocationArr = [];
      $(`input:checkbox[name='userLocations']:checked`).each(function () {
        console.log($(this));
        accesslocationArr.push($(this).val());
      });
      var firstName = $(`input[name='fname']`).val();
      var lastName = $(`input[name='lname']`).val();
      let userType = $(`#userType option:selected`).val();
      if (!firstName || !lastName) {
        clearErrors();
        return $(`#error`).append(`<div id="main-err" class="text-danger">Please enter your first and last name!<div>`);
      }
      if (accesslocationArr.length === 0) {
        clearErrors();
        return $(`#error`).append(`<div id="main-err" class="text-danger">Please select at least one location!<div>`);
      }
      if (userType === 'Select a user type') {
        clearErrors();
        return $(`#error`).append(`<div id="main-err" class="text-danger">Please select a user type!<div>`);
      }
      if (!password) {
        clearErrors();
        return $(`#error`).append(`<div id="main-err" class="text-danger">Please enter a password!<div>`);
      }
      if (!email) {
        clearErrors();
        return $(`#error`).append(`<div id="main-err" class="text-danger">Please enter an email!<div>`);
      }

      try {
        let data = {
          email,
          password,
          location: accesslocationArr,
          firstName,
          lastName,
          userType,
        };
        console.log(data);
        axios
          .post('/register', data)
          .then((res) => {
            console.log(res);
            clearErrors();
            $(`#signupMessage`).text('User created successfully');
            $(`#signUpForm`).trigger('reset');
            setTimeout(function () {
              $('#signupMessage').text('');
            }, 5000);
          })
          .catch((err) => handleSignUpErrors(err.response.data));
        if (data.user) {
          $(`#signupMessage`).text('');
          $(`#signupMessage`).text('User created successfully');
        }
      } catch (err) {
        console.log('error', err);
      }
    });
    function clearErrors() {
      $(`#error`).empty();
    }

    function handleSignUpErrors(errors) {
      clearErrors();
      console.log(errors);
      if (errors.message) {
        $(`#error`).append(`<div id="main-err" class="text-danger">${errors.message}<div>`);
        return;
      }
      let errorEl = $(`#error`);
      let div = ``;
      for (const prop in errors) {
        if (errors[prop]) {
          div += `<p class="text-danger">${errors[prop]}</p>`;
        }
      }
      errorEl.append(div);
    }

    // dropdown
    $(function () {
      $('.dropdown-menu li a').click(function () {
        $('.btn:first-child').text($(this).text());
        $('.btn:first-child').val($(this).text());
      });
    });

    $(`#addLocationBtn`).click(function (e) {
      console.log('add location button clicked');
      let errorEl = $(`#locationErrors`);
      errorEl.empty();
      let location = $(`input[name='newTestingLocation']`).val();
      let location2 = $(`input[name='newTestingLocation2']`).val();

      if (location === '' || location2 === '') {
        errorEl.append(`<p class="text-danger">Please enter a location</p>`);
        return;
      }
      if (location !== location2) {
        errorEl.append(`<p class="text-danger">Location does not match</p>`);
        return;
      }
      axios
        .post('/api/location', { name: location })
        .then((res) => {
          console.log(res);
          errorEl.append(`<p class="text-success">Location added!</p>`);
          setTimeout(function () {
            errorEl.empty();
          }, 3000);
        })
        .then(() => {
          location.val('');
          location2.val('');
        })
        .catch((err) => {
          if (err.response.data.error === 'Duplicate location') {
            errorEl.append(`<p class="text-danger">Location already exists</p>`);
          } else {
            errorEl.append(`<p class="text-danger">Something went wrong</p>`);
          }
        });
    });
    // ready ends
  });
  function initLocations() {
    axios.get('/api/location').then((res) => {
      let locations = res.data;
      console.log(locations);
      let checkBoxDiv = $(`#locationCheckboxes`);
      checkBoxDiv.empty();
      if (locations.length === 0) return checkBoxDiv.append(`<p>No locations added yet</p>`);
      locations.forEach((location) => {
        checkBoxDiv.append(`
				<input name="userLocations" type="checkbox" id="${location.name}" value=${location.name}>
				<label for="${location.name}">${location.name}</label>
			`);
      });
    });
  }
  function initAllUsers() {
    axios.get('/api/users').then(function (response) {
      let users = response.data;
      let userSelect = $(`#allUsersSelect`);
      console.log(users);
	  userSelect.empty();
	  if(users.length === 0) return userSelect.append(`<option>No users added yet</option>`);
      users.forEach(function (user) {
        userSelect.append(
          $('<option>', {
            value: `${user._id}`,
            text: `${user.firstName} ${user.lastName} - ${user.email}`,
          })
        );
      });
    });
  }

  $(`#getLeadsByUsers`).click(function (e) {
	  e.preventDefault();
	  let date = $(`#daterangepicker`).val();
	  let fromDate = date.split('-')[0].trim()
	  let toDate = date.split('-')[1].trim()
	  let user = $(`#allUsersSelect option:selected`).val();
	  console.log(date, user);
	  axios.get(`/api/customers/byUser?fromDate=${fromDate}&toDate=${toDate}`)
	  .then((customerData) => {
      console.log(customerData);
    });
  });

  function appendLeads(customers) {
	  $(`#userByLeadsInfo`).empty()
	  customers.forEach((customer) => {
		  
	  })
  }

  
  initLocations();
  initAllUsers();
})(window.jQuery);
