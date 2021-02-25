'use strict';

const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let candidates = [
  {
    name: 'test1',
    skills: ['nodejs','express']
  },
  {
    name: 'test2',
    skills: ['java']
  },
  {
    name: 'test3',
    skills: ['nodejs','mongodb','redis']
  }
];

app.post('/candidates', function(req, res) {
  
  if (!req.body.id) return res.sendStatus(400);
  if (!req.body.name) return res.sendStatus(400);
  if (!req.body.skills) return res.sendStatus(400);
  
  const candidate = {
    id: req.body.id,
    name: req.body.name,
    skills: req.body.skills  
  }
  
  candidates.push(candidate);
  
  return res.sendStatus(201);
  
});

app.get('/candidates/search', function(req, res) {
  
  if (!req.query.skills) return res.sendStatus(400);  
  const skills = req.query.skills.split(',');     
  if(!allDifferents(skills)) return res.sendStatus(400);
  
  const myCandidates = JSON.parse(JSON.stringify(candidates));  
  
  const filtered = myCandidates.filter( item => {    
    const filtered = item.skills.filter(skill => skills.includes(skill));    
    if (filtered.length > 0) {         
      item.filtered = filtered.length;
      return true;    
    } else {      
      return false;
    }
  });
  
  if (filtered.length == 0) {
    
    return res.sendStatus(400);
    
  } else {    
    
    filtered.sort( (a,b) => b.filtered - a.filtered);
    
    const first = filtered[0];
    delete first.filtered;    
    return res.status(200).send(first);
    
  }
  
  return res.status(200).send(skills);
  
});

function allDifferents(skills) {
  
  let uniques = {};
  
  for (let skill of skills) {
    
    if (uniques[skill]) {
      return false;
    } else {
      uniques[skill] = 1;                
    }
  }
  
  return true;
  
}

app.listen(process.env.HTTP_PORT || 3000);
