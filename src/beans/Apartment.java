package beans;

import java.time.LocalDateTime;
import java.util.ArrayList;

import beans.enums.ApartmentStatus;
import beans.enums.ApartmentType;

public class Apartment {

	private long id = 0;
	private ApartmentType type = ApartmentType.APARTMENT;
	private int rooms;
	private int capacity;
	private Location location;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private String host;
	private double price;
	private String checkIn = "2PM";
	private String checkOut = "10AM";
	private ApartmentStatus status = ApartmentStatus.ACTIVE;
	
	private ArrayList<Amenities> amenities = new ArrayList<Amenities>();
	private ArrayList<Reservation> reservations = new ArrayList<Reservation>();
	private ArrayList<Comment> comments = new ArrayList<Comment>();
	//lista dostupnosti
	//slike
		
	
	public Apartment() {
		super();
		
	}
	public Apartment(ApartmentType type, int rooms, int capacity, Location location, LocalDateTime startDate,
			LocalDateTime endDate, String host, double price, String checkIn, String checkOut) {
		super();
		this.type = type;
		this.rooms = rooms;
		this.capacity = capacity;
		this.location = location;
		this.startDate = startDate;
		this.endDate = endDate;
		this.host = host;
		this.price = price;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.status = ApartmentStatus.ACTIVE;
		this.id = 0;
	}
	
	
	@Override
	public String toString() {
		return "Apartment [type=" + type + ", rooms=" + rooms + ", capacity=" + capacity + ", location=" + location
				+ ", startDate=" + startDate + ", endDate=" + endDate + ", host=" + host + ", price=" + price
				+ ", checkIn=" + checkIn + ", checkOut=" + checkOut + ", status=" + status + "]";
	}
	
	
	public ApartmentType getType() {
		return type;
	}
	public void setType(ApartmentType type) {
		this.type = type;
	}
	public int getRooms() {
		return rooms;
	}
	public void setRooms(int rooms) {
		this.rooms = rooms;
	}
	public int getCapacity() {
		return capacity;
	}
	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public LocalDateTime getStartDate() {
		return startDate;
	}
	public void setStartDate(LocalDateTime startDate) {
		this.startDate = startDate;
	}
	public LocalDateTime getEndDate() {
		return endDate;
	}
	public void setEndDate(LocalDateTime endDate) {
		this.endDate = endDate;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public String getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(String checkIn) {
		this.checkIn = checkIn;
	}
	public String getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(String checkOut) {
		this.checkOut = checkOut;
	}
	public ApartmentStatus getStatus() {
		return status;
	}
	public void setStatus(ApartmentStatus status) {
		this.status = status;
	}
	public ArrayList<Amenities> getAmenities() {
		return amenities;
	}
	public void setAmenities(ArrayList<Amenities> amenities) {
		this.amenities = amenities;
	}
	public ArrayList<Reservation> getReservations() {
		return reservations;
	}
	public void setReservations(ArrayList<Reservation> reservations) {
		this.reservations = reservations;
	}
	public ArrayList<Comment> getComments() {
		return comments;
	}
	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	
	
	
	
	
}
