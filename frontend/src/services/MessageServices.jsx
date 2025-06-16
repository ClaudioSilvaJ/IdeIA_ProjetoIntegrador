import { NetworkService } from "./NetworkServices";


class MessageServices {
  static async getMessages() {
    return await NetworkService.request({
      url: 'messages',
      method: 'GET',
      responseType: 'application/json',
      contentType: 'application/json',
    })
  }

  static async sendMessage(message) {
    return await NetworkService.request({
      url: 'message',
      method: 'POST',
      responseType: 'application/json',
      contentType: 'application/json',
      data: {
        message: message
      },
    })
  }

  static async createNewUser() {
    return await NetworkService.request({
      url: `user/new-identity`,
      method: 'POST',
      responseType: 'application/json',
      contentType: 'application/json',
    })
  }
}

export default MessageServices;