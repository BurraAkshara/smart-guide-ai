import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, Image, CheckCircle2, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/')
  const sizeMB  = (file.size / (1024 * 1024)).toFixed(2)
  const isOk    = file.size <= MAX_SIZE

  return (
    <div className={clsx(
      'flex items-center gap-3 p-3 rounded-xl border transition-all',
      isOk
        ? 'border-green-100 dark:border-green-900/40 bg-green-50 dark:bg-green-900/10'
        : 'border-red-100   dark:border-red-900/40   bg-red-50   dark:bg-red-900/10'
    )}>
      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden">
        {isImage ? (
          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <FileText size={20} className="text-slate-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{file.name}</p>
        <p className={clsx('text-xs', isOk ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
          {sizeMB} MB {!isOk && '— exceeds 2 MB limit'}
        </p>
      </div>
      {isOk
        ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
        : <AlertCircle  size={16} className="text-red-500   flex-shrink-0" />
      }
      <button
        onClick={() => onRemove(file.name)}
        className="p-1 hover:bg-white/60 dark:hover:bg-slate-600 rounded-lg transition-colors"
      >
        <X size={14} className="text-slate-500" />
      </button>
    </div>
  )
}

export default function DocumentUpload({ value = [], onChange, label = 'Upload Documents' }) {
  const [rejected, setRejected] = useState([])

  const onDrop = useCallback((accepted, rej) => {
    const combined = [...value]
    accepted.forEach(f => {
      if (!combined.find(x => x.name === f.name)) combined.push(f)
    })
    onChange(combined)
    setRejected(rej.map(r => r.file.name))
  }, [value, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_SIZE,
    multiple: true,
  })

  const remove = (name) => onChange(value.filter(f => f.name !== name))

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</label>}

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        )}
      >
        <input {...getInputProps()} />
        <div className={clsx(
          'w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors',
          isDragActive ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-slate-100 dark:bg-slate-700'
        )}>
          <Upload size={24} className={isDragActive ? 'text-primary-600' : 'text-slate-400'} />
        </div>
        <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-1">
          {isDragActive ? 'Drop files here…' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-xs text-slate-400">PDF, JPG, PNG accepted · Max 2 MB each</p>

        {/* Accepted types chips */}
        <div className="flex justify-center gap-2 mt-4">
          {['PDF', 'JPG', 'PNG'].map(type => (
            <span key={type} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Rejected files warning */}
      {rejected.length > 0 && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
          <AlertCircle size={13} />
          <span>Some files were rejected (wrong type or too large): {rejected.join(', ')}</span>
        </div>
      )}

      {/* File list */}
      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {value.length} file{value.length > 1 ? 's' : ''} selected
          </p>
          {value.map(f => (
            <FilePreview key={f.name} file={f} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
