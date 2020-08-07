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
					//$("#userDiv").show();
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
					//$("#userDiv").hide();
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
					//$("#userDiv").hide();
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
            //slobodni datumi fale <3
            let amenities = apartment.amenities;
            console.log("amenities");
            var duzina = Object.keys(amenities).length
            console.log(duzina);

            for( i = 0; i < duzina; i++){
                console.log("uso for amenities");
                $("#amenitiesDet").append( amenities[i].name+" ");
            }

           

            let images = apartment.images;
            console.log("images");
            console.log(images);
            var duzina2 = Object.keys(images).length
            console.log(duzina2);
            for(let i=0; i<duzina2; i++){
                
                console.log("uso for images");
                //images[i].replace("\\", "/");
                console.log("Image [i]");
                console.log(images[i]);
                $("#gallery").append('<img src="'+ images[i] +'" height="200"></img>');
            }
		},
		error: function (jqXhr, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});

}
