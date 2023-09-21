import { dbClient } from './utils/db';

const checkConnection = () => {
  return new Promise((resolve, reject) => {
    let i = 0;

    const checkRep = () => {
      setTimeout(() => {
        i += 1;

        if (i >= 10) {
          reject(new Error('Connection check failed.'));
        } else if (dbClient.isAlive() !== 1) {
          checkRep();
        } else {
          resolve();
        }
      }, 1000);
    };

    checkRep();
  });
};

(async () => {
  console.log(dbClient.isAlive());

  try {
    await checkConnection();
    console.log('Connection is alive.');
  } catch (error) {
    console.error('Connection check failed:', error.message);
  }

  console.log(dbClient.isAlive());
  // console.log('number of users' + await dbClient.nbUsers());
})();
