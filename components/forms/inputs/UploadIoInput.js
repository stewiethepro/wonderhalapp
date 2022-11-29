import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";

// Get production API keys from Upload.io
const uploader = Uploader({
  apiKey: "public_W142hXM9vNrAxAkZTwyDEKynSGMZ"
});

// Customize the dropzone UI (see "customization"):

// Render the file upload dropzone:
export default function UploadInput({user}) {
    
    const options = {
        // ---------------------
        // Colors & Font Size
        // ---------------------
        styles: {
            colors: {
              primary: "#4f46e5",     // Hex codes only.
              active: "#818cf8"
            },
            fontSizes: {
              base: 16
            }
        },
      
        // ---------------------
        // Image Editor
        // ---------------------
        editor: {
          images: {
            crop: true,             // false disables the image editor / cropper
            cropRatio: 4 / 3,
            cropShape: "rect"       // "rect" | "circ"
          }
        },
      
        // ---------------------
        // Accepted Files
        // ---------------------
        maxFileCount: 10,
        maxFileSizeBytes: 5 * 1024 * 1024,
        multi: true,
      
        // ---------------------
        // File Upload Behaviour
        // ---------------------
        path: {                      // Optional: can be a string (full file path) or an object like so:
          fileName: "id" + {ORIGINAL_FILE_EXT},   // Each supports path variables (e.g. {ORIGINAL_FILE_EXT}). See your
          folderPath: "/residents/" + user.id  // API key's config in the Upload Dashboard for all path variables.
        },
        metadata: {},                // Arbitrary JSON object (to save against the file).
        tags: [],                    // Array of strings (to save against the file).
      
        // ---------------------
        // Other UI Behaviour
        // ---------------------
        layout: "modal",            // "modal" | "inline" (i.e. to create a dropzone)
        container: "body",          // Parent element to render the widget in.
        onUpdate: files => {},
        showFinishButton: true,
        showRemoveButton: true
      }


return (
        <UploadDropzone 
        uploader={uploader}       // Required.
        options={options}         // Optional.
        width="600px"             // Optional.
        height="375px"            // Optional.
        onUpdate={files => {      // Optional.
            if (files.length === 0) {
            console.log('No files selected.')
            } else {
            console.log('Files uploaded:');
            console.log(files.map(f => f.fileUrl));
            }
        }} />
    )
}