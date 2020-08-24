

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
    const locative = await ipInfo.json();
    const timestamp = new Date();
    locative.loc = locative.loc.split(',');
    const track = {
      utc: timestamp.toUTCString(),
      timestamp: timestamp.getTime(),
      locative: locative
    };
    const save = await fetch('http://localhost:4443/api/track/save', {
      method: 'POST',
      headers: {
        'Accept': `application/json`,
        'Content-Type': `application/json`
      },
      body: JSON.stringify(track)
    });
    const success = await save.json();
    console.log(success);
  } else {
    console.warn(`Cannot request user location for analytics: ${ipInfo.status}.`);
  }
})();