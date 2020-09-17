var image2 = [];
var allApartments = [];
var loggedInUser = "";
var loggedInUserRole = "";
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


	//create
	$("#createDiv").hide();
	$("#showCreateDiv").click(function () {
		$("#createDiv").toggle();
	});


	$("#createForm").submit(function (event) {
		saveApartment();

	});

	//search
	$("#searchDiv").hide();
	$("#showSearchDiv").click(function () {
		$("#searchDiv").toggle();
	});

	$("#searchForm").submit(function (event) {
		event.preventDefault();
		searchApartments();

	});

	//sotring
	$("#sortAsc").click(function () {
		sortApartments("ASC");
	});

	$("#sortDesc").click(function () {
		sortApartments("DESC");
	});

	//filter
	$("#filterDiv").hide();
	$("#showFilterDiv").click(function () {
		$("#filterDiv").toggle();
	});
	$("#filterForm").submit(function (event) {
		event.preventDefault();
		filterApartments();

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
					$($.parseHTML('<img>')).attr({ 'src': event.target.result, 'height': 200 }).appendTo(placeToInsertImagePreview);
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
				loggedInUserRole = user.role;
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
			window.location = "./login.html";
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
	var startDateStr = $("#startDate").datepicker({ dateFormat: 'yyyy-MM-dd' }).val();
	var startDate1 = formatDateISO(startDateStr);
	var startDate = JSON.parse(JSON.stringify(startDate1));
	var endDateStr = $("#endDate").datepicker({ dateFormat: 'yyyy-MM-dd' }).val();
	var endDate1 = formatDateISO(endDateStr);
	var endDate = JSON.parse(JSON.stringify(endDate1));
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
		if (($("#aId" + amenityIds[i]).is(":checked")) == true) {
			amenitiesString += amenityIds[i] + ",";
		}
	}

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
			$("#selectAmenitiesFilter").append('<option value="ALL">All</option>');
			for (let i = 0; i < amenities.length; i++) {
				let amenity = amenities[i];
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
					$("#selectAmenitiesFilter").append('<option value="' + amenity.id + '">' + amenity.name + '</option>');
					$("#selectAmenitiesFilter").formSelect();
				}

			}

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

function searchApartments() {

	var roomsFrom = $('input[name="roomsFrom"]').val();
	if (!roomsFrom) {
		roomsFrom = -123456789;
	}

	var roomsTo = $('input[name="roomsTo"]').val();
	if (!roomsTo) {
		roomsTo = 123456789;
	}

	//var priceFrom = $("#priceFrom").val();
	//if (priceFrom = undefined) {
	//	priceFrom = -123456789;
	//}

	var priceF = $('input[name="priceF"]').val();
	if (!priceF) {
		priceF = -123456789;
	}

	var priceTo = $('input[name="priceTo"]').val();
	if (!priceTo) {
		priceTo = 123456789;
	}

	var capacityFrom = $('input[name="capacityFrom"]').val();
	if (!capacityFrom) {
		capacityFrom = 0;
	}

	var destination = $('input[name="destination"]').val();
	if (!destination) {
		destination = "all";
	}

	var dateFrom;
	var dateFromStr = $("#dateFrom").datepicker({ dateFormat: 'yyyy-MM-dd' }).val();
	if (!dateFromStr) {
		dateFrom = "all";
	} else {
		var dateFrom1 = formatDateISO(dateFromStr);
		dateFrom = JSON.parse(JSON.stringify(dateFrom1));
	}

	var dateTo;
	var dateToStr = $("#dateTo").datepicker({ dateFormat: 'yyyy-MM-dd' }).val();
	if (!dateToStr) {
		dateTo = "all";
	} else {
		var dateTo1 = formatDateISO(dateToStr);
		dateTo = JSON.parse(JSON.stringify(dateTo1));
	}

	console.log(priceF);
	var priceFrom = priceF;
	$.post({
		url: 'rest/searchApartments',
		data: JSON.stringify({ roomsFrom, roomsTo, capacityFrom, dateFrom, dateTo, priceFrom, priceTo, destination }),
		contentType: 'application/json',
		success: function (apartments) {
			allApartments = apartments;
			console.log(allApartments);
			if (loggedInUser != undefined) {

				if (loggedInUserRole == "GUEST") {
					loadApartmentsForUser();
				} else if (loggedInUserRole == "ADMIN") {
					loadApartmentsForAdmin();
				} else if (loggedInUserRole == "HOST") {
					loadApartmentsForHost();
				} else {
					loadApartmentsForUser();
				}
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

}

function loadApartmentsForHost() {
	$("#activeApartmentsListHost").empty();
	$("#inactiveApartmentsListHost").empty();
	for (let i = 0; i < allApartments.length; i++) {
		let apartment = allApartments[i];

		if (apartment.deleted == false) {
			if (apartment.status == "ACTIVE" && apartment.host == loggedInUser) {
				$("#activeApartmentsListHost").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
					apartment.id + '">ID:' + apartment.id + ', ' + apartment.locationString + '</a></li>');
			}

			if (apartment.status == "INACTIVE" && apartment.host == loggedInUser) {
				$("#inactiveApartmentsListHost").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
					apartment.id + '">ID:' + apartment.id + ', ' + apartment.locationString + '</a></li>');
			}
		}
	}

}

function loadApartmentsForUser() {
	$("#activeApartmentsListUser").empty();

	for (let i = 0; i < allApartments.length; i++) {
		let apartment = allApartments[i];
		if (apartment.deleted == false) {
			if (apartment.status == "ACTIVE") {
				$("#activeApartmentsListUser").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
					apartment.id + '">' + 'ID:' + apartment.id + ', ' + apartment.locationString + ', hosted by: ' + apartment.host + '</a></li>');
			}

		}

	}


}

function loadApartmentsForAdmin() {
	//$("#allApartmentsListAdmin").empty();
	$("#activeApartmentsListAdmin").empty();
	$("#inactiveApartmentsListAdmin").empty();
	for (let i = 0; i < allApartments.length; i++) {
		let apartment = allApartments[i];

		if (apartment.deleted == false) {
			if (apartment.status == "ACTIVE") {
				$("#activeApartmentsListAdmin").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
					apartment.id + '">ID:' + apartment.id + ', ' + apartment.locationString + ', hosted by: ' + apartment.host + '</a></li>');
			}

			if (apartment.status == "INACTIVE") {
				$("#inactiveApartmentsListAdmin").append('<li class="collection-item"><a href="apartment-details.html?apartmentId=' +
					apartment.id + '">ID:' + apartment.id + ', ' + apartment.locationString + ', hosted by: ' + apartment.host + '</a></li>');
			}

		}
	}


}

