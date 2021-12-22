$(document).ready(function () {
  //form submit
  $('#btn-login').click(function (event) {
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
      .post('/user/login', {
        email: _email,
        password: _password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        location.assign('/');
      })
      .catch(handleError);
  });

  function handleError(err) {
    let formErr;
    console.log('handle error fired');
    console.log(err);
    if (err.status < 200 || err.status > 299) {
      formErr = '<div id="main-err" style="color:red;">Invalid email or password.<div>';
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
