function addName () {
    $('#welcome').text("Hello " + Cookies.get('name'))
}

addName()