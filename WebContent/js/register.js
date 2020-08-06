
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
	


	$('select').formSelect();
	$("#registrationForm").submit(function (event) {
		event.preventDefault();

		var username = $('input[name="username"]').val();
		var password = $('input[name="password"]').val();
		var name = $('input[name="name"]').val();
		var lastname = $('input[name="lastname"]').val();
		var gender = $('#selectGender :selected').val();
		var passwordControl = $('input[name="passwordControl"]').val();

		console.log("Password: ");
		console.log(password );
		console.log("PasswordControl: "); 
		console.log( passwordControl);

		if (password == passwordControl) {
			$.post({
				url: 'rest/registration',
				data: JSON.stringify({ username, password, name, lastname, gender }),
				contentType: 'application/json',
				success: function () {
					alert("Registration successful");
					window.location = "./login.html";
				},
				error: function () {
					alert("Username already registered");
				}
			});
		} else {
			alert("Password and repeated passsword not matching, try again");
		}
	});
});


