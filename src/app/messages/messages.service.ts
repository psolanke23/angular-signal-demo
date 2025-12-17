import {Injectable, signal} from "@angular/core";
import {Message, MessageSeverity} from "../models/message.model";


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messageSignal = signal<Message | null>(null);
  message = this.messageSignal.asReadonly();

  showMeassage(message: Message) {
    this.messageSignal.set(message);
  }

  clearMessage() {
    this.messageSignal.set(null);
  }

}
