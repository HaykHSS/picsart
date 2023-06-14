window.addEventListener('load', () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");
  const counter_el = document.createElement('div');
  let completedTasks = 0;
  let totalTasks = 0;

  counter_el.id = 'task-counter';
  updateCounter();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = input.value;

    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: task })
    })
      .then(response => response.json())
      .then(data => {
        const task_el = createTaskElement(data);
        list_el.appendChild(task_el);
        totalTasks++;
        updateCounter();
        input.value = '';
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  });

  function createTaskElement(task) {
    const task_el = document.createElement('div');
    task_el.classList.add('task');

    const task_content_el = document.createElement('div');
    task_content_el.classList.add('content');

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement('input');
    task_input_el.classList.add('text');
    task_input_el.type = 'text';
    task_input_el.value = task.content;
    task_input_el.setAttribute('readonly', 'readonly');
    if (task.completed) {
      task_input_el.classList.add('completed');
      completedTasks++;
    }

    task_content_el.appendChild(task_input_el);

    const task_actions_el = document.createElement('div');
    task_actions_el.classList.add('actions');

    const task_edit_el = document.createElement('button');
    task_edit_el.classList.add('edit');
    task_edit_el.innerText = 'Edit';

    const task_delete_el = document.createElement('button');
    task_delete_el.classList.add('delete');
    task_delete_el.innerText = 'Delete';

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    task_input_el.addEventListener('click', (e) => {
      task_input_el.classList.toggle('completed');
      if (task_input_el.classList.contains('completed')) {
        updateTaskCompletionStatus(task._id, true);
        completedTasks++;
      } else {
        updateTaskCompletionStatus(task._id, false);
        completedTasks--;
      }
      updateCounter();
    });

    task_edit_el.addEventListener('click', (e) => {
      if (task_edit_el.innerText.toLowerCase() === "edit") {
        task_edit_el.innerText = "Save";
        task_input_el.removeAttribute("readonly");
        task_input_el.focus();
      } else {
        task_edit_el.innerText = "Edit";
        task_input_el.setAttribute("readonly", "readonly");
        updateTaskContent(task._id, task_input_el.value);
      }
    });

    task_delete_el.addEventListener('click', (e) => {
      deleteTask(task._id)
        .then(() => {
          list_el.removeChild(task_el);
          totalTasks--;
          if (task_input_el.classList.contains('completed')) {
            completedTasks--;
          }
          updateCounter();
        })
        .catch(error => {
          console.error('Error deleting task:', error);
        });
    });

    return task_el;
  }

  function updateTaskCompletionStatus(taskId, completed) {
    fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error updating task completion status:', error);
      });
  }

  function updateTaskContent(taskId, content) {
    fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error updating task content:', error);
      });
  }

  function deleteTask(taskId) {
    return fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  }

  function updateCounter() {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => {
        completedTasks = data.filter(task => task.completed).length;
        totalTasks = data.length;
        counter_el.innerText = `Completed: ${completedTasks} / Total: ${totalTasks}`;
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }

  const header = document.querySelector('header');
  header.appendChild(counter_el);

  // Fetch existing tasks on page load
  fetch('/tasks')
    .then(response => response.json())
    .then(data => {
      data.forEach(task => {
        const task_el = createTaskElement(task);
        list_el.appendChild(task_el);
      });
      updateCounter();
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
});

