import React from 'react'

const NoteContext = React.createContext({
    deleteNote: () => {},
    addFolder: ()=>{},
    addNotes: ()=>{}
})

export default NoteContext;