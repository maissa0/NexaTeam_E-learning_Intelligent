package tn.esprit.nexaback.persistance.entities;


public class FeedbackRequest {

    private String feedbackText;
    private Integer userId;
    private Integer courseId;
    private Integer emotion;

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }
    public Integer getEmotion() {
    	return emotion;
    }
    public void setEmotion(Integer emotion) {
    	this.emotion = emotion;
    }
}
