import { Module } from '@nestjs/common';
import { JavaTestController } from './java-test.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
    imports: [ProxyModule],
    controllers: [JavaTestController]
})
export class JavaTestModule { }
