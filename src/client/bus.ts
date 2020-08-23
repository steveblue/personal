

import { config } from '../config';

function concatPath(path: string): string {
  return `${config.protocol}://${config.host}:${config.port}/${path}`;
}

(async () => {
  const tracking = await fetch(concatPath('api/track/token'));
  const response = await tracking.json();
  const ipInfo = await fetch(`https://ipinfo.io`, {
    headers: {
      'Authorization': `Bearer ${response.token}`,
      'Accept': `application/json`,
    },
  });
  if (ipInfo.ok) {
    const json = await ipInfo.json();
    console.log(json);
  } else {
    console.warn(`Cannot request user location for analytics: ${ipInfo.status}.`);
  }
})();