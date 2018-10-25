task management frontend web application that consumes data from an existing API. The app should allow the user
to view their tasks which further contain subtasks. These subtasks should be viewed as a checklist which the user can
check/uncheck to mark them as completed.
App features:
view the list of existing tasks separated in categories
view each task details
edit task details: name, description, priority, category and dueDate
view list of subtasks of a task
edit subtask's name and check/uncheck

You simple install the json-server library via the following npm command:
$ npm install -g json-server
and then start the server:
$ json-server --watch db.json
This should start the HTTP server on http://localhost:3000
