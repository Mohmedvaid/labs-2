$(document).ready(function () {
  //form submit
  $('#btn-login').click(function (event) {
    event.preventDefault();
    var _email = $(`input[name='email']`).val();
    var _password = $(`input[name='password']`).val();
    if (!_email || !_password) {
      clearErrors();
      let err = '<div id="main-err" style="color:red;">Please enter a valid credentials.<div>';
      $(err).insertAfter('h2');
      return;
    }
    clearErrors();
    axios
      .post('/login', {
        email: _email,
        password: _password,
      })
      .then((res) => {
        localStorage.setItem('location', res.data.location);
        location.assign('/dashboard');
      })
      .catch(handleError);
  });

  function handleError(err) {
    let formErr,
      status = err.response.status,
	  data= err.response.data;
	  console.log(err.response)
    if (status === 400 || status === 401) {
      formErr = `<div id="main-err" style="color:red;">${data.error}<div>`;
    } else {
      formErr = '<div id="main-err" style="color:red;">Something went wrong.<div>';
    }
    clearErrors();
    $(formErr).insertAfter('h2');
  }

  function clearErrors() {
    $('#main-err').remove();
  }

  // ready ends below
});
