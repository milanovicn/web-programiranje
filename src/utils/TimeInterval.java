package utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class TimeInterval {

	private Date start;
	private Date end;
	private String endString;
	private String startString;

	public TimeInterval(Date start, Date end) {
		super();
		this.start = start;
		this.end = end;
		
		SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy");
		this.endString = formatter.format(end);
		this.startString = formatter.format(start);		

	}

	public TimeInterval() {
	}

	public Date getStart() {
		return start;
	}

	public void setStart(Date start) {
		this.start = start;
	}

	public Date getEnd() {
		return end;
	}

	public void setEnd(Date end) {
		this.end = end;
	}
	
	public String getEndString() {
		return endString;
	}

	public void setEndString(String endString) {
		this.endString = endString;
	}

	public String getStartString() {
		return startString;
	}

	public void setStartString(String startString) {
		this.startString = startString;
	}

	@Override
	public String toString() {
		return "TimeInterval [start=" + start + ", end=" + end + ", endString=" + endString + ", startString="
				+ startString + "]";
	}
	
	//returns true if new reservation interval overlaps with existing
	//time interval for creating new reservation
	//list of reserved intervals for existing reservations
	public boolean overlaps(TimeInterval newReservation, ArrayList<TimeInterval> existingReservations ) {
		
		for(TimeInterval ti : existingReservations) {
			//two ranges overlap if:
			//(StartDate1 <= EndDate2) and (StartDate2 <= EndDate1)
			if(newReservation.getStart().before(ti.getEnd()) && ti.getStart().before(newReservation.getEnd()) ) {
				return true;
			}
			
		}
		
		return false;
	}

	//returns true if start date is before end date
	public boolean valid() {
		if(this.start.before(end)) {
			return true;
		}
		return false;
	}

	//adds new interval to the list
	public ArrayList<TimeInterval> updateFreeDates(TimeInterval resInterval, ArrayList<TimeInterval> freeDates) {
		ArrayList<TimeInterval> ret = freeDates;
		System.out.println("return list before for: " + ret);
		for(TimeInterval fd : freeDates){
			//two ranges overlap if:
			//(StartDate1 <= EndDate2) and (StartDate2 <= EndDate1)
			if(fd.getStart().before(resInterval.getEnd()) && resInterval.getStart().before(fd.getEnd()) ) {
				//if the two overlap, the old interva (fd) is deleted and make two new intervals
				TimeInterval ti1 = new TimeInterval(fd.getStart(), resInterval.getStart());
				TimeInterval ti2 = new TimeInterval(resInterval.getEnd(), fd.getEnd());
				System.out.println("TI1: " + ti1);
				System.out.println("TI2: " + ti2);
				ret.remove(fd);
				ret.add(ti1);
				ret.add(ti2);
				System.out.println("return list after for: " + ret);
				return ret;
			}
			
		}
		System.out.println("return list after for null?: " + ret);
		return null;
	}
	
	
	
	
}
