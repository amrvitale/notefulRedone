import React, { Component } from 'react'
import ValidationError from '../ValidationError/ValidationError'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddFolder.css'
import AppContext from '../AppContext'


export default class AddFolder extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      folderName: '',
      folderNameValid: false,
      validationMessage: ''
    }
  }

  updateFolderName = (folderName) => {
    this.setState ({folderName}, () => this.validateFolderName(folderName));
  }

  validateFolderName(folderName) {
    // non-empty
    // min-length = 3 
    // regex for web safe characters ^[a-zA-Z0-9_-]*$
    let message = this.state.validationMessage;
    let hasError = false;

    folderName = folderName.trim();
    if(folderName.length === 0) {
      message = 'Must provide a Folder Name';
      hasError = true;
    } else {
      if(folderName.length < 3) {
        message = 'Folder name must be at least 3 characters long';
        hasError = true;
      } else {
        if (!folderName.match(new RegExp(/^([a-zA-Z0-9_-])*$/))) {
          message = 'Folder name must use alphanumeric characters only'
          hasError = true;
        } else {
          message = '';
          hasError = false;
        }
      }
    }
    this.setState({
      folderNameValid: !hasError,
      validationMessage: message
    })
  }

  addFolderApi = (newFolder) => {
    const BASEURL = "http://localhost:9090";
    fetch(BASEURL + '/folders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newFolder)
    })
      .then(() => this.props.history.push('/'))
      .catch(err => this.context.onError(err))
  }

  handleAddFolder = (e) => {
    e.preventDefault();
    const newFolder = {
      id: this.context.genRandomId(),
      name: this.state.folderName
      
    }  
    // grab input
    this.addFolderApi(newFolder);
    this.context.onAddFolder(newFolder)
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={e => this.handleAddFolder(e)}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' onChange={ e => this.updateFolderName(e.target.value)}/>
          </div>
          <ValidationError hasError={!this.state.folderNameValid} message={this.state.validationMessage}/>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.folderNameValid}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}