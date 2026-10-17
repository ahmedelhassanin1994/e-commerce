
export enum ApplicationExceptionType {
VALIDATION_ERROR = 'VALIDATION ERROR',
NOT_FOUND_ERROR = 'NOT FOUND ERROR',
CONFLICT_ERROR = 'CONFLICT ERROR',
INTERNAL_SERVER_ERROR = 'INTERNAL SERVER ERROR',    
}

export class ApplicationException extends Error {
    constructor(message: string ,
        public readonly code: ApplicationExceptionType = ApplicationExceptionType.VALIDATION_ERROR) {
        super(message);
        this.name = 'ApplicationException';
    }
}