function formatDateISO(dateToFormat) {
	var returnValue = "";
	var splited = dateToFormat.split(" ");
	var month = splited[0];
	var year = splited[2];
	var day = splited[1];
	day = day.replace(",", "");
	returnValue = year + "-";

	if (month == "Jan") {
		returnValue += "01-";
	} else if (month == "Feb") {
		returnValue += "02-";
	} else if (month == "Mar") {
		returnValue += "03-";
	} else if (month == "Apr") {
		returnValue += "04-";
	} else if (month == "May") {
		returnValue += "05-";
	} else if (month == "Jun") {
		returnValue += "06-";
	} else if (month == "Jul") {
		returnValue += "07-";
	} else if (month == "Aug") {
		returnValue += "08-";
	} else if (month == "Sep") {
		returnValue += "09-";
	} else if (month == "Oct") {
		returnValue += "10-";
	} else if (month == "Nov") {
		returnValue += "11-";
	} else if (month == "Dec") {
		returnValue += "12-";
	} else {
		returnValue += "1-";
	}

	returnValue += day;

	return returnValue;

}

function sortApartments(sortType) {
	$.get({
		url: 'rest/sortApartments/' + sortType,
		contentType: 'application/json',
		success: function (apartments) {
			allApartments = apartments;
			console.log(allApartments);
			if (loggedInUser != undefined) {

				if (loggedInUserRole == "GUEST") {
					loadApartmentsForUser();
				} else if (loggedInUserRole == "ADMIN") {
					loadApartmentsForAdmin();
				} else if (loggedInUserRole == "HOST") {
					loadApartmentsForHost();
				} else {
					loadApartmentsForUser();
				}
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

}

function filterApartments() {

	var apartmentType = $('#selectTypeFilter :selected').val();
	var amenities = $('#selectAmenitiesFilter :selected').val();
	$.post({
		url: 'rest/filterApartments/',
		data: JSON.stringify({ apartmentType, amenities }),
		contentType: 'application/json',
		success: function (apartments) {
			allApartments = apartments;
			console.log(allApartments);
			if (loggedInUser != undefined) {

				if (loggedInUserRole == "GUEST") {
					loadApartmentsForUser();
				} else if (loggedInUserRole == "ADMIN") {
					loadApartmentsForAdmin();
				} else if (loggedInUserRole == "HOST") {
					loadApartmentsForHost();
				} else {
					loadApartmentsForUser();
				}
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

}