import React from 'react';
import './App.css';

const NewProjectPopup = (props) => {
    return (
        <div className='veil'>
            <form className='form'>
                <input
                    type='text'
                    placeholder='Project name'
                    required={true}
                    onChange={props.handleNewProjectNameChange}
                    value={props.newProjectName}
                />
                <button
                    type='submit'
                    className='submit'
                    onClick={props.handleCreateNewProject}
                >
                    Submit
                </button>
                <button
                    className='cancel'
                    onClick={props.handleCancelNewProject}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

const App = () => {
    const [newProjectPopup, setNewProjectPopup] = React.useState(false);
    const [input, setInput] = React.useState({newProjectName: ''});
    const [projects, setProjects] = React.useState([]);

    const handleNewProject = () => {
        setNewProjectPopup(true);
    };
    const handleNewProjectNameChange = (event) => setInput({newProjectName: event.target.value});
    const handleCreateNewProject = () => {
        const newProjects = projects.slice();
        newProjects.push(
            {
                name: input.newProjectName,
                list: [],
            });
        setProjects(newProjects);
        setNewProjectPopup(false);
        setInput({newProjectName: ''});
    };
    const handleCancelNewProject = () => {
        setNewProjectPopup(false);
    };

    return (
        <>
            <header>
                <div id='app-name'>To-do</div>
                <nav>
                    <ul>
                        {projects.map(project => <li key={Date.now().toString(36)}>{project.name}</li>)}
                        <li id='new-project' onClick={handleNewProject}>+ project</li>
                    </ul>
                </nav>
            </header>
            {newProjectPopup && <NewProjectPopup
                newProjectName={input.newProjectName}
                handleNewProjectNameChange={handleNewProjectNameChange}
                handleCreateNewProject={handleCreateNewProject}
                handleCancelNewProject={handleCancelNewProject}
            />}
        </>
    );
};

export default App;
