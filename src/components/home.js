import { useState } from "react"
import ParamsForm from "./params_form"
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify"

const Home = () => {
    const [showLoadModal, setShowLoadModal] = useState(false)
    const [projectID, setProjectID] = useState(null)
    const [data, setData] = useState(null)


    let defaultState = {
        projectName: "",
        l: "",
        b: "",
        h: "",
        Gk: "",
        Qk: "",
        fcu: 25,
        fy: 250,
        cover: 25,
        condition: "IP",
        dropData: {
            drop: false,
        },
        headData: {
            head: false,
            type: "C"
        },

    }
    const handleLoadModalClose = () => setShowLoadModal(false);
    const handleLoadModalShow = () => {
        setShowLoadModal(true)
    }

    const handleSetProjectID = (ID) => {
        let data
        if (ID !== null && ID !== undefined) {
            data = JSON.parse(localStorage.getItem(ID))
            toast(`${data.projectName} Successfully Loaded`, { type: "success" })
        } else {
            data = defaultState
            toast("Starting a new project")
        }
        setData(data)
        setProjectID(ID)
        handleLoadModalClose()
    }


    return (
        <>
            <section className="home-1 bg-home d-flex align-items-center bg-light" style={{ height: 'auto' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 text-center mt-0 my-5 pt-0 py-5">
                            <div className="home-heading">
                                <div className="badge bg-soft-primary rounded-pill mb-3">Reinforced Concrete Design</div>
                                <h2 className="home-title">Flat Slab Design App</h2>
                                <p className="text-muted para-desc">The Flat Slab Design app is meticulously crafted to assist students and engineers in swiftly creating flat slab designs across any platform. With user-friendly features and a powerful design engine, you can streamline the design process, ensuring efficiency and precision in every project. Welcome to a new era of effortless flat slab design.</p>
                                <ul className="mt-4 list-unstyled mb-0 align-items-center">
                                    <li className="list-inline-item">
                                        <button className="btn bg-gradiant me-2" onClick={() => handleSetProjectID(null)}>
                                            <i className="uil uil-newspaper me-1"></i>
                                            Start New Project
                                        </button>
                                    </li>
                                    <li className="list-inline-item text-muted me-2 h6">Or</li>
                                    <li className="list-inline-item">
                                        <button type="button" onClick={handleLoadModalShow} className="text-primary fw-bold bg-transparent border-0">
                                            Load Recent Project <i className="uil uil-angle-right-b align-middle"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <LoadProjectModal showLoadModal={showLoadModal} handleLoadModalClose={handleLoadModalClose} handleSetProjectID={handleSetProjectID} />
                        {data !== null && <ParamsForm data={data} setData={setData} projectID={projectID} />}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home

const LoadProjectModal = ({ showLoadModal, handleLoadModalClose, handleSetProjectID }) => {
    const [selectOption, setSelectOption] = useState("")
    let options = []
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i)
        let option = { key: key, name: JSON.parse(localStorage.getItem(key)).projectName }
        options.push(option)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleSetProjectID(selectOption)
    }
    return (
        <Modal
            show={showLoadModal}
            onHide={handleLoadModalClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className="h5">Load Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="form-group">
                            <select className="form-control contact-form" value={selectOption} onChange={(e) => setSelectOption(e.target.value)}>
                                <option value="">--------------- SELECT PROJECT ---------------</option>
                                {options.map((option, i) => {
                                    return <option key={i} value={option.key}>{option.name}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="text-center">
                                <input type="submit" disabled={selectOption ? "" : "disabled"} className="submitBnt btn btn-rounded bg-gradiant" value="Load Project" />
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>)
}