import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import AppContext from '../AppContext';
import './App.css'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

class App extends Component {
  state = {
    notes: [],
    folders: [],
    error: null,
  };

  async componentDidMount() {
    const BASEURL = "https://evening-dawn-21463.herokuapp.com/";
    const [folderRes, notesRes] = [await fetch(BASEURL+'/folders'), await fetch(BASEURL+'/notes')]

    try {
      const folders = await folderRes.json()
      const notes = await notesRes.json()
      
      this.setState({
        folders,
        notes,
        error: null
      })
    } catch(err) {
      this.setState({error: err.message})
    }

    // Promise.all([getFolders, getNotes])
    //   .then(resArr => {
    //     return Promise.all(resArr.map(res => {
    //       if (!res.ok) throw new Error("Something went horribly wrong :(")
    //       return res.json()
    //     }))
    //   })
    //   .then(data => {
    //     console.log(data);
    //     this.setState({
    //       folders: data[0],
    //       notes: data[1],
    //       error: null
    //     })
    //   })
    //   .catch(err => this.setState({error: err.message}))
  }

  onError = (error) => {
    this.setState({error})
  }

  onDeleteNote = (noteId) => {
    const BASEURL = "https://evening-dawn-21463.herokuapp.com/";
    return fetch(BASEURL+`/notes/${noteId}`, {method: "DELETE"})
  }

  updateNoteState = (noteId) => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    })
  }

  genRandomId = () => {
    return Math.random().toString(36).substr(2,9)
  }

  onAddFolder = (newFolder) => {
    this.setState({
      folders: [...this.state.folders, newFolder]
    })
  }

  onAddNote = (newNote) => {
    this.setState({notes: [...this.state.notes, newNote]})
  }

  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route exact key={path} path={path} component={NoteListNav}/>
        )}
        <Route path='/note/:noteId' component={NotePageNav}/>
        <Route path='/add-folder' component={NotePageNav}/>
        <Route path='/add-note' component={NotePageNav}/>
      </>
    )
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route exact key={path} path={path} component={NoteListMain}/>
        )}
        <Route path='/note/:noteId' component={NotePageMain} />
        <Route path='/add-folder' component={AddFolder} />
        <Route path='/add-note' component={AddNote} />
      </>
    )
  }

  render() {
    return (
      <AppContext.Provider value={{
        folders: this.state.folders,
        notes: this.state.notes,
        onDeleteNote: this.onDeleteNote,
        updateNoteState: this.updateNoteState,
        onAddFolder: this.onAddFolder,
        onAddNote: this.onAddNote,
        genRandomId: this.genRandomId,
        onError: this.onError
      }}>
        <div className='App'>
          <ErrorBoundary>
            <nav className='App__nav'>
              {this.renderNavRoutes()}
            </nav>
          </ErrorBoundary>
          <header className='App__header'>
            <h1>
              <Link to='/'>Noteful</Link>
              {' '}
              <FontAwesomeIcon icon='check-double' />
            </h1>
          </header>
          <ErrorBoundary>
            <main className='App__main'>
              {this.renderMainRoutes()}
            </main>
          </ErrorBoundary>
        </div>
      </AppContext.Provider>
    )
  }
}

export default App