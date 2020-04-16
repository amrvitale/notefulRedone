import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import './NoteListMain.css';
import AppContext from '../AppContext';
import { getNotesForFolder } from '../notes-helpers';

export default class NoteListMain extends React.Component {
  static contextType = AppContext;

  render () {
    const { folderId } = this.props.match.params
    const notesForFolder = getNotesForFolder(this.context.notes, folderId)

    return (
      <section className='NoteListMain'>
        <ul>
          {notesForFolder.map(note =>
            <li key={note.id}>
              <Note
                match={this.props.match}
                id={note.id}
                name={note.name}
                modified={note.modified}
              />
            </li>
          )}
        </ul>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to='/add-note'
            type='button'
            className='NoteListMain__add-note-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Note
          </CircleButton>
        </div>
      </section>
    )
  }
}

NoteListMain.defaultProps = {
  notes: [],
}