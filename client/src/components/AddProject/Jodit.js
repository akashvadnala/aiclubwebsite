import React, { useRef, useState, useMemo } from 'react'
import JoditEditor from 'jodit-react';

const Jodit = ({editor, value, config, onChange }) => {

    return useMemo( () => ( 
        <JoditEditor ref={editor} value={value} config={config} onChange={onChange} /> 
    ), [] )
}

export default Jodit;
