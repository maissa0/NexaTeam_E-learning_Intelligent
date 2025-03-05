package tn.esprit.sendo_pi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import tn.esprit.sendo_pi.model.ChatMessage;
import tn.esprit.sendo_pi.repository.ChatMessageRepository;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Allow Angular frontend
@RestController
@RequestMapping("/api")  // Ensure your API base path is "/api"
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // ✅ HTTP GET Endpoint to retrieve messages
    @GetMapping("/messages")
    public List<ChatMessage> getMessages() {
        return chatMessageRepository.findAll();  // Fetch all messages from DB
    }

    // ✅ WebSocket message handling
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }
}
