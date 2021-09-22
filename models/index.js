const Sequelize = require("sequelize"); // 시퀄라이즈 객체를 가져옴.


const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env]; // config.json 파일 객체를 가져옴

const {
  username, password, database, host, dialect,
} = config; // 디벨롭먼트 객체의 접속정보 => 그냥 config 로 수정

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect
});

const Member = require("./member")(sequelize, Sequelize.DataTypes); // sequelize 객체를 이용해서 초기화한 멤버 모델 객체

const db = {}; // db 객체를 따로 만들어 Member 모델을 공개함. 추가 될수도 있으므로
db.Member = Member;

module.exports = db;