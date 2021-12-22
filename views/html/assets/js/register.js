$(document).ready(function () {
  $('#btn-signup').click(function (event) {
    event.preventDefault();
    var email = $(`input[name='email']`).val();
    var password = $(`input[name='pass']`).val();
    var _username = $(`input[name='uname']`).val();
    var _fname = $(`input[name='fname']`).val();
    var _lname = $(`input[name='lname']`).val();

    try {
      const res = await fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log(data);
      if (data.errors) {
        showError(data.errors.email, data.errors.password);
      }
      if (data.user) {
        location.assign('/');
      }
    } catch (err) {
      console.log(err);
    }
  });

  function showError(message) {
    let err = `<div id="main-err" style="color:red;">${message}<div>`;
    $(err).insertAfter('h2');
  }
  function clearErrors() {
    $('#main-err').remove();
  }
  // ready ends
});
