import React from 'react';
import {Formik} from 'formik';
import './App.css';

const project = (name) => ({name, list: []});
const todo = (name, description, dueDate, priority) => ({name, description, dueDate, priority});

const ProjectDialogue = (props) =>
    <div className='veil'>
        <Formik
            initialValues={{name: props.name}}
            validate={values => values.name ? {} : {name: '^ name required'}}
            onSubmit={values => props.modifyProject(values.name)}
        >
            {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
              }) => (
                <form
                    className='form'
                    onSubmit={handleSubmit}
                >
                    <input
                        type='text'
                        name='name'
                        placeholder='Project name'
                        onChange={handleChange}
                        value={values.name}
                    />
                    {errors.name}
                    <button
                        type='submit'
                        className='submit'
                    >
                        Submit
                    </button>
                    <button
                        className='cancel'
                        onClick={props.handleCancel}
                    >
                        Cancel
                    </button>
                </form>
            )}
        </Formik>
    </div>;
ProjectDialogue.defaultProps = {name: ''};
const TodoDialogue = (props) =>
    <div className='veil'>
        <Formik
            initialValues={{
                name: props.name,
                description: props.description,
                dueDate: props.dueDate,
                priority: props.priority,
            }}
            validate={values => {
                const errors = {};
                if (!values.name) errors.name = '^ name required';
                if (!values.dueDate) errors.dueDate = '^ due date required';
                if (values.priority < 1 || values.priority > 5) errors.priority = '^ priority must be between 1 and 5';
                return errors;
            }}
            onSubmit={values => props.modifyTodo(values.name, values.description, values.dueDate, values.priority)}
        >
            {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
              }) => (
                <form
                    className='form'
                    onSubmit={handleSubmit}
                >
                    <input
                        type='text'
                        name='name'
                        placeholder='Name'
                        onChange={handleChange}
                        value={values.name}
                    />
                    {errors.name}
                    <textarea
                        name='description'
                        placeholder='Description'
                        onChange={handleChange}
                        value={values.description}
                    />
                    <input
                        type='date'
                        name='dueDate'
                        onChange={handleChange}
                        value={values.dueDate}
                    />
                    {errors.dueDate}
                    <input
                        type='number'
                        min={1}
                        max={5}
                        name='priority'
                        onChange={handleChange}
                        value={values.priority}
                    />
                    {errors.priority}
                    <button
                        type='submit'
                        className='submit'
                    >
                        Submit
                    </button>
                    <button
                        className='cancel'
                        onClick={props.handleCancel}
                    >
                        Cancel
                    </button>
                </form>
            )}
        </Formik>
    </div>;
TodoDialogue.defaultProps = {name: '', description: '', dueDate: '', priority: 3};

const ListProjects = (props) => props.projects.map((project, index) =>
    <Project
        active={project === props.activeProject}
        name={project.name}
        handleActiveClick={props.editProject}
        handleClick={props.handleSwitchProject(project)}
        index={index}
    />);
const Project = (props) => props.active ?
    <li
        className='active'
        onClick={props.handleActiveClick}
        key={(Date.now() + props.index).toString(36)}
    >
        {props.name}
    </li>
    : <li
        onClick={props.handleClick}
        key={(Date.now() + props.index).toString(36)}
    >
        {props.name}
    </li>;
const ProjectAdder = (props) =>
    <li
        id='new-project'
        onClick={props.handleClick}
        key={(Date.now() - 1).toString(36)}
    >
        + project
    </li>;

