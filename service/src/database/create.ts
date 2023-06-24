import mysql from 'mysql';

export function createTable() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'chatgpt',
    password: 'cGmstZZJwETDRYtn',
    database: 'chatgpt'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database as id', connection.threadId);

    connection.query(`
      CREATE TABLE IF NOT EXISTS account (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
        accountName VARCHAR(255) NOT NULL COMMENT '用户名',
        accountPassword VARCHAR(255) UNIQUE NOT NULL COMMENT '密码',
        totalTokens INT NOT NULL COMMENT '总代币数',
        usedTokens INT NOT NULL COMMENT '已使用代币数',
        regDate DATE NOT NULL COMMENT '注册时间',
        userStatus TINYINT NOT NULL DEFAULT 0 COMMENT '用户状态，0为正常，1为被封',
        userLevel INT NOT NULL DEFAULT 0 COMMENT '用户等级，代表套餐等级',
        packageExpireDate DATE DEFAULT NULL COMMENT '套餐到期时间'
    );
    `, (error, results, fields) => {
      if (error) throw error;

      console.log('Table "account" created successfully');
    });

    connection.end((err) => {
      if (err) {
        console.error('Error disconnecting from MySQL database:', err);
        return;
      }
      console.log('Disconnected from MySQL database');
    });
  });
}
