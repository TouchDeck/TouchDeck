import ObsSocket from './obsSocket';

console.log('Starting server...');

async function start() {
  const obs = new ObsSocket();
  await obs.connect();

  console.log(await obs.getSceneNames());
}

start().catch(err => console.error('An unhandled error occurred:', err));
