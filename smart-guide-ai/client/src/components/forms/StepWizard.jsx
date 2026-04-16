import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import DocumentUpload from './DocumentUpload'
import clsx from 'clsx'

/* ──────────────────────────────────────────────────────────────
   Step indicator bar
────────────────────────────────────────────────────────────── */
function StepBar({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => {
        const state = i < current ? 'completed' : i === current ? 'active' : 'pending'
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={clsx('step-dot', state)}>
                {state === 'completed' ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <p className={clsx(
                'text-[10px] mt-1.5 font-medium text-center hidden sm:block w-20',
                state === 'active'    && 'text-primary-600 dark:text-primary-400',
                state === 'completed' && 'text-green-600 dark:text-green-400',
                state === 'pending'   && 'text-slate-400'
              )}>
                {step.title}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className={clsx(
                'flex-1 h-0.5 mx-1 mt-[-16px] sm:mt-[-28px] transition-all',
                i < current ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Single field renderer
────────────────────────────────────────────────────────────── */
function FormField({ field, register, errors }) {
  const errMsg = errors[field.name]?.message
  const base   = 'form-input'

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          rows={3}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className={base}
          {...register(field.name, {
            required: field.required && `${field.label} is required`,
          })}
        />
      ) : field.type === 'select' ? (
        <select
          className={base}
          {...register(field.name, { required: field.required && `${field.label} is required` })}
        >
          <option value="">Select {field.label}</option>
          {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          maxLength={field.maxLength}
          className={base}
          {...register(field.name, {
            required: field.required && `${field.label} is required`,
            ...(field.name === 'aadhaar' && {
              pattern: { value: /^\d{12}$/, message: 'Aadhaar must be 12 digits' },
            }),
            ...(field.name === 'email' && {
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            }),
          })}
        />
      )}

      {errMsg && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errMsg}</p>}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Review Step — shows all collected data
────────────────────────────────────────────────────────────── */
function ReviewStep({ data, service }) {
  return (
    <div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Review Your Application</h3>
      <div className="space-y-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        {service.formFields.map(f => (
          <div key={f.name} className="flex justify-between text-sm py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
            <span className="text-slate-500 dark:text-slate-400">{f.label}</span>
            <span className="font-medium text-slate-800 dark:text-white max-w-[55%] text-right break-words">
              {data[f.name] || '—'}
            </span>
          </div>
        ))}
      </div>
      {data._files?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Documents ({data._files.length})
          </p>
          <div className="space-y-1.5">
            {data._files.map(f => (
              <div key={f.name} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={14} className="text-green-500" />
                {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Main StepWizard
────────────────────────────────────────────────────────────── */
export default function StepWizard({ service, onSubmit, isSubmitting }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [files, setFiles]             = useState([])
  const [allData, setAllData]         = useState({})

  const totalSteps = service.steps.length  // last real step = upload; after that = review
  const isUploadStep  = currentStep === totalSteps - 2
  const isReviewStep  = currentStep === totalSteps - 1
  const isLastStep    = currentStep === totalSteps - 1

  // Divide form fields across steps (all in step 0 for simplicity; upload on penultimate)
  const formFieldsForStep = currentStep === 0 ? service.formFields : []

  const {
    register, handleSubmit, getValues,
    formState: { errors },
  } = useForm({ defaultValues: allData })

  const next = handleSubmit((data) => {
    const merged = { ...allData, ...data }
    setAllData(merged)
    setCurrentStep(c => c + 1)
  })

  const prev = () => setCurrentStep(c => Math.max(0, c - 1))

  const submit = () => {
    onSubmit({ ...allData, _files: files })
  }

  return (
    <div>
      <StepBar steps={service.steps} current={currentStep} />

      <div className="glass-card p-6 min-h-[340px] flex flex-col">

        {/* Step title */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            {service.steps[currentStep]?.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {service.steps[currentStep]?.desc}
          </p>
        </div>

        <div className="flex-1">
          {isReviewStep ? (
            <ReviewStep data={{ ...allData, _files: files }} service={service} />
          ) : currentStep === totalSteps - 2 ? (
            /* Upload step */
            <DocumentUpload
              value={files}
              onChange={setFiles}
              label="Upload Required Documents"
            />
          ) : (
            /* Form step */
            <form id="step-form" onSubmit={next} className="grid sm:grid-cols-2 gap-4">
              {formFieldsForStep.map(field => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <FormField field={field} register={register} errors={errors} />
                </div>
              ))}
              {/* Intermediate steps beyond 0 but before upload — just show a placeholder */}
              {currentStep > 0 && currentStep < totalSteps - 2 && (
                <div className="sm:col-span-2 flex items-center justify-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                  ✅ This section has been filled. Continue to the next step.
                </div>
              )}
            </form>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className={clsx(
              'btn-secondary flex items-center gap-2 text-sm py-2.5',
              currentStep === 0 && 'opacity-40 cursor-not-allowed'
            )}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={submit}
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 text-sm py-2.5 min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              ) : (
                <>Submit Application ✓</>
              )}
            </button>
          ) : (
            <button
              type={currentStep === 0 ? 'submit' : 'button'}
              form={currentStep === 0 ? 'step-form' : undefined}
              onClick={currentStep === 0 ? undefined : () => setCurrentStep(c => c + 1)}
              className="btn-primary flex items-center gap-2 text-sm py-2.5"
            >
              Next Step <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
