package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Amenities;
import beans.Apartment;
import beans.Reservation;
import beans.User;
import beans.enums.ApartmentStatus;
import beans.enums.ReservationStatus;
import utils.TimeInterval;

public class ReservationDAO {
	private HashMap<String, Reservation> reservations = new HashMap<>();
	private String filePath;

	public ReservationDAO() {

	}

	public ReservationDAO(String contextPath) {
		setFilePath(contextPath);
		setReservations(new HashMap<String, Reservation>());
		// testData();
		loadReservations(contextPath);

	}

	// Getters and setters

	public HashMap<String, Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(HashMap<String, Reservation> reservations) {
		this.reservations = reservations;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	// Methods for files and data

	@SuppressWarnings("unchecked")
	public void loadReservations(String contextPath) {
		File file = null;
		FileWriter fileWriter = null;
		BufferedReader in = null;

		try {
			file = new File(contextPath + "/data/_reservations.txt");
			in = new BufferedReader(new FileReader(file));

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

			TypeFactory factory = TypeFactory.defaultInstance();
			MapType type = factory.constructMapType(HashMap.class, String.class, Reservation.class);
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			reservations = (HashMap<String, Reservation>) objectMapper.readValue(file, type);
		} catch (FileNotFoundException fnf) {
			try {
				file.createNewFile();
				fileWriter = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String usersToString = objectMapper.writeValueAsString(reservations);
				fileWriter.write(usersToString);
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} finally {
				if (fileWriter != null) {
					try {
						fileWriter.close();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		System.out.println("loadResservations() -> Putanja za cuvanje:" + filePath + "/data/_reservations.txt");
		System.out.println("LOADED RESERVATIONS: " + reservations);
	}

	public void saveReservations() {
		File file = new File(filePath + "/data/_reservations.txt");
		System.out.println("saveUsers() -> Putanja za cuvanje:" + filePath + "/data/_reservations.txt");
		System.out.println("SAVED RESERVATIONS: " + reservations);
		try {
			file.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
		FileWriter fileWriter = null;
		try {
			fileWriter = new FileWriter(file);
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
			objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			// Through the configure method we can extend the default process to ignore the
			// new fields
			objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			String usersToString = objectMapper.writeValueAsString(reservations);
			fileWriter.write(usersToString);
			fileWriter.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileWriter != null) {
				try {
					fileWriter.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	@Override
	public String toString() {
		return "ReservationDAO [reservations=" + reservations + ", filePath=" + filePath + "]";
	}

//Functionalities

	public Collection<Reservation> findAll() {
		return reservations.values();
	}

	public Reservation addReservation(Reservation res, TimeInterval resInterval,
			ArrayList<TimeInterval> reservedDates) {
		if (!resInterval.valid()) {
			return null;
		}

		if (!resInterval.overlaps(resInterval, reservedDates)) {
			reservations.put(res.getMessage(), res);
			saveReservations();
			return res;

		} else {
			return null;
		}

	}

	public Reservation cancelReservation(Long apartmentId, String startDate, String endDate) {
		for (Reservation r : reservations.values()) {
			if (r.getApartmentId() == apartmentId && r.getStartDate().equals(startDate)
					&& r.getEndDate().equals(endDate)) {
				if (r.getStatus().equals(ReservationStatus.CREATED)
						|| r.getStatus().equals(ReservationStatus.ACCEPTED)) {
					r.setStatus(ReservationStatus.CANCELED);
					saveReservations();
					return r;
				}
			}

		}

		return null;
	}

	public ArrayList<Reservation> findReservationsByApartmentId(Long id) {
		ArrayList<Reservation> ret = new ArrayList<Reservation>();
		for (Reservation r : reservations.values()) {
			if (r.getApartmentId() == id) {
				ret.add(r);
			}
		}
		return ret;
	}

	public Reservation acceptReservation(Long apartmentId, String startDate, String endDate) {
		for (Reservation r : reservations.values()) {
			if (r.getApartmentId() == apartmentId && r.getStartDate().equals(startDate)
					&& r.getEndDate().equals(endDate)) {
				if (r.getStatus().equals(ReservationStatus.CREATED)) {
					r.setStatus(ReservationStatus.ACCEPTED);
					saveReservations();
					return r;
				}
			}

		}

		return null;
	}

	public Reservation rejectReservation(Long apartmentId, String startDate, String endDate) {
		for (Reservation r : reservations.values()) {
			if (r.getApartmentId() == apartmentId && r.getStartDate().equals(startDate)
					&& r.getEndDate().equals(endDate)) {
				if (r.getStatus().equals(ReservationStatus.CREATED)) {
					r.setStatus(ReservationStatus.REJECTED);
					saveReservations();
					return r;
				}
			}

		}

		return null;
	}
	
	public Reservation endReservation(Long apartmentId, String startDate, String endDate) {
		for (Reservation r : reservations.values()) {
			if (r.getApartmentId() == apartmentId && r.getStartDate().equals(startDate)
					&& r.getEndDate().equals(endDate)) {
				if (r.getStatus().equals(ReservationStatus.ACCEPTED)) {
					r.setStatus(ReservationStatus.ENDED);
					saveReservations();
					return r;
				}
			}

		}

		return null;
	}



}
