export type PressButtonResult = PressButtonSuccess | PressButtonError;

export interface PressButtonSuccess {
  success: true;
}

export interface PressButtonError {
  success: false;
  error: string;
  errorId: string;
}
