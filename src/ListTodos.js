import React from 'react';

export const ListTodos = (props) => props.todos.map((todo, index) =>
    <Todo
        name={todo.name}
        description={todo.description}
        dueDate={todo.dueDate}
        priority={todo.priority}
        handleClick={props.handleEditTodo(todo)}
        handleDelete={props.handleDeleteTodo(todo)}
        index={index}
    />);
const Todo = (props) =>
    <li
        className={'todo priority-' + props.priority}
        key={(Date.now() + props.index).toString(36)}
    >
        <div className='delete' onClick={props.handleDelete}/>
        <div
            className='todo-body'
            onClick={props.handleClick}
        >
            <div className='name'>{props.name}</div>
            <div className='description'>{props.description}</div>
            <div className='due-date'>{props.dueDate}</div>
        </div>
    </li>;
export const TodoAdder = (props) =>
    <li
        className='todo priority-5'
        onClick={props.handleClick}
        key={(Date.now() - 1).toString(36)}
    >
        + todo
    </li>;