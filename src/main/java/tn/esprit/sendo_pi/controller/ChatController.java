package tn.esprit.sendo_pi.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import tn.esprit.sendo_pi.model.ChatMessage;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public




    ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // You could add server-side processing here if needed
        return chatMessage;
    }

    // Optional: Handle user joining/leaving if you want to broadcast those events
}
