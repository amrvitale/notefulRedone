import React, { Component } from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import { findNote } from '../notes-helpers';
import AppContext from '../AppContext'

export default class NotePageMain extends Component {
  static contextType = AppContext;

  render() {
    console.log(this.props, 'props')
    const { noteId } = this.props.match.params
    let noteInfo = findNote(this.context.notes, noteId)
    console.log(this.context)
    console.log(this.note, 'note')
    console.log(noteInfo, 'noteInfo', noteId, 'noteId')
    return (
      <section className='NotePageMain'>
        <Note
          id={noteId}
          name={noteInfo.name}
          modified={noteInfo.modified}
          onDelete={() => this.props.history.push('/')}
          match={this.props.match}
          
        />
        <div className='NotePageMain__content'>
          {noteInfo.content && noteInfo.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
      </section>
    )
  }
}


NotePageMain.defaultProps = {
    note: {
      content: '',
    }

}