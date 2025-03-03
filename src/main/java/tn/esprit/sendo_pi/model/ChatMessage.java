package tn.esprit.sendo_pi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;


@Entity
public class ChatMessage {
    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private MessageType type;
    private String content;
    private String sender;
    private LocalDateTime timestamp;

    public ChatMessage(String sender, String content, LocalDateTime timestamp,MessageType type) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }
    // **Default (No-Arg) Constructor**
    public ChatMessage() {
    }

    // Getters and Setters
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime sender) { this.timestamp = timestamp; }
}
