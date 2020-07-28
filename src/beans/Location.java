package beans;

public class Location {

	private String address;
	private String latitude;
	private String longitude;
	private String street;
	private String number;
	private String city;
	private String postalCode;
	
	public Location() {
		super();

	}

	public Location(String latitude, String longitude, String street, String number, String city, String postalCode) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
		this.street = street;
		this.number = number;
		this.city = city;
		this.postalCode = postalCode;
		this.address = street + number + ", " + city  + ", " + postalCode;
	}

	
	@Override
	public String toString() {
		return "Location [address=" + address + ", latitude=" + latitude + ", longitude=" + longitude + ", street="
				+ street + ", number=" + number + ", city=" + city + ", postalCode=" + postalCode + "]";
	}


	public String getAddress() {
		return address;
	}
	
	public void setAddress(String address) {
		this.address = address;
	}
	
	public String getLatitude() {
		return latitude;
	}
	
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	
	public String getLongitude() {
		return longitude;
	}
	
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	
	
}
