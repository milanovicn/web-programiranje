package utils;

public class ApartmentSearch {
	
	private int capacityFrom;
	private int roomsFrom;
	private int roomsTo;
	private String destination;
	private double priceFrom;
	private double priceTo;
	private String dateFrom;
	private String dateTo;
	
	public int getCapacityFrom() {
		return capacityFrom;
	}
	public void setCapacityFrom(int capacityFrom) {
		this.capacityFrom = capacityFrom;
	}
	public int getRoomsFrom() {
		return roomsFrom;
	}
	public void setRoomsFrom(int roomsFrom) {
		this.roomsFrom = roomsFrom;
	}
	public int getRoomsTo() {
		return roomsTo;
	}
	public void setRoomsTo(int roomsTo) {
		this.roomsTo = roomsTo;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
	}
	public double getPriceFrom() {
		return priceFrom;
	}
	public void setPriceFrom(double priceFrom) {
		this.priceFrom = priceFrom;
	}
	public double getPriceTo() {
		return priceTo;
	}
	public void setPriceTo(double priceTo) {
		this.priceTo = priceTo;
	}
	public String getDateFrom() {
		return dateFrom;
	}
	public void setDateFrom(String dateFrom) {
		this.dateFrom = dateFrom;
	}
	public String getDateTo() {
		return dateTo;
	}
	public void setDateTo(String dateTo) {
		this.dateTo = dateTo;
	}
	@Override
	public String toString() {
		return "ApartmentSearch [capacityFrom=" + capacityFrom + ", roomsFrom=" + roomsFrom + ", roomsTo=" + roomsTo
				+ ", destination=" + destination + ", priceFrom=" + priceFrom + ", priceTo=" + priceTo + ", dateFrom="
				+ dateFrom + ", dateTo=" + dateTo + "]";
	}
	public ApartmentSearch(int capacityFrom, int roomsFrom, int roomsTo, String destination, double priceFrom,
			double priceTo, String dateFrom, String dateTo) {
		super();
		this.capacityFrom = capacityFrom;
		this.roomsFrom = roomsFrom;
		this.roomsTo = roomsTo;
		this.destination = destination;
		this.priceFrom = priceFrom;
		this.priceTo = priceTo;
		this.dateFrom = dateFrom;
		this.dateTo = dateTo;
	}
	public ApartmentSearch() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

}
