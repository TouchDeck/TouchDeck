import ActionOption from '../model/ActionOption';
import { getAvailableActions } from '../actions/actionRegistry';

export default function getActionOptions(): ActionOption[] {
  return getAvailableActions().map((action) => ({
    type: action.constructor.name,
    category: action.category,
    name: action.name,
    parameters: action.parameters,
    toggleable: action.toggleable,
  }));
}
