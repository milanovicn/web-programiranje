var image2 = [];
var allApartments = [];
var loggedInUser = "";

$(document).ready(function () {
	getAllApartments();

	loadApartmentsForUser();
	$("#hostDiv").hide();
	$("#userDiv").show();
	$("#adminDiv").hide();


	allAmenities();
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

	$("#hostDiv").hide();

	whoIsLoggedIn();

	$("#logout").click(function () {
		logOut();
	});
	$("#logoutM").click(function () {
		logOut();
	});

	$("#createDiv").hide();
	$("#showCreateDiv").click(function () {
		$("#createDiv").toggle();
	});


	$("#createForm").submit(function (event) {
		saveApartment();

	});

	loadApartmentsForUser();

});

$(function () {
	// Multiple images preview in browser
	var imagesPreview = function (input, placeToInsertImagePreview) {

		if (input.files) {

			let filesAmount = input.files.length;


			for (let i = 0; i < filesAmount; i++) {

				let reader = new FileReader();


				reader.onloadend = function (event) {
					//for (j = 0; j < filesAmount; j++) {
					//	console.log("j ");
					//	console.log(j);
					//	image2[j] = event.target.result;

					//}

					$($.parseHTML('<img>')).attr({ 'src': event.target.result, 'height': 200 }).appendTo(placeToInsertImagePreview);
					//console.log("i etr");
					//console.log(i);
					//console.log(event.target.result);
					image2[i] = event.target.result;
				}



				reader.readAsDataURL(input.files[i]);

			}


		}

	};

	$('#gallery-photo-add').on('change', function () {
		imagesPreview(this, 'div.gallery');
	});
});



function whoIsLoggedIn() {
	$.get({
		url: 'rest/whoIsLoggedIn',
		contentType: 'application/json',
		success: function (user) {

			if (user != undefined) {
				loggedInUser = user.username;

				if (user.role == "GUEST") {
					loadApartmentsForUser();
					$("#hostDiv").hide();
					$("#userDiv").show();
					$("#adminDiv").hide();

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
					loadApartmentsForAdmin();
					$("#hostDiv").hide();
					$("#userDiv").hide();
					$("#adminDiv").show();


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
					loadApartmentsForHost();
					$("#hostDiv").show();
					$("#userDiv").hide();
					$("#adminDiv").hide();

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
					loadApartmentsForUser();
					$("#hostDiv").hide();
					$("#userDiv").show();
					$("#adminDiv").hide();
					console.log("No one is logged in");

				}
			} else {
				console.log("No one is logged in");
				loadApartmentsForUser();
				$("#hostDiv").hide();
				$("#userDiv").show();
				$("#adminDiv").hide();
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
	var locationString = latitude + "," + longitude + "," + street + "," + number + "," + city + "," + postalCode;

	//generating string of chosen amenities
	var amenitiesString = "";
	for (let i = 0; i < amenityIds.length; i++) {
		console.log("usao u for sledeci if");
		if (($("#aId" + amenityIds[i]).is(":checked")) == true) {
			amenitiesString += amenityIds[i] + ",";
			console.log("i + id + amString");
			console.log(i);
			console.log(amenityIds[i]);
			console.log(amenitiesString);
		}
	}

	console.log("amenitiesString pre posta");
	console.log(amenitiesString);
	$.post({
		url: 'rest/createApartment',
		data: JSON.stringify({ type, rooms, capacity, startDate, endDate, checkIn, checkOut, price, locationString, images, amenitiesString }),
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

var amenityIds = [];
function allAmenities() {
	$.get({
		url: 'rest/getAllAmenities',
		contentType: 'application/json',
		success: function (amenities) {
			console.log(amenities);
			for (let i = 0; i < amenities.length; i++) {

				let amenity = amenities[i];
				//console.log("i + amenities[i]");
				//console.log(i);
				//console.log(amenity);

				if (amenity.deleted != true) {

					amenityIds[i] = amenity.id;


					$("#amenitiesDiv").append(
						'<div class="col s6">' +
						' <label>' +
						' <input id="aId' + amenity.id + '"type="checkbox" />' +
						'<span>' + amenity.name + '</span>' +
						' </label>' +
						'</div>'

					);
				}

			}
			console.log("amenityIds posle fora");
			console.log(amenityIds);

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});
}

function getAllApartments() {
	$.get({
		url: 'rest/getAllApartments',
		contentType: 'application/json',
		success: function (apartments) {
			allApartments = apartments;
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

}

function loadApartmentsForHost() {
	for (let i = 0; i < allApartments.length; i++) {
		let apartment = allApartments[i];

		if (apartment.status == "ACTIVE" && apartment.host == loggedInUser) {
			$("#activeApartmentsListHost").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
				apartment.id + '"><p>ID:' + apartment.id + ', ' + apartment.locationString + '</p></a></li>');
		}

		if (apartment.status == "INACTIVE" && apartment.host == loggedInUser) {
			$("#inactiveApartmentsListHost").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
				apartment.id + '">ID:' + apartment.id + ', ' + apartment.locationString + '</a></li>');
		}

	}
}

function loadApartmentsForUser() {
	for (let i = 0; i < allApartments.length; i++) {
		let apartment = allApartments[i];

		if (apartment.status == "ACTIVE") {
			$("#activeApartmentsListUser").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
				apartment.id + '">' + 'ID:' + apartment.id + ', ' + apartment.locationString + ', hosted by: ' + apartment.host + '</a></li>');
		}

	}
}

function loadApartmentsForAdmin() {
	for (let i = 0; i < allApartments.length; i++) {
		let apartment = allApartments[i];

		$("#allApartmentsListAdmin").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
			apartment.id + '">' + 'ID:' + apartment.id + ', ' + apartment.locationString + ', hosted by: ' + apartment.host + '</a></li>');


	}
}