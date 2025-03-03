import { Injectable } from '@angular/core';

// Export the TextToSpeech interface
export interface TextToSpeech {
  text: string;
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice; // Ensure DOM types are included in your tsconfig.json
}

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root injector
})
export class SpeechService {
  /**
   * The `startSpeaking` function initiates text-to-speech synthesis with the provided data.
   * @param {TextToSpeech} data - The `data` parameter in the `startSpeaking` function likely
   * contains the text that you want to convert to speech. This text will be used to create a speech
   * object that will be spoken using the Web Speech API.
   */
  startSpeaking(data: TextToSpeech) {
    const speech = this.createSpeech(data);
    this.stopSpeaking();
    speechSynthesis.speak(speech);
  }

  /**
   * The function `getVoices` returns an array of available voices for speech synthesis.
   * @returns The `getVoices()` function returns an array of `SpeechSynthesisVoice` objects, which
   * represent the available voices that can be used for speech synthesis.
   */
  getVoices(): SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices();
  }

  /**
   * The function `stopSpeaking()` cancels any ongoing speech synthesis.
   */
  stopSpeaking() {
    speechSynthesis.cancel();
  }

  /**
   * The `pauseSpeaking` function pauses the speech synthesis in TypeScript.
   */
  pauseSpeaking() {
    speechSynthesis.pause();
  }

  /**
   * The `resumeSpeaking` function in TypeScript resumes speech synthesis.
   */
  resumeSpeaking() {
    speechSynthesis.resume();
  }

  /**
   * The function `createSpeech` creates a SpeechSynthesisUtterance object with the provided text,
   * rate, and pitch parameters.
   * @param {TextToSpeech} data - The `data` parameter in the `createSpeech` function is an object of
   * type `TextToSpeech` which contains the following properties:
   * @returns A SpeechSynthesisUtterance object is being returned.
   */
  private createSpeech(data: TextToSpeech) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = data.text;
    speech.rate = data.rate || 1;
    speech.pitch = data.pitch || 1;
    speech.voice = data.voice || null; // Set the voice if provided
    return speech;
  }
}