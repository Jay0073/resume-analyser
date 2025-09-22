import FileUpload from '../file-upload'

export default function FileUploadExample() {
  return (
    <div className="p-6">
      <FileUpload 
        onFileSelect={(file) => console.log('File selected:', file.name)}
        isLoading={false}
      />
    </div>
  )
}