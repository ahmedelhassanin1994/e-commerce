import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { ApplicationException, ApplicationExceptionType } from "../../domain/excptions/application.excptions.js";


const  CODE_TO_HTTP: Record<ApplicationExceptionType, HttpStatus> = {
 [ ApplicationExceptionType.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ApplicationExceptionType.NOT_FOUND_ERROR]: HttpStatus.NOT_FOUND,
  [ApplicationExceptionType.CONFLICT_ERROR]: HttpStatus.CONFLICT,
  [ApplicationExceptionType.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};

@Catch(ApplicationException) 
export class ApplicationExceptionFilter implements ExceptionFilter {
    

  catch(exception: ApplicationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = CODE_TO_HTTP[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}