import {
  createStorageRef
} from './helpers'

export default function put (path, file, options = {}) {
  const filename = options.filename || file.name
  const ref = createStorageRef(path).child(filename)
  const metadata = Object.assign({}, options.metadata || {}, {
    contentType: file.type
  })
  const uploadTask = ref.put(file, metadata)
  const progress = options.progress || (() => {})
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', snapshot => {
      progress({
        progress: snapshot.bytesTransferred / snapshot.totalBytes,
        bytesTransferred: snapshot.bytesTransferred,
        totalBytes: snapshot.totalBytes,
        state: snapshot.state // 'paused', 'running'
      })
    },
    (error) => {
      reject({error: error.message})
    },
    () => {
      resolve({url: uploadTask.snapshot.downloadURL, filename})
    })
  })
}
