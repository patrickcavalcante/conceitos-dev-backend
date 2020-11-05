const express = require('express');
const {uuid, isUuid} = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const projects = [];

function logRequests(request, response, next){
    const {method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.log(logLabel);
 
    return next();
}

function validateProjectId(request , response, next){
  const { id } = request.params;

  if (!isUuid(id)){
      return response.status(400).json({ error: 'Invalid Project ID'});
  }

  return next();
}

app.use(logRequests);
app.use('/project/:id', validateProjectId);

app.get('/projects', (request, response) => {

    //const {name, idade, estadocivil} = request.query;
    //console.log(name);
    //console.log(idade);
    //console.log(estadocivil);
    const {title} = request.query;

    const results = title ? projects.filter(project => project.title.includes(title))
    : projects

    return response.json(results);
});


app.post('/projects', (request, response) => {

    const {title , owner} = request.body;

    const project = {id: uuid(), title, owner};

    projects.push(project);

    return response.json(project);
});


app.put('/projects/:id', (request, response) => {
    const {id} = request.params;
    const {title , owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not Found'})
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;
   
    return response.json(project);
});


app.delete('/projects/:id', (request, response) => {
    const {id} = request.params;
    
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not Found'})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});


app.listen(3333 , () =>{
    console.log('Back-End Started!');
});