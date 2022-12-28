import { Controller, Get, Body, Req, Logger, Post } from '@nestjs/common';
import { FacebookEntry, Messaging } from '@core/interface';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  registerChangelle(@Req() req: any) {
    // Parse params from the webhook verification request
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query.hub.challenge;
    this.logger.log({ message: 'webhook registration', mode, token, challenge });
    return challenge;
  }

  @Post()
  async getData(@Body() { object, entry }: FacebookEntry) {
    if (object === 'page') {
      this.logger.log({ message: 'entry for facebook recived', entry: entry });
      const messaging: Messaging = entry[0].messaging[0];

      if (messaging.message) {
        return await this.webhookService.receivedMessage(messaging);
      }

      if (messaging.postback) {
        return await this.webhookService.receivedPostback(messaging);
      }

      this.logger.warn({ message: 'Webhook received unknown messagingEvent:' }, messaging);
    }
  }
}
