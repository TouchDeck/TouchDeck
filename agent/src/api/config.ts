import { Request, Response } from 'express';
import {
  Configuration,
  getConfiguration,
  setConfiguration,
} from '../configuration/config';

export function getConfig(req: Request, res: Response): void {
  res.json(getConfiguration());
}

export function putConfig(req: Request, res: Response): void {
  const newConfig: Configuration = req.body;
  setConfiguration(newConfig).then(() => res.json(getConfiguration()));
}
