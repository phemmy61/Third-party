// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const formattedDueDate = task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : 'No Due Date';

  return `
    <div class="task-card" data-task-id="${task.id}" draggable="true">
      <h4>${task.title}</h4>
      <p>Status: ${task.status}</p>
      <p>Description: ${task.description || 'No description'}</p>
      <p>Due Date: ${formattedDueDate}</p>
      <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    </div>
  `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);

    $(`#${task.status}-cards`).append(taskCard);

    $(`[data-task-id="${task.id}"]`).draggable({
      helper: 'clone',
      revert: 'invalid',
    });

    $(`[data-task-id="${task.id}"] .delete-btn`).on('click', handleDeleteTask);
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const newTask = {
    id: generateTaskId(),
    title: $("#taskTitle").val(),
    description: $("#taskDescription").val(),
    status: "todo",
    dueDate: $("#dueDate").val(),
  };

  taskList.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  renderTaskList();

  // Close the modal after adding a task
  $("#formModal").modal("hide");
  // Clear the form fields
  $("#taskTitle, #taskDescription, #dueDate").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest('.task-card').data('task-id');

  taskList = taskList.filter(task => task.id !== taskId);

  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.helper.data('task-id');
  const newStatus = event.target.id;

  const droppedTask = taskList.find(task => task.id === taskId);
  droppedTask.status = newStatus;

  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $("#taskForm").submit(handleAddTask);

  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });
});
