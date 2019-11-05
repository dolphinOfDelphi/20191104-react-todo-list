import React from 'react';

export const ListProjects = (props) => props.projects.map((project, index) =>
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
export const ProjectAdder = (props) =>
    <li
        id='new-project'
        onClick={props.handleClick}
        key={(Date.now() - 1).toString(36)}
    >
        + project
    </li>;