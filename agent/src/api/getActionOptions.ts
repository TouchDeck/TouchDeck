import { Request, Response } from 'express';
import { getAvailableActions } from '../actions/actionRegistry';
import ActionOption from '../model/ActionOption';

export default function getActionOptions(
  req: Request,
  res: Response<ActionOption[]>
): void {
  res.json(
    getAvailableActions().map((action) => ({
      type: action.constructor.name,
      category: action.category,
      name: action.name,
      parameters: action.parameters,
    }))
  );
}
