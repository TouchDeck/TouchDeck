import { Request, Response } from 'express';
import { getAvailableActions } from '../actions/actionRegistry';

export default function getActionOptions(req: Request, res: Response): void {
  res.send(
    getAvailableActions().map((action) => ({
      id: action.constructor.name,
      category: action.category,
      name: action.name,
    }))
  );
}
