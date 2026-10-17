import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApplicationExceptionFilter } from './shared/infrastructure/filters/application-expetion.filters.js';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-expetion.filter.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	app.useGlobalFilters(new ApplicationExceptionFilter(),
	 new DomainExceptionFilter());
	const port = process.env.PORT ?? 8079;
	await app.listen(port);
	Logger.log(`Server is running on port ${port}`, 'Bootstrap');
}

bootstrap();
