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

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('home', {
    locals: {
      todoList: todoList,
    },
  });
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

app.post('/todos', (req, res) => {
  res.send('POST');
});

// GET /api/todos
app.get('/todos', (req, res) => {
  res.json(todoList);
});

// GET /api/todos/:id
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todoList.find(element => {
    if (element.id == id) {
      return true;
    }
    return false;
  });

  if (!todo) {
    res.status(404).send(`<h1>No found : ${id}</home>`);
  } else {
    res.render('todoList', {
      locals: {
        id: id,
        todo: todo,
      },
    });
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
