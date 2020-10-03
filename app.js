const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send(`<h1>hello world!</h1>`);
});

const todoList = [
  {
    id: 1,
    todo: 'Implement a REST API',
  },
  {
    id: 2,
    todo: 'Build a frontend',
  },
  {
    id: 3,
    todo: '???',
  },
  {
    id: 4,
    todo: 'Profit!',
  },
];

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json(todoList);
});

// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  const todo = todoList.find(element => {
    if (element.id == id) {
      return true;
    }
    return false;
  });
  if (!todo) {
    res
      .status(404) // set status to 404 (not found)
      // send back an error
      .send(`<h1>No found : ${id}</h1>`);
    // if we did find a friend
  } else {
    // use the details to send back a page with their info
    res.send(`
      <h1>${todo.id}</h1>
      <h3>${todo.todo}</h3>
    `);
  }
});

// POST /api/todos
app.post('/api/todos', (req, res) => {
  if (!req.body.id || !req.body.todo) {
    res.status(422).json();
    return;
  }
  const todo = {
    id: req.body.id,
    todo: req.body.todo,
  };

  todoList.push(todo);

  res.status(201).json();
});

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  const todoIndex = todoList.findIndex(element => {
    if (element.id == id) {
      return true;
    }
    return false;
  });
  if (!req.body.todo) {
    res.status(422).json();
  } else {
    if (todoIndex === -1) {
      res.status(404).json();
    } else {
      const newtodo = todoList[todoIndex];
      newtodo.todo = req.body.todo;
      todoList.splice(todoIndex, 1, newtodo);

      res.status(202).json();
    }
  }
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  const todoIndex = todoList.findIndex(element => {
    if (element.id == id) {
      return true;
    }
    return false;
  });
  if (todoIndex === -1) {
    res.status(404).json();
  } else {
    todoList.splice(todoIndex, 1);

    res.status(202).json();
  }
});

server.listen(port, hostname, () => {
  // once server is listening, log to the console to say so
  console.log(`Server running at http://${hostname}:${port}/`);
});
