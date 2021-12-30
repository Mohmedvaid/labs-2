$(document).ready(function () {
  $('form').submit(function (e) {
    e.preventDefault();
    // or return false;
  });
  $('#btn-signup').click(async function (event) {
    event.preventDefault();
    var email = $(`input[name='email']`).val();
    var password = $(`input[name='pass']`).val();
    // var _username = $(`input[name='uname']`).val()
    let accesslocation = $('.form-select option:selected').text();
    var firstName = $(`input[name='fname']`).val();
    var lastName = $(`input[name='lname']`).val();
    if (!email || !password || !firstName || !lastName) {
      clearErrors();
      return $(`#error`).append(`<div id="main-err" class="text-danger">All fields are required!<div>`);
    }
    if (accesslocation === 'Select a Location') {
      clearErrors();
      $(`#error`).append(`<div id="main-err" class="text-danger">Please select a location!<div>`);
      return;
    }
    try {
      let data = {
        email,
        password,
        location: accesslocation,
        firstName,
        lastName,
      };
      axios
        .post('/signup', data)
        .then((res) => {
          console.log(res.data);
          localStorage.setItem('location', res.data.location);
          location.assign('/dashboard');
        })
        .catch((err) => handleSignUpErrors(err.response.data.error));
    } catch (err) {
      console.log(err);
    }
  });
  function handleSignUpErrors(error) {
    let errorEl = $(`#error`);
    let div = ``;
    clearErrors();

    if (typeof error === 'string') {
      div += `<p class="text-danger">${error}</p>`;
      errorEl.append(div);
      return;
    }
    for (const prop in errors) {
      if (errors[prop]) {
        div += `<p class="text-danger">${errors[prop]}</p>`;
      }
    }
    errorEl.append(div);
  }
  function clearErrors() {
    $('#error').empty();
  }

  // dropdown
  $(function () {
    $('.dropdown-menu li a').click(function () {
      $('.btn:first-child').text($(this).text());
      $('.btn:first-child').val($(this).text());
    });
  });
  // ready ends
});
