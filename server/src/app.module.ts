import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DeviceModule } from './device/device.module';
import { FloorModule } from './floor/floor.module';
import { SensorModule } from './sensor/sensor.module';

const IS_PROD = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: IS_PROD ? 'postgres' : '127.0.0.1',
        port: 5432,
        username: 'root',
        password: IS_PROD ? '11223344aa' : 'root',
        database: 'iot-project',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true, // 自动链接被 forFeature 注册的实体
        synchronize: true, // 实体与表同步 调试模式下开始。不然会有强替换导致数据丢是
        timezone: 'UTC', // 东八区
        cache: {
          duration: 60000, // 1分钟的缓存
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    FloorModule,
    DeviceModule,
    SensorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
