import React, { Component } from 'react'
import ValidationError from '../ValidationError/ValidationError'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddNote.css';
import AppContext from '../AppContext';

export default class AddNote extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      noteName: '',
      content: '',
      folderId: '',
      noteNameValid: false,
      folderValid: false,
      formValid: false,
      validationMessage: {
        name: '',
        folder: ''
      }
    }
  }

  updateNoteName = (noteName) => {
    this.setState ({noteName}, () => this.validateNoteName(noteName));
  }
  validateNoteName(noteName) {
    // non-empty
    // min-length = 3 
    // regex for web safe characters ^[a-zA-Z0-9_-]*$
    let message = this.state.validationMessage.name;
    let hasError = false;

    noteName = noteName.trim();
    if(noteName.length === 0) {
      message = 'Must provide a Note Name';
      hasError = true;
    } else {
      if(noteName.length < 3) {
        message = 'Note name must be at least 3 characters long';
        hasError = true;
      } else {
        if (!noteName.match(new RegExp(/^([a-zA-Z0-9_-])*$/))) {
          message = 'Note name must use alphanumeric characters only'
          hasError = true;
        } else {
          message = '';
          hasError = false;
        }
      }
    }
    this.setState({
      noteNameValid: !hasError,
      validationMessage: {...this.state.validationMessage, name: message}
    }, () => this.formValid())
  }

  updateContent = (content) => {
    this.setState ({content}, () => console.log('content updated'));
  }
  
  updateFolderId = (folderId) => {
    console.log(folderId, 'updateFolderId')
    this.setState ({folderId}, () => this.validateFolderId(folderId));
  }
  validateFolderId(folderId) {
    // non-empty
    // min-length = 3 
    // regex for web safe characters ^[a-zA-Z0-9_-]*$
    let message = this.state.validationMessage.folder;
    let hasError = false;
    console.log(folderId, 'folderId')
    if(folderId === null || folderId === "...") {
      message = 'Must choose an existing folder';
      hasError = true;
    }
    this.setState({
      folderValid: !hasError,
      validationMessage: {...this.state.validationMessage, folder: message}
    }, () => this.formValid())
  }

  addNoteApi = (newNote) => {
    console.log('made it here')
    console.log(newNote)
    const BASEURL = "https://evening-dawn-21463.herokuapp.com/api";
    fetch(BASEURL + '/notes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote)
    })
    .then(async (res)=> {
      const note = await res.json();
      console.log(note, 'note')
      this.props.history.push('/')
      this.context.onAddNote(note);
    })
      .catch(err => {
        console.log(err, 'err')
        this.context.onError(err)
      })
  }

  handleAddNote = (e) => {
    console.log('did we make it?')
    e.preventDefault();
    console.log(this.state)
    const newNote = {
      name: this.state.noteName,
      modified: "2019-01-03T00:00:00.000Z",
      folder_id: this.state.folderId,
      content: this.state.content
    }  
    console.log(newNote, 'newNote')
    // grab input
    this.addNoteApi(newNote);
    
    // this.props.history.push('/');
  }

  formValid() {
    console.log(this.state, 'state')
    this.setState({
      formValid: true || this.state.noteNameValid && this.state.folderValid
    });
  }

  render() {
    const { folders } = this.context;

    console.log(this.state.formValid, 'this.state.formValid');

  

    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={e => this.handleAddNote(e)}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' required onChange={ e => this.updateNoteName(e.target.value)}/>
          </div>
          <ValidationError hasError={!this.state.noteNameValid} message={this.state.validationMessage.name}/>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' required onChange={ e => this.updateContent(e.target.value)}/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select required id='note-folder-select' name='note-folder-id' onChange={e => this.updateFolderId(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <ValidationError hasError={!this.state.folderValid} message={this.state.validationMessage.folder}/>
          <div className='buttons'>
            <button type='submit' >
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
//disabled={!this.state.formValid}