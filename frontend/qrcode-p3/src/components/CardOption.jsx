export default function CardOption({ 
  icon, 
  title, 
  text, 
  buttonLabel, 
  buttonVariant = "primary",
  onClick
}) {
  return (
    <div className="col-12 col-md-6 col-lg-5">
      <div className="card text-center p-4 h-100">
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <div className="card-icon mb-3">
            <div className="rounded-circle p-3 bg-light d-inline-flex justify-content-center align-items-center">
              {icon}
            </div>
          </div>
          <h5 className="card-title fw-bold">{title}</h5>
          <p className="card-text">{text}</p>
          <div className="mt-auto">
            <button 
              className={`btn btn-outline-${buttonVariant} mt-3`}
              onClick={onClick}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
