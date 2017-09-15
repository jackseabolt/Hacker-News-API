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
    const req = {}
    req.body = {
      title: req.body.title,
      url: req.body.url,
      tags: [1,2,3]
    }

    let newId; 
    knex
    .insert({
        title: req.body.title, 
        url: req.body.url
    })
    .returning('id')
    .then(( [id] ) => {
        console.log(id)
    })