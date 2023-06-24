import mysql from 'mysql';

const connection = mysql.createPool({
  connectionLimit: 10, // 可以根据需要调整连接池的大小
  host: 'localhost',
  user: 'chatgpt',
  password: 'cGmstZZJwETDRYtn',
  database: 'chatgpt'
});

export async function getAccountByPassword(accountPassword) {
  console.log('Getting account by password...');
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM account WHERE accountPassword='${accountPassword}'`, (error, results, fields) => {
      if (error) {
        console.log('Error getting account by password:', error);
        reject(error);
      } else if (results.length === 0) {
        console.log(`Account with accountPassword ${accountPassword} not found.`);
        reject(new Error(`Account with accountPassword ${accountPassword} not found.`));
      } else {
        console.log('Account found:', results[0]);
        resolve(results[0]);
      }
    });
  });
}

export async function getRemainingTokensByPassword(accountPassword) {
  console.log('Getting remaining tokens by password...');
  return new Promise((resolve, reject) => {
    connection.query(`SELECT totalTokens, usedTokens FROM account WHERE accountPassword='${accountPassword}'`, (error, results, fields) => {
      if (error) {
        console.log('Error getting remaining tokens by password:', error);
        reject(error);
      } else if (results.length === 0) {
        console.log(`Account with accountPassword ${accountPassword} not found.`);
        reject(new Error(`Account with accountPassword ${accountPassword} not found.`));
      } else {
        console.log('Remaining tokens found:', results[0].totalTokens - results[0].usedTokens);
        const remainingTokens = results[0].totalTokens - results[0].usedTokens;
        resolve({ remainingTokens });
      }
    });
  });
}

export async function accountExists(accountPassword) {
  console.log('Checking if account exists...');
  return new Promise((resolve, reject) => {
    connection.query(`SELECT COUNT(*) AS count FROM account WHERE accountPassword='${accountPassword}'`, (error, results, fields) => {
      if (error) {
        console.log('Error checking if account exists:', error);
        reject(error);
      } else {
        console.log('Account exists:', results[0].count > 0);
        resolve(results[0].count > 0);
      }
    });
  });
}

export async function updateUsedTokensByPassword(accountPassword, usedTokens) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE account SET usedTokens = usedTokens + ${usedTokens} WHERE accountPassword='${accountPassword}'`, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

export async function getUserLevelLabelByPassword(accountPassword) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT userLevel FROM account WHERE accountPassword='${accountPassword}'`, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          const userLevel = results[0].userLevel;
          let label = "";
          switch (userLevel) {
            case 0:
              label = "Free / 免费无限制";
              break;
            case 1:
              label = "VIP 1 / 超值套餐";
              break;
            // 继续添加其他用户等级的标签
            default:
              label = "未知";
              break;
          }
          resolve(label);
        } else {
          resolve("未知");
        }
      }
    });
  });
}


process.on('exit', () => {
  connection.end();
});