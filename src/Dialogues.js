import {Formik} from 'formik';
import React from 'react';

export const ProjectDialogue = (props) =>
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
export const TodoDialogue = (props) =>
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