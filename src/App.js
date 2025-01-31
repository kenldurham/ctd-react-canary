import React from "react";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import style from "./MyStyle.module.css"
//import Media from "react-media"
//console.log(localStorage);
//React.useEffect(() => {
//setTodoList(JSON.parse(localStorage.getItem("savedTodoList")));
//}, []);

console.log(process.env);
function App() {
  const [todoList, setTodoList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    fetch(
      `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Default?sort%5B0%5D%5Bfield%5D=Created&sort%5B0%5D%5Bdirection%5D=asc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.records);
        setTodoList(result.records);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("savedTodoList", JSON.stringify(todoList));
    }
  }, [todoList, isLoading]);
  const addTodo = (newTodo) => {
    setTodoList([...todoList, newTodo]);
  };
  const removeTodo = (id) => {
    const newTodo = todoList.filter((item) => {
      return item.id !== id;
    });
    setTodoList(newTodo);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={
            <>
            <div className={style.myFlex}>
            <h1>Todo List</h1>
            {isLoading ? <p>Loading...</p> : [TodoList]}
            <TodoList onRemoveTodo={removeTodo} todoList={todoList} />
            <AddTodoForm onAddTodo={addTodo} />
            <p></p>
            </div>
            </>
          } ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
