import React from 'react';
import {Formik} from 'formik';
import './App.css';

const project = (name) => ({name, list: []});
const todo = (name, description, dueDate, priority) => ({name, description, dueDate, priority});

const SortForm = (props) => <form>
    <input
        id='name'
        className='sort'
        type='radio'
        name='sort-by'
        value='name'
        checked={props.sortBy === 'name'}
        onChange={props.handleChange}
    />
    <label
        className='sort'
        htmlFor='name'
    >
        Name
    </label>
    <input
        id='due-date'
        className='sort'
        type='radio'
        name='sort-by'
        value='dueDate'
        checked={props.sortBy === 'dueDate'}
        onChange={props.handleChange}
    />
    <label
        className='sort'
        htmlFor='due-date'
    >
        Due Date
    </label>
    <input
        id='priority'
        className='sort'
        type='radio'
        name='sort-by'
        value='priority'
        checked={props.sortBy === 'priority'}
        onChange={props.handleChange}
    />
    <label
        className='sort'
        htmlFor='priority'
    >
        Priority
    </label>
</form>;
const Query = (props) => <input
    id='query-box'
    type='text'
    placeholder='query'
    onChange={props.handleChange}
/>;

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

const App = () => {
    const [projects, setProjects] = React.useState([]);
    const [activeProject, setActiveProject] = React.useState(null);
    const [editingProject, setEditingProject] = React.useState(false);
    const [projectDialogue, setProjectDialogue] = React.useState(false);
    const [todoUnderEdit, setTodoUnderEdit] = React.useState(null);
    const [todoDialogue, setTodoDialogue] = React.useState(false);
    const [sortBy, setSortBy] = React.useState('name');
    const [query, setQuery] = React.useState('');

    const handleSortChange = (event) => setSortBy(event.target.value);
    const handleQueryChange = (event) => setQuery(event.target.value);
    const filterTodos = () => {
        const lowerCaseQuery = query.toLowerCase();
        return activeProject.list.filter(todo =>
            todo.name.toLowerCase().includes(lowerCaseQuery)
            || todo.description.toLowerCase().includes(lowerCaseQuery));
    };

    const update = (newProjects, newActiveProject) => {
        setProjects(newProjects);
        setActiveProject(newActiveProject);
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const editProject = () => setEditingProject(true);
    const cancelEditProject = () => setEditingProject(false);
    const addProject = (name) => {
        const newProjects = projects.slice();
        const newProject = project(name);
        newProjects.push(newProject);
        update(newProjects, newProject);
        toggleProjectDialogue();
    };
    const updateProject = (name) => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        newProject.name = name;
        update(newProjects, newProject);
        cancelEditProject();
    };
    const handleSwitchProject = project => () => setActiveProject(project);
    const deleteProject = () => {
        const newProjects = projects.slice();
        newProjects.splice(newProjects.indexOf(activeProject), 1);
        update(newProjects, null);
    };

    const handleEditTodo = todo => () => setTodoUnderEdit(todo);
    const cancelEditTodo = () => setTodoUnderEdit(null);
    const addTodo = (name, description, dueDate, priority) => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        newProject.list.unshift(todo(name, description, dueDate, priority));
        update(newProjects, newProject);
        toggleTodoDialogue();
    };
    const updateTodo = (name, description, dueDate, priority) => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        const todoIndex = newProject.list.indexOf(todoUnderEdit);
        newProject.list[todoIndex] = todo(name, description, dueDate, priority);
        update(newProjects, newProject);
        cancelEditTodo();
    };
    const handleDeleteTodo = todo => () => {
        const newProjects = projects.slice();
        const newProject = newProjects.find(project => project === activeProject);
        newProject.list.splice(newProject.list.indexOf(todo), 1);
        update(newProjects, newProject);
        cancelEditTodo();
    };

    const toggleProjectDialogue = () => setProjectDialogue(!projectDialogue);
    const toggleTodoDialogue = () => setTodoDialogue(!todoDialogue);

    React.useEffect(() => {
        setProjects(JSON.parse(localStorage.getItem('projects')) || [project('Default')]);
    }, []);

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
                <div id='queries'>
                    <SortForm
                        sortBy={sortBy}
                        handleChange={handleSortChange}
                    />
                    <Query handleChange={handleQueryChange}/>
                </div>
                <ul>
                    {activeProject
                    && (query ?
                        <ListTodos
                            todos={filterTodos().sort((a, b) => a[sortBy] < b[sortBy] ? -1 : 1)}
                            handleEditTodo={handleEditTodo}
                            handleDeleteTodo={handleDeleteTodo}
                        />
                        : <ListTodos
                            todos={activeProject.list.sort((a, b) => a[sortBy] < b[sortBy] ? -1 : 1)}
                            handleEditTodo={handleEditTodo}
                            handleDeleteTodo={handleDeleteTodo}
                        />)}
                    {activeProject && !query && <TodoAdder handleClick={toggleTodoDialogue}/>}
                </ul>
                {activeProject
                && !query
                && <button
                    id='delete-project'
                    onClick={deleteProject}
                >
                    Delete project
                </button>}
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
