import React, { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function UploadInput({ url, size, onUpload, user }) {
  const supabase = useSupabaseClient()
  const [fileUrl, setFileUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase
      .storage
      .from('resident')
      .download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setFileUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  const uploadFile = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `id.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('resident/' + user.id)
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {fileUrl ? (
        <img
          src={fileUrl}
          alt="File"
          className="file image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="file no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadFile}
          disabled={uploading}
        />
      </div>
    </div>
  )
}