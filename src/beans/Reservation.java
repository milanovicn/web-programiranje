package beans;

import java.time.LocalDateTime;

import beans.enums.ReservationStatus;

public class Reservation {

	private long apartmentId;
	private String startDate;
	private String endDate;
	private int stays;
	private double cost = 0; // potrebno je setovati cenu u servisu (nakon izvlacenja cene po nocenju iz odgovarajuceg apartmana)
	private String message;
	private String guest;
	private ReservationStatus status = ReservationStatus.CREATED;
	private boolean commented = false;
	
	
	public Reservation() {
		super();
		
	}
	
	public Reservation(long apartmentId, String startDate, int stays, String message, String guest) {
		super();
		this.apartmentId = apartmentId;
		this.startDate = startDate;
		this.stays = stays;
		this.message = message;
		this.guest = guest;
		//this.endDate = startDate.plusDays(stays);
		this.status = ReservationStatus.CREATED;
		this.commented = false;
		
	}
	
	
	public long getApartmentId() {
		return apartmentId;
	}
	public void setApartmentId(long apartmentId) {
		this.apartmentId = apartmentId;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public int getStays() {
		return stays;
	}
	public void setStays(int stays) {
		this.stays = stays;
	}
	public double getCost() {
		return cost;
	}
	public void setCost(double cost) {
		this.cost = cost;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getGuest() {
		return guest;
	}
	public void setGuest(String guest) {
		this.guest = guest;
	}
	public ReservationStatus getStatus() {
		return status;
	}
	public void setStatus(ReservationStatus status) {
		this.status = status;
	}

	public boolean isCommented() {
		return commented;
	}

	public void setCommented(boolean commented) {
		this.commented = commented;
	}

	@Override
	public String toString() {
		return "Reservation [apartmentId=" + apartmentId + ", startDate=" + startDate + ", endDate=" + endDate
				+ ", stays=" + stays + ", cost=" + cost + ", message=" + message + ", guest=" + guest + ", status="
				+ status + ", commented=" + commented + "]";
	}
	
	
	
	
}
