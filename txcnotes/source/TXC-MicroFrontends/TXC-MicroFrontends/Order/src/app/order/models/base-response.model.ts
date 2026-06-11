import { ErrorValidationDto } from 'src/app/shared/models/product-dto.model';

export interface BaseResponse {
  data: any;
  message: string;
  success: boolean;
}

export interface BaseErrorResponse {
  error: {
    data: {
      errorValidationDto: ErrorValidationDto[];
    };
    message: string;
    success: boolean;
  };
}
