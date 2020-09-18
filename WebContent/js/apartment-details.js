var params = new URL(location.href).searchParams;
var apartmentId = params.get("apartmentId");
var loggedInUser = "";
var apartment;
var image2 = [];
var allComments = [];

$(document).ready(function () {
	loadApartmentDetails();
	getAllComments();
	allAmenities();

	$('select').formSelect();
	$('.datepicker').datepicker();
	$('.timepicker').timepicker();

	$("#userDiv").hide();
	$("#changeApartmentDiv").hide();
	$("#adminAndHost").hide();
	

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


	$("#logout").click(function () {
		logOut();
	});
	$("#logoutM").click(function () {
		logOut();
	});

	$("#reservationDiv").hide();
	$("#showReservationDiv").click(function () {
		$("#reservationDiv").toggle();
	});

	changeApartmentStatus();
	deleteApartment();
	

	
	$("#createReservationForm").submit(function (event) {
		createReservation();

	});

	
	$("#editDiv").hide();
	$("#changeApartmentDiv").hide();
	$("#showEditDiv").click(function () {
		$("#changeApartmentDiv").toggle();
	});

	$("#editForm").submit(function (event) {
		event.preventDefault();
		editApartment();
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
					loadCommentsUser();
					//$("#hostDiv").hide();
					$("#changeApartmentDiv").hide();
					$("#editDiv").hide();
					$("#userDiv").show();
					//$("#adminDiv").hide();
					$("#adminAndHost").hide();


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
					loadCommentsAdmin();
					$("#editDiv").show();
					//$("#changeApartmentDiv").show();
					$("#userDiv").hide();
					$("#adminAndHost").show();

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
					loadCommentsHost();
					//$("#hostDiv").show();
					$("#userDiv").hide();
					$("#editDiv").show();
					//$("#changeApartmentDiv").show();
					//$("#adminDiv").hide();
					$("#adminAndHost").show();

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
					
					loadCommentsUser();
					$("#adminAndHost").hide();
					//$("#hostDiv").hide();
					//$("#userDiv").show();
					//$("#adminDiv").hide();
					console.log("No one is logged in");

				}
			} else {
				loadCommentsUser();
				console.log("No one is logged in");
				//$("#hostDiv").hide();
				//$("#userDiv").show();
				//$("#adminDiv").hide();
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

function loadApartmentDetails() {
	$.get({
		url: 'rest/getApartmentById/' + apartmentId,
		contentType: 'application/json',
		success: function (apartmentGet) {

			apartment = apartmentGet;
			$("#statusDet").append(apartment.status);
			$("#priceDet").append(apartment.price + ' \u20AC');
			$("#locationDet").append(apartment.locationString);
			$("#apartmentTypeDet").append(apartment.type);
			$("#roomsDet").append(apartment.rooms);
			$("#capacityDet").append(apartment.capacity);
			$("#checkInDet").append(apartment.checkIn);
			$("#checkOutDet").append(apartment.checkOut);
			$("#hostDet").append(apartment.host);

			let amenities = apartment.amenities;
			var lenght1 = Object.keys(amenities).length
			for (i = 0; i < lenght1; i++) {
				$("#amenitiesDet").append(amenities[i].name + " ");

			}


			let images = apartment.images;
			var lenght2 = Object.keys(images).length
			for (let i = 0; i < lenght2; i++) {
				$("#gallery").append('<img src="' + images[i] + '" height="200"></img>');
			}

			let freeDates = apartment.freeDates;
			var lenght3 = Object.keys(freeDates).length
			for (i = 0; i < lenght3; i++) {
				var date11 = freeDates[i].start;
				var date1 = new Date(date11);


				$("#availableDatesDet").append('<p>' + freeDates[i].startString + " - " + freeDates[i].endString + '</p>');
			}

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

}

function getAllComments() {
	$.get({
		url: 'rest/getAllCommentsById/' + apartmentId,
		contentType: 'application/json',
		success: function (comments) {
			allComments = comments;
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

	whoIsLoggedIn();
}

function loadCommentsUser() {

	for (let i = 0; i < allComments.length; i++) {
		let comment = allComments[i];
		if (comment.approved == true) {
			console.log("usao");
			console.log(comment);
			$("#commentsList").append('<li class="collection-item">Comment: ' + comment.content + ' <br>Rate: ' + comment.rate + '</li>');
		}

	}
	//$("#commentsDiv").load(location.href + " #commentsDiv");

}

function loadCommentsAdmin() {
	console.log("EEEEEEEEEEHHHEEE222222222");
	for (let i = 0; i < allComments.length; i++) {
		let comment = allComments[i];
		if (comment.approved == true) {
			console.log("usao");
			console.log(comment);
			$("#commentsList").append('<li class="collection-item">Comment: ' + comment.content + ' <br>Rate: ' + comment.rate
				+ ' <br>Status: approved</li>');
		} else {
			console.log("usao");
			console.log(comment);
			$("#commentsList").append('<li class="collection-item">Comment: ' + comment.content + ' <br>Rate: ' + comment.rate
				+ ' <br>Status: disapproved</li>');
		}
	}
	console.log("EEEEEEEEEEHEEEEEE222222222");
	//$("#commentsDiv").load(location.href + " #commentsDiv");

}

function loadCommentsHost() {
	console.log("EEEEEEEEEE111111");
	//<div class="col s12">
	for (let i = 0; i < allComments.length; i++) {
		let comment = allComments[i];
		if (comment.approved == true) {
			console.log("usao");
			console.log(comment);
			var btnHideComment = $('<div class="col s12"  style="margin-bottom: 20px;" ><button id="btnHideComment" class="btn waves-effect waves-light light-blue ">Disapprove<i class="material-icons right">close</i></button>');
			btnHideComment.click(changeCommentStatus(comment));
			$("#commentsList").append('<li class="collection-item">Comment: ' + comment.content + ' <br>Rate: ' + comment.rate
				+ ' <br>').append(btnHideComment).append('</li>');
		} else {
			console.log("usao");
			console.log(comment);
			var btnShowComment = $('<div class="col s12"  style="margin-bottom: 20px;" ><button id="btnShowComment" class="btn waves-effect waves-light light-blue ">Approve<i class="material-icons right">remove_red_eye</i></button></div>');
			btnShowComment.click(changeCommentStatus(comment));
			$("#commentsList").append('<li class="collection-item">Comment: ' + comment.content + ' <br>Rate: ' + comment.rate
				+ ' <br>').append(btnShowComment).append('</li>');
		}
	}
	console.log("EEEEEEEEEE222222222");
	//$("#commentsDiv").load(location.href + " #commentsDiv");
	console.log("EEEEEEEEEE3333333");

}

function changeCommentStatus(comment) {
	return function () {
		$.ajax({
			url: 'rest/changeCommentStatus/' + comment.apartmentId + "/" + comment.content + "/" + comment.rate,
			type: 'PUT',
			success: function () {
				alert("Comment approved status changed");
				location.reload();
			},
			error: function () {
				alert("Comment approved status changed");
				location.reload();
			}
		});
	}
}


function createReservation() {
	event.preventDefault();

	var message = $('input[name="message"]').val();
	var stays = $('input[name="stays"]').val();
	var startDateStr = $("#startDate").datepicker({ dateFormat: 'yyyy-MM-dd' }).val();
	var startDate1 = formatDateISO(startDateStr);
	var startDate = JSON.parse(JSON.stringify(startDate1));

	$.post({
		url: 'rest/addReservation',
		data: JSON.stringify({ message, stays, startDate, apartmentId }),
		contentType: 'application/json',
		success: function () {
			alert("Reservation created");
			location.reload();
		},
		error: function () {
			//alert("Reservation not created. Choose valid dates!");
			location.reload();
		}
	});


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

var amenityIds = [];
function allAmenities() {
	$.get({
		url: 'rest/getAllAmenities',
		contentType: 'application/json',
		success: function (amenities) {

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
				}

			}

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});
}

function editApartment() {

	

	var images = image2;

	var type = $('#selectType :selected').val();
	var rooms = $('input[name="rooms"]').val();
	var capacity = $('input[name="capacity"]').val();
	var price = $('input[name="price"]').val();
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

	var id = params.get("apartmentId");

	$.post({
		//poslati id trenutnog i sve nove vrednosti

		url: 'rest/editApartment',
		data: JSON.stringify({ id, type, rooms, capacity, checkIn, checkOut, price, locationString, images, amenitiesString }),
		contentType: 'application/json',
		success: function () {
			alert("Apartment changed successfully");
			location.reload();
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log("Error creating apartment: ", errorMessage);
		}
	});

}

function changeApartmentStatus() {
	$("#changeStatusBtn").click(function () {
		$.ajax({
			url: 'rest/changeApartmentStatus/' + apartmentId,
			type: 'PUT',
			success: function () {
				alert("Status changed");
				location.reload();
			},
			error: function () {
				alert("Status not changed");
				location.reload();
			}
		});
	});
}


function deleteApartment() {
	var id = apartmentId;
	$("#deleteApartmentBtn").click(function () {
		$.ajax({
			url: 'rest/deleteApartment/' + id,
			type: 'DELETE',
			success: function () {
				alert("Apartment deleted.");
				location.reload();
			},
			error: function (jqXhr, textStatus, errorThrown) {
				alert("Apartment not deleted.");
				console.log(errorThrown);
				location.reload();
			}
		});
	});
}


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