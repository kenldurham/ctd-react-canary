import React from "react";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import style from "./MyStyle.module.css"
import Airtable from "airtable"
//import Media from "react-media"
//console.log(localStorage);
//React.useEffect(() => {
//setTodoList(JSON.parse(localStorage.getItem("savedTodoList")));
//}, []);

console.log(process.env);
const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
  const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
  const base = new Airtable({ apiKey: apiKey }).base(baseId);

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
    
    base('Default').create([
      newTodo
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
      setTodoList([...todoList, records[0]]);
    });
  };
  const removeTodo = (id) => {
    base('Default').destroy([id], function(err, deletedRecords) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Deleted', deletedRecords.length, 'records');
    });
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
