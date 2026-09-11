import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { CreateGameDto, GameEventDto } from "../dto/game.dto.js";
import { GameService } from "../services/game.service.js";
import { AuthGuard } from "../../authentication/auth.guard.js";

@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames() {
    return this.gameService.findAll();
  }

  @Get(":gameId")
  async getGameGyId(@Param("gameId") gameId: string) {
    const game = await this.gameService.findById(gameId);
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }
    return game;
  }

  @Post(":gameId/events")
  @UseGuards(AuthGuard)
  async addEvent(
    @Param("gameId") gameId: string,
    @Body() createdEvent: GameEventDto,
  ) {
    return this.gameService.addEvent(createdEvent, gameId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }
}
