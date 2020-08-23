export interface ActionOption {
  id: string;
  category: string;
  name: string;
}

export async function triggerAction(id: string): Promise<void> {
  console.log('Triggered:', id);
  await fetch(`/api/actions/${id}`, { method: 'POST' });
}

export async function getActionOptions(): Promise<ActionOption[]> {
  return (await fetch(`/api/actions/options`)).json();
}
