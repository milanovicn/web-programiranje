package beans;

public class Comment {

	private long apartmentId;
	private String author;
	private String content;
	private int rate;
	
	public Comment(long apartmentId, String author, String content, int rate) {
		super();
		this.apartmentId = apartmentId;
		this.author = author;
		this.content = content;
		this.rate = rate;
	}

	public Comment() {
		super();
	}

	public long getApartmentId() {
		return apartmentId;
	}

	public void setApartmentId(long apartmentId) {
		this.apartmentId = apartmentId;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	@Override
	public String toString() {
		return "Comment [apartmentId=" + apartmentId + ", author=" + author + ", content=" + content + ", rate=" + rate
				+ "]";
	}
	
	
	
}
