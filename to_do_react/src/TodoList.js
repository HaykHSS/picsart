import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
  margin-left: 10px;
  background-color: #ca3e47;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TaskName = styled.span`
  flex-grow: 1;
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  color: ${({ completed }) => (completed ? "#888" : "#333")};
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
`;

const CompleteButton = styled(Button)`
  background-color: #4caf50;
  padding: 8px 12px;
`;

const CountText = styled.p`
  font-size: 14px;
  margin-top: 10px;
  color: #888;
`;

const AppContainer = styled.div`
  background-color: #5b5b9d;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), name: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const countCompletedTasks = () => {
    return tasks.filter((task) => task.completed).length;
  };

  return (
    <AppContainer>
      <AppContent>
        <Container>
          <Title>To-Do List</Title>
          <Input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            placeholder="Enter a task"
          />
          <Button onClick={handleAddTask}>Add Task</Button>
          <TaskList>
            {tasks.map((task) => (
              <TaskItem key={task.id}>
                <TaskName completed={task.completed}>{task.name}</TaskName>
                <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </DeleteButton>
                <CompleteButton onClick={() => handleTaskCompletion(task.id)}>
                  {task.completed ? "Incomplete" : "Complete"}
                </CompleteButton>
              </TaskItem>
            ))}
          </TaskList>
          <CountText>
            Completed tasks: {countCompletedTasks()} / {tasks.length}
          </CountText>
        </Container>    
      </AppContent>
    </AppContainer>
  );
}

export default TodoList;
