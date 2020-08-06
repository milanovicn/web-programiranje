var image2 = [];

$(document).ready(function () {

	$('select').formSelect();
	$('.datepicker').datepicker();
	$('.timepicker').timepicker();

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



	whoIsLoggedIn();

	$("#logout").click(function () {
		logOut();
	});
	$("#createDiv").hide();
	$("#showCreateDiv").click(function () {
		$("#createDiv").toggle();
	});


	$("#createForm").submit(function (event) {
		saveApartment();

	});
	
});

$(function () {
	// Multiple images preview in browser
	var imagesPreview = function (input, placeToInsertImagePreview) {

		if (input.files) {

			var filesAmount = input.files.length;
			
			
			for (i = 0; i < filesAmount; i++) {
				
				var reader = new FileReader();
				reader.onload = function (event) {
					for(j = 0; j < filesAmount; j++){
					console.log("i1 ");
					console.log(i);
					
					$($.parseHTML('<img>')).attr({ 'src': event.target.result, 'height': 200 }).appendTo(placeToInsertImagePreview);
					image2[j]= event.target.result;
				
					}
				}
				reader.readAsDataURL(input.files[i]);
				
			}
			
			console.log("IMAGE2: ");
			console.log(image2);
		}

	};

	$('#gallery-photo-add').on('change', function () {
		imagesPreview(this, 'div.gallery');
	});
});

function readURL(input) { // za sliku

	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$("#previewImage").attr('src', e.target.result, 'width', 200, 'height', 200);
			image2 = e.target.result;
		}

		reader.readAsDataURL(input.files[0]);
	}
}

function whoIsLoggedIn() {
	$.get({
		url: 'rest/whoIsLoggedIn',
		contentType: 'application/json',
		success: function (user) {
			if (user != undefined) {
				if (user.role == "GUEST") {
					$("#login").hide();
					$("#register").hide();
					$("#apartments").show();
					$("#profile").show();
					$("#amenities").hide();
					$("#reservations").show();
					$("#users").hide();
					$("#logout").show();



					$("#loginM").hide();
					$("#registerM").hide();
					$("#apartmentsM").show();
					$("#profileM").show();
					$("#amenitiesM").hide();
					$("#reservationsM").show();
					$("#usersM").hide();
					$("#logoutM").show();
					console.log("User logged in");
					console.log(user);

				} else if (user.role == "ADMIN") {
					$("#login").hide();
					$("#register").hide();
					$("#apartments").show();
					$("#profile").show();
					$("#amenities").show();
					$("#reservations").show();
					$("#users").show();
					$("#logout").show();

					$("#loginM").hide();
					$("#registerM").hide();
					$("#apartmentsM").show();
					$("#profileM").show();
					$("#amenitiesM").show();
					$("#reservationsM").show();
					$("#usersM").show();
					$("#logoutM").show();

					console.log("Admin logged in");
					console.log(user);

				} else if (user.role == "HOST") {
					$("#login").hide();
					$("#register").hide();
					$("#apartments").show();
					$("#profile").show();
					$("#amenities").hide();
					$("#reservations").show();
					$("#users").show();
					$("#logout").show();

					$("#loginM").hide();
					$("#registerM").hide();
					$("#apartmentsM").show();
					$("#profileM").show();
					$("#amenitiesM").hide();
					$("#reservationsM").show();
					$("#usersM").show();
					$("#logoutM").show();

					console.log("Host logged in");
					console.log(user);

				} else {
					console.log("No one is logged in");

				}
			} else {
				console.log("No one is logged in");
			}

		}
	});
}


function logOut() {
	$.post({
		url: 'rest/logOut',
		success: function () {
			alert("Log out successful");
			window.location = "./home.html";
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log("Error: ", errorMessage);
		}

	});
}

function saveApartment() {

	event.preventDefault();
	var images = image2;

	var type = $('#selectType :selected').val();
	var rooms = $('input[name="rooms"]').val();
	var capacity = $('input[name="capacity"]').val();
	var price = $('input[name="price"]').val();
	var startDate = $('input[name="startDate"]').val();
	var endDate = $('input[name="endDate"]').val();
	var checkIn = $('input[name="checkIn"]').val();
	var checkOut = $('input[name="checkOut"]').val();
	var latitude = $('input[name="latitude"]').val();
	var longitude = $('input[name="longitude"]').val();
	var street = $('input[name="street"]').val();
	var number = $('input[name="number"]').val();
	var city = $('input[name="city"]').val();
	var postalCode = $('input[name="postalCode"]').val();
	var locationString = latitude+ "," + longitude + "," + street + "," + number + "," + city + "," + postalCode;

	$.post({
		url: 'rest/createApartment',
		data: JSON.stringify({ type, rooms, capacity, startDate, endDate, checkIn, checkOut, price, locationString, images }),
		contentType: 'application/json',
		success: function () {
			alert("Apartment created successfully");
			location.reload();
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log("Error creating apartment: ", errorMessage);
		}
	});

}