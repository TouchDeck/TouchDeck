export interface ActionOption {
  id: string;
  category: string;
  name: string;
}

export async function triggerAction(uuid: string): Promise<void> {
  console.log('Triggered:', uuid);
  await fetch(`/api/actions/${uuid}`, { method: 'POST' });
}

export function getActionOptions(): Promise<ActionOption[]> {
  return fetch(`/api/actions/options`).then((res) => res.json());
}
