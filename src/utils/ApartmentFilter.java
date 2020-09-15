package utils;

import beans.enums.ApartmentType;

public class ApartmentFilter {
	private String apartmentType;
	private String amenities;
	public ApartmentFilter() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ApartmentFilter(String apartmentType, String amenities) {
		super();
		this.apartmentType = apartmentType;
		this.amenities = amenities;
	}
	public String getApartmentType() {
		return apartmentType;
	}
	public void setApartmentType(String apartmentType) {
		this.apartmentType = apartmentType;
	}
	public String getAmenities() {
		return amenities;
	}
	public void setAmenities(String amenities) {
		this.amenities = amenities;
	}
	
	
	
}
