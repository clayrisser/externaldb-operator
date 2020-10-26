import ExternaldbOperator from './externaldbOperator';
import config from './config';

(async () => {
  const externaldbOperator = new ExternaldbOperator(config);
  function exit(_reason: string) {
    externaldbOperator.stop();
    process.exit(0);
  }
  process
    .on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
  await externaldbOperator.start();
})().catch(console.error);
