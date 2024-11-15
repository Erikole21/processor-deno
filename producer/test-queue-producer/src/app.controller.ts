import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from './app.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('message')
  async addMessage(@Body() message: any) {
    return await this.queueService.addToQueue(message);
  }
}