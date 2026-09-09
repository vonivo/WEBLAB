import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import type { CreateGameDto } from "../dto/game.dto.js";
import { GameService } from "../services/game.service.js";

@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames() {
    return this.gameService.findAll();
  }

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }
}
