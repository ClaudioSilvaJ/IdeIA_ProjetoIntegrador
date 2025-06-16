
class MessageDTO {
  constructor(message_id, user_id, message, timestamp) {
    this.message_id = message_id;
    this.user_id = user_id;
    this.message = message;
    this.timestamp = timestamp;
  }
}

export default MessageDTO;