import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
