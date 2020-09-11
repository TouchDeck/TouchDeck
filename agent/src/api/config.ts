import { Request, Response } from 'express';
import { getConfiguration, setConfiguration } from '../configuration/config';
import Configuration from '../model/configuration/Configuration';

export function getConfig(req: Request, res: Response<Configuration>): void {
  res.json(getConfiguration());
}

export function putConfig(req: Request, res: Response<Configuration>): void {
  const newConfig: Configuration = req.body;
  setConfiguration(newConfig).then(() => res.json(getConfiguration()));
}
