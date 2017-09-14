const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {DATABASE, PORT} = require('./config');
const knex = require('knex')(DATABASE);

app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
  res.send('hello world');
})

// app.listen(process.env.PORT||8080)

let server;

function runServer(){
	return new Promise((resolve, reject) => {
		server = app.listen(process.env.PORT || 8080, () => {
			console.log("Your app is running on port 8080"); 
			resolve(); 
		})
		.on('error', err => {
			reject(err); 
		}); 
	}); 
} 

function closeServer(){
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if(err){
				reject(err); 
			}
			return; 
		})
		resolve(); 
	}); 
}

if(require.main === module) {
	console.log("Starting in production or development mode");
	runServer().catch(err => console.err(err)); 
}

app.get('/api/stories', (req, res) => {
  knex('posts')
    .limit(20)
    .select('id', 'title', 'url', 'votes')
    .then((response) => {
      console.log(response)
      res.status(200).json(response)
    }); 
}); 

app.put('/api/stories/:id', (req, res) => {
  knex('posts')
    .where({ id: req.params.id})
    .update({
      votes: knex.raw('votes + 1')
    })
    .then(response => {
      console.log(response);
      res.sendStatus(204);
    })
})
// NOT WORKING
// .on("error", err => {
//   res.status(500).send(err); 
// }); 

app.post('/api/stories', (req, res) => {
  //set var equal to array of strings of required fields: title, url
  const requiredField = ['title', 'url'];
  //iterate through arr and set field = requiredfield[i]
  requiredField.forEach(field=> {
    if(!(field) in req.body){
    const message = `Missing ${field}`;
      console.error(message);
      res.status(400).send(message);
    }
    console.log('everything working');
  })
  // for (let i=0; i< requiredField.length; i++){
  //   const field = requiredField[i]
  //   //if field isn't in the request
  //   if(!(field in req.body)){
  //     //send error message
  //     const message = `Missing ${field}`;
  //     console.error(message);
  //     res.status(400).send(message);
  //   }
  //   console.log('everything working');
  // }
  newPost = {
    title: req.body.title,
    url: req.body.url
  }
  knex('posts')
  .returning(['id', 'title', 'url', 'votes'])
  .insert(newPost)
  .then(response => {
    res.status(201).json(response[0]);
  })
})




module.exports = {app, runServer, closeServer};