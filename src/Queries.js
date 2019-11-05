import React from 'react';

export const Query = (props) =>
    <input
        id='query-box'
        type='text'
        placeholder='query'
        onChange={props.handleChange}
    />;
export const SortForm = (props) =>
    <form>
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