import { Request, Response } from 'express';
import { getConfiguration, setConfiguration } from '../configuration/config';
import Configuration from '../model/configuration/Configuration';

export function putConfig(req: Request, res: Response<Configuration>): void {
  const newConfig: Configuration = req.body;
  setConfiguration(newConfig).then(() => res.json(getConfiguration()));
}

export function putButton(req: Request, res: Response<Configuration>): void {
  const newConfig = { ...getConfiguration() };
  newConfig.buttons = [
    ...newConfig.buttons.filter((b) => b.id !== req.params.button),
    req.body,
  ];
  setConfiguration(newConfig).then(() => res.json(getConfiguration()));
}

export function deleteButton(req: Request, res: Response<Configuration>): void {
  const newConfig = { ...getConfiguration() };
  newConfig.buttons = newConfig.buttons.filter(
    (b) => b.id !== req.params.button
  );
  setConfiguration(newConfig).then(() => res.json(getConfiguration()));
}

export function putLayout(req: Request, res: Response<Configuration>): void {
  const newConfig = { ...getConfiguration() };
  newConfig.layouts[req.params.layout] = req.body;
  setConfiguration(newConfig).then(() => res.json(getConfiguration()));
}
