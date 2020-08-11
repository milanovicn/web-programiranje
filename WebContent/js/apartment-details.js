var params = new URL(location.href).searchParams;
var apartmentId = params.get("apartmentId"); 
var loggedInUser = "";
var apartment;

$(document).ready(function () {
    loadApartmentDetails();
	//$("#hostDiv").hide();
	//$("#userDiv").show();
	//$("#adminDiv").hide();

	$('select').formSelect();
	$('.datepicker').datepicker();
	$('.timepicker').timepicker();

	$("#userDiv").hide();

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
	$("#logoutM").click(function () {
		logOut();
	});

    //BICE ZA EDIT OVO
	//$("#createDiv").hide();
	//$("#showCreateDiv").click(function () {
	//	$("#createDiv").toggle();
	//});
    //$("#createForm").submit(function (event) {
	//	saveApartment();
	//});

	
	$("#reservationDiv").hide();
	$("#showReservationDiv").click(function () {
		$("#reservationDiv").toggle();
	});


	$("#createReservationForm").submit(function (event) {
		createReservation();

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
					
					//$("#hostDiv").hide();
					$("#userDiv").show();
					//$("#adminDiv").hide();

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
					
					//$("#hostDiv").hide();
					$("#userDiv").hide();
					//$("#adminDiv").show();


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
					//$("#hostDiv").show();
					$("#userDiv").hide();
					//$("#adminDiv").hide();

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
					//$("#hostDiv").hide();
					//$("#userDiv").show();
					//$("#adminDiv").hide();
					console.log("No one is logged in");

				}
			} else {
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
			window.location = "./home.html";
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
            $("#priceDet").append( apartment.price + ' \u20AC');
            $("#locationDet").append( apartment.locationString );
            $("#apartmentTypeDet").append( apartment.type );
            $("#roomsDet").append( apartment.rooms  );
            $("#capacityDet").append( apartment.capacity );
            $("#checkInDet").append(apartment.checkIn);
            $("#checkOutDet").append(apartment.checkOut);
            $("#hostDet").append(apartment.host);
           
            let amenities = apartment.amenities;            
            var lenght1 = Object.keys(amenities).length
            for( i = 0; i < lenght1; i++){
                $("#amenitiesDet").append( amenities[i].name+" ");
            }

           
            let images = apartment.images;
            var lenght2 = Object.keys(images).length
            for(let i=0; i<lenght2; i++){
                $("#gallery").append('<img src="'+ images[i] +'" height="200"></img>');
			}
			
			let freeDates = apartment.freeDates;            
            var lenght3 = Object.keys(freeDates).length
            for( i = 0; i < lenght3; i++){
				var date11 = freeDates[i].start;
				var date1 = new Date(date11);
				

                $("#availableDatesDet").append('<p>' + freeDates[i].startString+" - " +  freeDates[i].endString + '</p>');
            }

		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

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
            data: JSON.stringify({ message, stays, startDate, apartmentId}),
            contentType: 'application/json',
            success: function () {
                alert("Reservation created");
                location.reload();
            },
            error: function () {
                alert("Reservation not created. Choose valid dates!");
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
	returnValue = year+"-";
	
	if(month == "Jan"){
		returnValue += "01-";
	}else if(month == "Feb"){
		returnValue += "02-";
	}else if(month == "Mar"){
	returnValue += "03-";
	}else if(month == "Apr"){
	returnValue += "04-";	
	}else if(month == "May"){
		returnValue += "05-";
	}else if(month == "Jun"){
		returnValue += "06-";
	}else if(month == "Jul"){
		returnValue += "07-";
	}else if(month == "Aug"){
		returnValue += "08-";
	}else if(month == "Sep"){
		returnValue += "09-";
	}else if(month == "Oct"){
		returnValue += "10-";
	}else if(month == "Nov"){
		returnValue += "11-";
	}else if(month == "Dec"){
		returnValue += "12-";
	} else{
		returnValue += "1-";
	}
	
	returnValue +=day;
	return returnValue;

}
