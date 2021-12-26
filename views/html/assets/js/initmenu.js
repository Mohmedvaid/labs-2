$(document).ready(function () {
	let cookieLocation = localStorage.getItem('location')
    console.log(cookieLocation)
	let uploadOption = `
        <li class="">
            <a href="upload.html" class="detailed">
              <span class="title">Upload Results</span>
            </a>
            <span class="icon-thumbnail"><i class="pg-icon">upload</i></span>
          </li>`
	if (cookieLocation.toLowerCase() === 'all') {
		$('body > nav > div.sidebar-menu > div.scroll-wrapper.menu-items > ul').append(uploadOption)
	}
})
