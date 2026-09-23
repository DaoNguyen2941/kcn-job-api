import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../dto/paginated-result.dto';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: unknown;
}

/**
 * Wraps every successful controller response in a consistent envelope:
 * { success, message, data, meta? }
 * If a handler returns a PaginatedResult, `data` and `meta` are split out.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<any>> {
    return next.handle().pipe(
      map((result): ApiResponse<any> => {
        if (result instanceof PaginatedResult) {
          return {
            success: true,
            message: 'OK',
            data: result.data,
            meta: result.meta,
          };
        }
        return {
          success: true,
          message: 'OK',
          data: result ?? null,
        };
      }),
    );
  }
}
