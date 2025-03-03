import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  messages: any[] = [];

  constructor(private http: HttpClient) {}

  // Connect to WebSocket
  connect(callback: () => void) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('WebSocket Connected');

      // Subscribe to messages
      this.subscribeToMessages((message:{content: string,sender:string}) => {
        console.log('Received message:', message);
        this.messages.push(message); // Store the message
      });

      // Fetch old messages
      this.fetchOldMessages(callback);
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected.');
      });
    }
  }

  // Fetch old chat messages from backend
  fetchOldMessages(callback: () => void) {
    this.http.get<any[]>('http://localhost:8080/api/messages').subscribe((data) => {
      this.messages = data;
      console.log("Loaded previous messages:", this.messages);
      callback(); // Notify that messages are loaded
    });
  }

  // Send a chat message
  sendMessage(message: string) {
    console.log("Sending message:", message); // ✅ Debugging log
  
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ content: message }));
    } else {
      console.error("WebSocket is not connected!");
    }
  }
  isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }
  

  // Subscribe to real-time messages from WebSocket
  subscribeToMessages(callback: (message: { sender: string, content: string }) => void) {
    this.stompClient.subscribe('/topic/public', (response: any) => {
      const message = JSON.parse(response.body); // Ensure parsing JSON correctly
      console.log('Received message:', message);
      this.messages.push(message); // Add full message object
      callback(message);
    });
  }
  
}
