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
            initialValues={{name: props.name, description: props.description, dueDate: props.dueDate, priority: props.priority}}
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
const Todo = (props) =>
    <li
        className={'todo priority-' + props.priority}
        onClick={props.handleClick}
        key={(Date.now() + props.index).toString(36)}
    >
        <div className='name'>{props.name}</div>
        <div className='description'>{props.description}</div>
        <div className='due-date'>{props.dueDate}</div>
    </li>;

const App = () => {
    const [projects, setProjects] = React.useState([project('Default')]);
    const [activeProject, setActiveProject] = React.useState(null);
    const [editingProject, setEditingProject] = React.useState(false);
    const [todoUnderEdit, setTodoUnderEdit] = React.useState(null);
    const [projectDialogue, setProjectDialogue] = React.useState(false);
    const [todoDialogue, setTodoDialogue] = React.useState(false);

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
    const switchProject = project => () => setActiveProject(project);

    const editTodo = todo => () => setTodoUnderEdit(todo);
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

    return (
        <>
            <header>
                <div id='app-name'>To-do</div>
                <nav>
                    <ul>
                        {projects.map((project, index) =>
                            <Project
                                active={project === activeProject}
                                name={project.name}
                                handleActiveClick={editProject}
                                handleClick={switchProject(project)}
                                index={index}
                            />)
                        }
                        <li
                            id='new-project'
                            onClick={toggleProjectDialogue}
                            key={(Date.now() - 1).toString(36)}
                        >
                            + project
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <ul>
                    {activeProject && activeProject.list.map((todo, index) =>
                        <Todo
                            name={todo.name}
                            description={todo.description}
                            dueDate={todo.dueDate}
                            priority={todo.priority}
                            handleClick={editTodo(todo)}
                            index={index}
                        />)
                    }
                    {activeProject && <li
                        className='todo priority-5'
                        onClick={toggleTodoDialogue}
                        key={(Date.now() - 1).toString(36)}
                    >
                        + todo
                    </li>}
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
