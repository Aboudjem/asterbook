import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('api/chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for current user' })
  async getConversations(@CurrentUser('id') userId: number) {
    return this.chatService.getConversations(userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create or get existing conversation with user' })
  async createConversation(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(userId, dto.targetUserId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async getConversation(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) conversationId: number,
  ) {
    return this.chatService.getConversation(conversationId, userId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages from a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async getMessages(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) conversationId: number,
    @Query() query: GetMessagesDto,
  ) {
    return this.chatService.getMessages(
      conversationId,
      userId,
      query.limit,
      query.offset,
    );
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  async sendMessage(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) conversationId: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(conversationId, userId, dto.message);
  }
}
