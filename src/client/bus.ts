import { config } from '../config';

function concatPath(path: string): string {
  return `${config.protocol}://${config.host}:${config.port}/${path}`;
}

function inputCheck(os) {
  if (os === 'ios' || os === 'android' || os === 'winphone') {
    return 'touch';
  } else {
    return 'mouse';
  }
}

function browserCheck() {
  let uagent = navigator.userAgent.toLowerCase();
  let temp = [];
  let browser = '';
  let version = '';
  let M = uagent.match(/(edge|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if (uagent.match(/(edge(?=\/))\/?\s*(\d+)/i)) {
    M = uagent.match(/(edge(?=\/))\/?\s*(\d+)/i);
    browser = 'edge';
    version = M[2];
    return 'Edge ' + (M[2] || '');
  }
  if (/trident/i.test(M[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(uagent) || [];
    browser = 'msie';
    version = temp[1];
    return 'IE ' + (temp[1] || '');
  }
  if (M[1] === 'Chrome') {
    temp = uagent.match(/\bOPR\/(\d+)/);
    if (temp != null) {
      browser = 'opera';
      version = temp[1];
      return 'Opera ' + temp[1];
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

  if ((temp = uagent.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, temp[1]);
  }
  browser = M[0];
  version = M[1];
  return {
    pretty: M.join(' '),
    browser: browser,
    version: version
  } 
}

function osCheck() {
  let os = '';
  let device = '';
  let uagent = navigator.userAgent.toLowerCase();
  if (navigator.appVersion.indexOf("Win") != -1) {
    os = 'windows';
    device = 'desktop';
  } else if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.match(/(iPhone|iPod|iPad)/) == null) {
    os = 'macos';
    device = 'desktop';
  } else if (navigator.userAgent.indexOf("Android") > -1) {
    os = 'android';
    if (navigator.userAgent.indexOf("Mobile") > -1) {
      device = 'mobile';
    } else {
      device = 'tablet';
    }

  } else if (navigator.userAgent.indexOf("windows phone") > 0) {
    os = 'windows';
    device = 'mobile';
  } else if (navigator.appVersion.indexOf("X11") != -1) {
    os = 'unix';
    device = 'desktop';
  } else if (navigator.appVersion.indexOf("Linux") != -1) {
    os = 'linux';
    device = 'desktop';
  } else if (navigator.userAgent.match(/(iPhone|iPod|iPad)/) !== null && navigator.userAgent.match(/(iPhone|iPod|iPad)/).length > 0) {
    os = 'ios';
    if (uagent.indexOf("iphone") > 0) {
      device = "iphone";
    }
    if (uagent.indexOf("ipod") > 0) {
      device = "ipod";
    }
    if (uagent.indexOf("ipad") > 0) {
      device = "ipad";
    }
  } else {
    os = 'unknown';
  }
  return {
   os: os,
   device: device
  }
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
    const device = {
      os: osCheck(),
      browser: browserCheck(),
      input: inputCheck(osCheck().os)
    };
    locative.loc = locative.loc.split(',');
    const track = {
      utc: timestamp.toUTCString(),
      timestamp: timestamp.getTime(),
      locative: locative,
      device: device
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