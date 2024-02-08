import { SharedService } from './../shared/shared.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileController } from './file.controller';
import { FormGeneratorService } from 'shared/form-generator.service';
import { LogUtilService } from 'shared/log-util.service';

@Module({
  imports: [],
  controllers: [AppController, FileController],
  providers: [
    FormGeneratorService, LogUtilService, AppService],
})
export class AppModule { }
