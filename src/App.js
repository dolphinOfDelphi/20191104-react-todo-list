import React from 'react';
import {Formik} from 'formik';
import './App.css';

const project = (name) => ({name, list: []});

const NewProjectPopup = (props) =>
    <div className='veil'>
        <Formik
            initialValues={{name: ''}}
            validate={values => values.name ? {} : {name: '^name required'}}
            onSubmit={values => props.addProject(values.name)}
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

const Project = (props) => props.active ?
    <li
        className='active'
        onClick={props.handleClick}
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

const App = () => {
    const [projects, setProjects] = React.useState([project('Default')]);
    const [activeProject, setActiveProject] = React.useState(null);
    const [projectDialogue, setProjectDialogue] = React.useState(false);

    const toggleProjectDialogue = () => setProjectDialogue(!projectDialogue);
    const addProject = (name) => {
        const newProjects = projects.slice();
        newProjects.push(project(name));
        setProjects(newProjects);
        toggleProjectDialogue();
    };

    const switchProject = project => () => setActiveProject(project);

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
                                handleClick={switchProject(project)}
                                index={index}/>)
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
            {projectDialogue && <NewProjectPopup
                addProject={addProject}
                handleCancel={toggleProjectDialogue}
            />}
        </>
    );
};

export default App;
