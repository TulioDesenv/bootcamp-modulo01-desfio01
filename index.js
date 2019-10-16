const express = require('express');

const server = express();
server.use(express.json());

const projects =
    [
      { "id" : "01",
        "title" : "Projeto Desafio 01",
        "tasks" : ["Criar o Desafio", "Testar o Desafio"]
      }
    ];

let totalReq = 0;

//Meddleware para verificar se o projeto existe
function checkIfProjectExist(req, res, next) {
  const exist = (projects.find(p => p.id === req.params.id))  
  
  if (!exist) {
    return res.status(400).json({error: 'Project does not exists'});
  }
  
  return next();
}

//Middleware Global - Contar requisicoes
server.use((req, res, next) => {

  totalReq++;
  console.log("Total de requisições: " + totalReq); 

  next();
});

//Cadastrar projeto
server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  const project = {"id": id, "title": title, "tasks": tasks};

  projects.push(project);

  return res.json(projects);
});

//Retorna a lista de projetos e suas tarefas
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Altara o Titulo do projeto
server.put("/projects/:id", checkIfProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(p => p.id === id).title = title;

  return res.json(projects);
});

//Deletar um Projeto
server.delete("/projects/:id", checkIfProjectExist, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);
  
  return res.send();
});

//Cadastra uma task no projeto
server.post("/projects/:id/tasks", checkIfProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(p => p.id === id).tasks.push(title);
  return res.json(projects);
});

server.listen(3000);