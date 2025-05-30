const https = require('https');

async function getDownloadCount() {
  const options = {
    method: 'POST',
    hostname: 'web-drcn.hispace.dbankcloud.com',
    path: '/edge/webedge/appinfo',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postData = JSON.stringify({
    pkgName: 'com.tencent.wechat',
    appId: 'com.tencent.wechat',
    locale: 'zh_CN',
    countryCode: 'CN',
    orderApp: 1
  });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            count: parseInt(json.downCount),
            version: json.version,
            date: new Date().toISOString().split('T')[0]
          });
        } catch (error) {
          reject(`Error parsing response: ${error.message}`);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(`Request failed: ${error.message}`);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test the function
if (require.main === module) {
  getDownloadCount()
    .then(console.log)
    .catch(console.error);
}

module.exports = getDownloadCount;