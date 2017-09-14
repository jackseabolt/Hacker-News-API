const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

describe('Hacker News API', function () {
  
  before(function () {
    return runServer();
  });
  
  // beforeEach(function () {

  // });

  // afterEach(function () {

  // });
  
  after(function () {
    return closeServer();
  });

  it("on GET requests, it returns all data from posts", function(){ 
    console.log("GET test running"); 
    return chai.request(app)
      .get('/api/stories')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array'); 
        res.body.length.should.be.above(0); 
        res.body.forEach(function(item){
          item.should.be.a('object'); 
          item.should.have.all.keys('id', 'votes', 'title', 'url' ); 
        }); 
      });
  }); 

it("on POST request, it returns 201 and return new object", function(){
  console.log("POST test is running"); 
  const newItem = {title: 'my test title', url: 'www.test.com'}; 
  return chai.request(app)
    .post('/api/stories')
    .send(newItem)
    .then(function(res){ 
      res.should.have.status(201);
      res.should.be.json; 
      res.body.should.be.a('object')
      res.body.should.include.keys('id', 'title', 'url', 'votes'); 
      res.body.id.should.not.be.null; 
      res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id, votes: res.body.votes}));
    }); 
}); 

it("on PUT request, it returns 204", function(){
  console.log("PUT test is running"); 
  return chai.request(app)
    .put('/api/stories/1')
    .then(function(res){
      res.should.have.status(204); 
    }); 
}); 


  // describe('Starter Test Suite', function () {
    
  //   it('should be true', function () {
  //     true.should.be.true;
  //   });
    
  // });

}); 