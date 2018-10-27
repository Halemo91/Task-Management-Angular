Task management frontend web application that consumes data from an existing API.

App features:

- view the list of existing tasks separated in categories.

- view each task details.

- edit task details: name, description, priority, category and dueDate.

- view list of subtasks of a task.

- edit subtask's name and check/uncheck.

You simply install the json-server library via the following npm command:

$ npm install -g json-server

and then start the server:

$ json-server --watch db.json

This should start the HTTP server on http://localhost:3000
