import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import mysql from 'mysql2'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'mysql',
        port: 3306,
        username: 'root',
        password: '11223344aa',
        database: 'iot-project',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true, // 自动链接被 forFeature 注册的实体
        synchronize: true, // 实体与表同步 调试模式下开始。不然会有强替换导致数据丢是
        "extra": {
            "charset": "utf8mb4_unicode_ci"
        },
        timezone: '+08:00', // 东八区
        cache: {
          duration: 60000, // 1分钟的缓存
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    // ... 其他模块
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
