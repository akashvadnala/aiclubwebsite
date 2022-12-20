import React, { useRef, useState, useMemo } from 'react';
import './AddProject.css';
import Jodit from './Jodit';
import JoditEditor from 'jodit-react';

const AddProject = () => {
  const editor = useRef(null);

    
  const copyStringToClipboard = function(str) {
      var el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    };
    
    const facilityMergeFields = [
      "FacilityNumber",
      "FacilityName",
      "Address",
      "MapCategory",
      "Latitude",
      "Longitude",
      "ReceivingPlant",
      "TrunkLine",
      "SiteElevation"
    ];
    const inspectionMergeFields = [
      "InspectionCompleteDate",
      "InspectionEventType"
    ];
    const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
      let optionGroupElement = document.createElement("optgroup");
      optionGroupElement.setAttribute("label", optionGrouplabel);
      for (let index = 0; index < mergeFields.length; index++) {
        let optionElement = document.createElement("option");
        optionElement.setAttribute("class", "merge-field-select-option");
        optionElement.setAttribute("value", mergeFields[index]);
        optionElement.text = mergeFields[index];
        optionGroupElement.appendChild(optionElement);
      }
      return optionGroupElement;
    }
    const buttons = [
      "undo",
      "redo",
      "|",
      "bold",
      "strikethrough",
      "underline",
      "italic",
      "|",
      "superscript",
      "subscript",
      "|",
      "align",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "link",
      "table",
      "|",
      "hr",
      "eraser",
      "copyformat",
      "|",
      "fullsize",
      "selectall",
      "print",
      "|",
      "source",
      "|",
      {
        name: "insertMergeField",
        tooltip: "Insert Merge Field",
        iconURL: "images/merge.png",
        popup: (editor, current, self, close) => {
          function onSelected(e) {
            let mergeField = e.target.value;
            if (mergeField) {
              console.log(mergeField);
              editor.selection.insertNode(
                editor.create.inside.fromHTML("{{" + mergeField + "}}")
              );
            }
          }
          let divElement = editor.create.div("merge-field-popup");
    
          let labelElement = document.createElement("label");
          labelElement.setAttribute("class", "merge-field-label");
          labelElement.text = 'Merge field: ';
          divElement.appendChild(labelElement);
    
          let selectElement = document.createElement("select");
          selectElement.setAttribute("class", "merge-field-select");
          selectElement.appendChild(createOptionGroupElement(facilityMergeFields, "Facility"));
          selectElement.appendChild(createOptionGroupElement(inspectionMergeFields, "Inspection"));
          selectElement.onchange = onSelected;
          divElement.appendChild(selectElement);
    
          console.log(divElement);
          return divElement;
        }
      },
      {
        name: "copyContent",
        tooltip: "Copy HTML to Clipboard",
        iconURL: "images/copy.png",
        exec: function(editor) {
          let html = editor.value;
          copyStringToClipboard(html);
        }
      }
    ];
    
    const editorConfig = {
      readonly: false,
      toolbar: true,
      spellcheck: true,
      language: "en",
      toolbarButtonSize: "medium",
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: true,
      askBeforePasteFromWord: true,
      //defaultActionOnPaste: "insert_clear_html",
      buttons: buttons,
      uploader: {
        insertImageAsBase64URI: true
      },
      // width: 800,
      height: 450
  };
  let name,value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setProj({...proj, [name]:value});
  }
  const [ add, setAdd ] = useState('Submit');
  const [ add2, setAdd2 ] =useState();
  const [ proj, setProj ] = useState({
    'title':'',
    'content':''
  })
  const PostProject = () => {
    setAdd('Submitting ');
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);
  }
  return (
    <>
        <div className='addproject-container'>
            <div className='adjust'>
              <h3>Add Project</h3>
              <form method="POST" onSubmit={PostProject} encType="multipart/form-data">
                <div className="form-group my-3 row">
                  <label for="title" className='col-sm-2 text-end'>Project Title :</label>
                  <div className='col-sm-10'>
                      <input type='text' name="title" value={proj.title} onChange={handleInputs} className="form-control" id="title" aria-describedby="title" placeholder="Enter Project Title" required/>
                  </div>
                </div>
                <div className="form-group my-3 row">
                  <label for="content" className='col-sm-2 text-end'>Project Content :</label>
                  <div className='col-sm-10'>
                      {/* <input type='text' name="title" value={proj.title} onChange={handleInputs} className="form-control" id="title" aria-describedby="title" placeholder="Enter Project Title" required/> */}
                  </div>
                </div>
                {
                  useMemo( () => ( 
                    <JoditEditor name="content" ref={editor} value={proj.content} config={editorConfig} onChange={handleInputs} /> 
                  ), [] )
                }
                  
                <button type="submit" name="submit" id="submit" className="btn btn-primary">{add}{add2}</button>
              </form>
              
            </div>
        </div>
    </>
  )
}

export default AddProject;