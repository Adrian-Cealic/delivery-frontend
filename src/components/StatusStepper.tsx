interface StatusStepperProps {
  steps: string[];
  current: string;
  failed?: boolean;
}

export default function StatusStepper({ steps, current, failed }: StatusStepperProps) {
  const currentIdx = steps.findIndex(
    s => s.toLowerCase() === current.toLowerCase()
  );

  return (
    <div className="status-stepper">
      {steps.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const isFailed = failed && isActive;

        return (
          <div key={step} className="stepper-item">
            <div
              className={`stepper-dot${isDone ? ' done' : ''}${isActive ? (isFailed ? ' failed' : ' active') : ''}`}
            />
            {i < steps.length - 1 && (
              <div className={`stepper-line${isDone ? ' done' : ''}`} />
            )}
            <span className={`stepper-label${isActive ? (isFailed ? ' failed' : ' active') : ''}${isDone ? ' done' : ''}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