const ListTodos = (props) => props.todos.map((todo, index) =>
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
const TodoAdder = (props) =>
    <li
        className='todo priority-5'
        onClick={props.handleClick}
        key={(Date.now() - 1).toString(36)}
    >
        + todo
    </li>;

const App = () => {
    const [projects, setProjects] = React.useState([project('Default')]);
    const [activeProject, setActiveProject] = React.useState(null);
    const [editingProject, setEditingProject] = React.useState(false);
    const [projectDialogue, setProjectDialogue] = React.useState(false);
    const [todoUnderEdit, setTodoUnderEdit] = React.useState(null);
    const [todoDialogue, setTodoDialogue] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const toggleProjectDialogue = () => setProjectDialogue(!projectDialogue);
    const toggleTodoDialogue = () => setTodoDialogue(!todoDialogue);

    const editProject = () => setEditingProject(true);
    const cancelEditProject = () => setEditingProject(false);
    const addProject = (name) => {
        const newProjects = projects.slice();
        newProjects.push(project(name));
        setProjects(newProjects);
        toggleProjectDialogue();
    };
    const updateProject = (name) => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        newProject.name = name;
        setProjects(newProjects);
        cancelEditProject();
    };
    const handleSwitchProject = project => () => setActiveProject(project);

    const handleEditTodo = todo => () => setTodoUnderEdit(todo);
    const cancelEditTodo = () => setTodoUnderEdit(null);
    const addTodo = (name, description, dueDate, priority) => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        newProject.list.unshift(todo(name, description, dueDate, priority));
        setProjects(newProjects);
        setActiveProject(newProject);
        toggleTodoDialogue();
    };
    const updateTodo = (name, description, dueDate, priority) => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        const todoIndex = newProject.list.findIndex(todo => todo === todoUnderEdit);
        newProject.list[todoIndex] = todo(name, description, dueDate, priority);
        setProjects(newProjects);
        setActiveProject(newProject);
        cancelEditTodo();
    };
    const handleDeleteTodo = todo => () => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        newProject.list.splice(newProject.list.findIndex(item => item === todo), 1);
        setProjects(newProjects);
        setActiveProject(newProject);
        cancelEditTodo();
    };

    const handleQueryChange = (event) => setQuery(event.target.value);
    const filterTodos = () => {
        const lowerCaseQuery = query.toLowerCase();
        return activeProject.list.filter(todo =>
            todo.name.toLowerCase().includes(lowerCaseQuery)
            || todo.description.toLowerCase().includes(lowerCaseQuery));
    };

    return (
        <>
            <header>
                <div id='app-name'>To-do</div>
                <nav>
                    <ul>
                        <ListProjects
                            activeProject={activeProject}
                            projects={projects}
                            editProject={editProject}
                            handleSwitchProject={handleSwitchProject}
                        />
                        <ProjectAdder handleClick={toggleProjectDialogue}/>
                    </ul>
                </nav>
            </header>
            <main>
                <input
                    className='query-box'
                    type='text'
                    placeholder='query'
                    onChange={handleQueryChange}
                />
                <ul>
                    {activeProject
                    && (query ?
                        <ListTodos
                            todos={filterTodos()}
                            handleEditTodo={handleEditTodo}
                            handleDeleteTodo={handleDeleteTodo}
                        />
                        : <ListTodos
                            todos={activeProject.list}
                            handleEditTodo={handleEditTodo}
                            handleDeleteTodo={handleDeleteTodo}
                        />)}
                    {activeProject && !query && <TodoAdder handleClick={toggleTodoDialogue}/>}
                </ul>
            </main>
            {projectDialogue && <ProjectDialogue
                modifyProject={addProject}
                handleCancel={toggleProjectDialogue}
            />}
            {editingProject && <ProjectDialogue
                name={activeProject.name}
                modifyProject={updateProject}
                handleCancel={cancelEditProject}
            />}
            {todoDialogue && <TodoDialogue
                modifyTodo={addTodo}
                handleCancel={toggleTodoDialogue}
            />}
            {todoUnderEdit && <TodoDialogue
                name={todoUnderEdit.name}
                description={todoUnderEdit.description}
                dueDate={todoUnderEdit.dueDate}
                priority={todoUnderEdit.priority}
                modifyTodo={updateTodo}
                handleCancel={cancelEditTodo}
            />}
        </>
    );
};

export default App;
