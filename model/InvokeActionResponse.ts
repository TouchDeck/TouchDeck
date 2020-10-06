import { ApiResponse, ApiSuccess } from './ApiResponse';
import { ButtonStates } from './ButtonStates';

export type InvokeActionResponse = ApiResponse<InvokeActionSuccessResponse>;

export interface InvokeActionSuccessResponse extends ApiSuccess {
  buttonStates: ButtonStates;
}
