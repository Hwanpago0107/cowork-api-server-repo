const e = require("express");
const express = require("express");
const { nextTick } = require("process");

const app = express();

app.use(express.json()); // express의 json이라는 함수를 POST request 바디에 json으로 된 데이터가 존재할 경우
// 그것을 추출해서 리퀘스트 바디에 바디 프로퍼티에 추가해줌. 리퀘스트가 라우터에 의해 처리되기 전에 추가적으로 필요한 전처리를 하는 함수를
// = 미들웨어

app.use((req, res, next) => {
    console.log(req.query);
    next();
  });

// 직원정보가 있는 배열
// const members = require("./members");
// let members = require("./members"); // delete 리퀘스트 메소드를 쓰기위해 let으로 변경

// db로 만들어준 member 모델 객체 가져온다.
const db = require("./models"); // == ./models/index 와 같다 모듈 불러올때 index.js를 자동으로 찾으므로

const { Member } = db;

app.get("/api/members", async (req, res) => { // api서버는 보통 path 부분에 api를 넣어주도록 함.
    // const team = req.query.team; // url 쿼리 부분에 team이라는 파라미터가 있으면 team 변수에 할당.
    const {team} = req.query; // 위와 동일한 의미의 코드
    if (team) { // team이라는 파라미터가 들어올 때
        // const teamMembers = await Member.findAll({ where: {team: team}}); // where 프로퍼티에 객체를 넣어주면 특정 컬럼에 특정 값을 가진 로우만 조회가능.
        const teamMembers = await Member.findAll({ where: {team}}); // 위와 동일한 코드
        res.send(teamMembers);
    } else {
        const members = await Member.findAll(); // await은 비동기적으로 코드가 실행되는 부분을 기다려줌. async 함수 안에서만 사용가능
        res.send(members);
    }
});

app.get("/api/members/:id", async (req, res) => { // :뒤에 들어오는 값을 id 변수에 담는다.
    // const id = req.params.id; // req.params.id로 :뒤에 들어오는 id 값을 가져올수 있다.
    const {id} = req.params; // 위와 동일한 의미의 코드
    const member = await Member.findOne({ where : {id}}); // findOne : 한 row만 가져옴.
    if (member) {
        res.send(member);
    } else {
        res.status(404).send({ message : "There is no member with no id!" }); // 상태코드 중 요청정보가 없다는 404를 response에 담아줌.
    }
});

app.post("/api/members", async (req, res) => { // post request에는 body가 필요함.
    const newMember = req.body;
    const member = Member.build(newMember);
    await member.save();
    res.send(newMember);
});

// app.put("/api/members/:id", async (req, res) => {
//     const {id} = req.params;
//     const newInfo = req.body;
//     const result = await Member.update(newInfo, { where : {id}}); // 수정된 row 갯수를 배열로 리턴
//     if (result[0]) {
//         res.send({ message: `${result[0]} row(s) affected`});
//     } else {
//         res.status(404).send({ message: 'There is no member with the id!'});
//     }
// });

app.put("/api/members/:id", async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const member = await Member.findOne({ where : {id}}); // findOne : 한 row만 가져옴.
    if (member) {
        Object.keys(newInfo).forEach((prop) => {
            member[prop] = newInfo[prop];
        });
        await member.save();
        res.send(member);
    } else {
        res.status(404).send({ message: 'There is no member with the id!'});
    }
});

app.delete("/api/members/:id", async (req, res) => {
    const {id} = req.params;
    const deletedCount = await Member.destroy({where: { id }}); // 삭제된 row의 갯수를 리턴
    if (deletedCount) {
        res.send({message : `${deletedCount} row(s) deleted`});
    } else {
        res.status(404).send({message : "There is no member with the id!"});
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening..."); // listen 메소드에 콜백을 넣으면 서버가 외부에 request를 받을 준비를 마치면 자동으로 실행
});


