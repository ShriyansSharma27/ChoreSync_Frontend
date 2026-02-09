export function EmptyServiceCard() {
    return (
    <div className="mb-4">
        <div className="card" >
            <img src="" className="card-img-top" style={{ height: "11.25rem" }} alt="..." />
            <div className="card-body">
                <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6" />
                </h5>
                <p className="card-text placeholder-glow">
                    <span className="placeholder col-7" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-6" />
                    <span className="placeholder col-8" />
                </p>
            </div>
        </div>
    </div>
    );
}