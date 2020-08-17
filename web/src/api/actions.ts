import jsonBody from './jsonBody';

export async function triggerAction(uuid: string): Promise<void> {
  console.log('Triggered:', uuid);
  await fetch(
    '/api/actions',
    jsonBody('POST', {
      action: uuid,
    })
  );
}
