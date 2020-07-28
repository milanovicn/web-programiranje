$(document).ready(function () {
	$("#login").show();
	$("#register").show();
	$("#apartments").show();
	$("#profile").hide();
	$("#amenities").hide();
	$("#reservations").hide();
	$("#users").hide();
	$("#logout").hide();

	$("#loginM").show();
	$("#registerM").show();
	$("#apartmentsM").show();
	$("#profileM").hide();
	$("#amenitiesM").hide();
	$("#reservationsM").hide();
	$("#usersM").hide();
	$("#logoutM").hide();


	$('#logInForm').submit(function (event) {
		event.preventDefault();
		var username = $('input[name="username"]').val();
		var password = $('input[name="password"]').val();

		$.post({
			url: 'rest/login',
			data: JSON.stringify({ username, password }),
			contentType: 'application/json',
			success: function () {
				window.location = "./home.html";
				alert("Log in successful");
			},
			error: function (message) {
				alert("Log in unsuccessful");
			}
		});
	});

});


