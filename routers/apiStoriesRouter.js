const express = require("express"); 
const router = express.Router(); 

router.get('/', (req, res) => {
    knex.select('news.id','news.title', 'news.url', 'news.votes', 'tags.tag')
      .from('news')  
      .limit(20)
      .innerJoin('news_tags', 'news.id', 'news_tags.news_id')
      .innerJoin('tags', 'news_tags.tags_id', 'tags.id')
      .then(results => {
        console.log(JSON.stringify(results, null, 2)); 
        const hydrated = [], lookup = {}; 
        for(let story of results){
          if(!lookup[story.id]) {
            lookup[story.id] = {
              id: story.id, 
              title: story.title, 
              url: story.url, 
              votes: story.values, 
              tags: []
            }
            hydrated.push(lookup[story.id]);
          } 
          lookup[story.id].tags.push({
            id: story.tagId, 
            tag: story.tag
          }); 
        }
        res.status(200).json(hydrated); 
      }); 
  }); 
  
  router.put('/:id', (req, res) => {
    knex('posts')
      .where({ id: req.params.id})
      .update({
        votes: knex.raw('votes + 1')
      })
      .then(response => {
        console.log(response);
        res.sendStatus(204);
      })
      .catch(err => {
        console.log(err); 
        res.sendStatus(500); 
      }); 
  }); 

  
 router.post('/', (req, res) => {
    // set var equal to array of strings of required fields: title, url
    const requiredField = ['title', 'url'];
    // iterate through arr and set field
    requiredField.forEach(field=> {
      if(!(field) in req.body){
      const message = `Missing ${field}`;
        console.error(message);
        res.status(400).send(message);
        return; 
      }
    })
    let newId; 
    knex
      .insert({
        title: req.body.title,
        url: req.body.url
      })
      .into('news')
      .returning('id')
      .then(([id]) => {
        newId = id; 
        let promises = []; 
        // IF has tags, do this. Not a required field ^, optional
        req.body.tags.forEach(tag => {
          const promise = knex('news_tags')
            .insert({
              news_id: newId, 
              tags_id: tag
            })
          promises.push(promise);
        }); 
        return Promise.all(promises); 
      })
      .then(() => {
        res.sendStatus(201)
      })
      .catch(err => {
        console.error(err); 
        res.sendStatus(500); 
      });
  });

  module.exports = router; 