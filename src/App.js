import React from 'react';
import './App.css';
import {Query, SortForm} from './Queries';
import {ListProjects, ProjectAdder} from './ListProjects';
import {ListTodos, TodoAdder} from './ListTodos';
import {ProjectDialogue, TodoDialogue} from './Dialogues';

const project = (name) => ({name, list: []});
const todo = (name, description, dueDate, priority) => ({name, description, dueDate, priority});

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
