import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import AppContext from '../AppContext'
import PropTypes from 'prop-types'

export default class Note extends React.Component {
  static contextType = AppContext;

  handleDelete = () => {
    if (this.props.match.params.noteId) {
      this.context.onDeleteNote(this.props.id)
        .then(res => res.json())
        .then(() => this.props.history.push('/'))
        .then(() => this.context.updateNoteState(this.props.id))
    }
    else {
      this.context.onDeleteNote(this.props.id)
      .then(res => res.json())
      .then(() => this.context.updateNoteState(this.props.id))
    }
  }
  render() {
      return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${this.props.id}`}>
            {this.props.name}
          </Link>
        </h2>
        <button className='Note__delete' type='button' onClick={this.handleDelete}>
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(this.props.modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Note.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired
}