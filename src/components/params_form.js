import React, { useState } from "react";
import FlatSlab from "../core/slab"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { cleanFloat } from "../core/functions";
import { toast } from "react-toastify"


export default function ParamsForm({ data, setData, projectID }) {


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleDropDataChange = (e) => {
    let value = e.target.value
    if (e.target.type === "checkbox") {
      value = e.target.checked
    }
    setData({ ...data, dropData: { ...data.dropData, [e.target.name]: value } })
  }

  const handleHeadDataChange = (e) => {
    let value = e.target.value
    if (e.target.type === "checkbox") {
      value = e.target.checked
    }
    setData({ ...data, headData: { ...data.headData, [e.target.name]: value } })
  }

  const [showModal, setModalShow] = useState(true);

  const [modalFlatslab, setModalFlatslab] = useState(undefined);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = (slab) => {
    setModalFlatslab(slab);
    setModalShow(true);
  }

  const sanitizeData = () => {
    let clean_data = {
      ...data,
      l: Number(data.l) / 1000,
      b: Number(data.b) / 1000,
      h: Number(data.h) / 1000,
      Gk: Number(data.Gk),
      Qk: Number(data.Qk),
      fcu: Number(data.fcu),
      fy: Number(data.fy),
      cover: Number(data.cover),
    }
    if (clean_data.dropData && clean_data.dropData.drop) {
      clean_data = {
        ...clean_data,
        dropData: {
          ...clean_data.dropData,
          h: Number(clean_data.dropData.h) / 1000,
        }
      }
    }
    if (clean_data.headData && clean_data.headData.head) {
      clean_data = {
        ...clean_data,
        headData: {
          ...clean_data.headData,
          column_dimension: Number(clean_data.headData.column_dimension) / 1000,
          l: Number(clean_data.headData.l) / 1000,
          b: Number(clean_data.headData?.b) / 1000,
          h: Number(clean_data.headData.h) / 1000,
        }
      }
    }
    return clean_data
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    designSlab(sanitizeData())
  }

  const designSlab = (data) => {
    let slab = new FlatSlab(data.l, data.b, data.h, data.Gk, data.Qk, data.fcu, data.fy, data.cover, data.condition)
    if (data.dropData.drop) {
      slab.add_drop(data.dropData.h)
    }
    if (data.headData.head) {
      slab.add_column_head(data.headData.type, data.headData.h, data.headData.flanged, data.headData.column_dimension)
    }
    handleModalShow(slab)
  }

  const handleSave = () => {
    localStorage.setItem(projectID || Date.now().toString(), JSON.stringify(data))
    toast("Project successfully saved", { type: "success" })
  }

  return (
    <React.Fragment>
      <section className="contact overflow-hidden pt-0">
        <div className="container" >
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="sec-hd mb-4">
                <span className="heading"></span>
                <h2 className="sec-title">Flat Slab Design</h2>
                <span className="heading"></span>
              </div>
            </div>
          </div>
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8">
              <div className="contact-box">
                <div className="custom-form mt-4">
                  <form method="post" onSubmit={handleFormSubmit}>
                    <p id="error-msg" style={{ opacity: 1 }}> </p>
                    <div id="simple-msg"></div>
                    <div className="mb-4">
                      <h6 className="mb-3">Project Information</h6>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <input name="projectName" type="text" onChange={handleChange} value={data.projectName}
                            className="form-control contact-form" placeholder="Project Name" required />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="mb-3">Geometry and layout</h6>
                      <div className="row mb-2">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label className="mb-1 small">Slab/ Support Condition</label>
                            <select name="condition" value={data.condition} onChange={handleChange} className="form-select contact-form">
                              <option value="IP">Internal Panel</option>
                              <option value="SSP">Simply Supported Panel</option>
                              <option value="CP">Continuous Panel</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label className="mb-1 small">Length (mm)</label>
                            <input type="number" name="l" value={data.l} onChange={handleChange} className="form-control contact-form"
                              placeholder="l" required />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label className="mb-1 small">Breadth (mm)</label>
                            <input type="number" name="b" value={data.b} onChange={handleChange} className="form-control contact-form"
                              placeholder="b" required />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label className="mb-1 small">Thickness (mm)</label>
                            <input type="number" name="h" min={125} value={data.h} onChange={handleChange} className="form-control contact-form"
                              placeholder="d" required />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="mb-3">Loading Conditions</h6>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <label className="mb-1 small">Dead load (kN/m²)</label>
                            <input type="number" name="Gk" value={data.Gk} onChange={handleChange} className="form-control contact-form" placeholder="Gk" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label className="mb-1 small">Live load (kN/m²)</label>
                            <input type="number" name="Qk" value={data.Qk} onChange={handleChange} className="form-control contact-form" placeholder="Qk" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="mb-3">Concrete and Material Properties</h6>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label className="mb-1 small">Concrete Grade (N/mm2)</label>
                            <input type="number" name="fcu" value={data.fcu} onChange={handleChange} className="form-control contact-form" placeholder="fcu" required />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label className="mb-1 small">Rebar Grade (N/mm2)</label>
                            <input type="number" name="fy" value={data.fy} onChange={handleChange} className="form-control contact-form" placeholder="fy" required />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label className="mb-1 small">Concrete Cover (mm)</label>
                            <input type="number" name="cover" value={data.cover} onChange={handleChange} className="form-control contact-form" placeholder="cover" required />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="mb-3">Support Conditions</h6>

                      <div className="mb-3" style={{ borderBottom: "1px dashed var(--bs-border-color)" }}>
                        <div className="row mb-2">
                          <div className="col-lg-8">
                            <div className="d-flex align-items-center">
                              <label className="mb-1 form-label">Column Drop</label>
                              <div className="form-switch ms-4">
                                <input className="form-check-input" name="drop" type="checkbox" checked={data.dropData.drop && "checked"} onChange={handleDropDataChange} value={data.dropData.drop} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {data.dropData.drop && <>
                          <div className="row mt-2 ms-4">
                            <div className="col-sm-4">
                              <div className="form-group">
                                <label className="mb-1 small">Drop Depth (mm)</label>
                                <input type="number" name="h" value={data.dropData.h} onChange={handleDropDataChange} className="form-control contact-form"
                                  placeholder="Height" required />
                              </div>
                            </div>
                          </div>
                        </>}

                      </div>

                      <div className="mb-3" style={{ borderBottom: "1px dashed var(--bs-border-color)" }}>
                        <div className="row mb-2">
                          <div className="col-lg-8">
                            <div className="d-flex align-items-center">
                              <label className="mb-1 form-label">Column Head</label>
                              <div className="form-switch ms-4">
                                <input className="form-check-input" type="checkbox" name="head" checked={data.headData.head && "checked"} onChange={handleHeadDataChange} value={data.headData.head} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {data.headData.head && <>
                          <div className="mt-2 ms-4">
                            <div className="row mb-2">
                              <div className="col-sm-4">
                                <div className="form-group">
                                  <label className="mb-1 small">Column Head type</label>
                                  <select name="type" value={data.headData.type} onChange={handleHeadDataChange} className="form-select contact-form">
                                    <option value="C">Circular</option>
                                    <option value="R">Rectangular</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group">
                                  <label className="mb-1 small">Column Dimension (mm)</label>
                                  <input type="number" name="column_dimension" value={data.headData.column_dimension} onChange={handleHeadDataChange} className="form-control contact-form"
                                    placeholder="Length" required />
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <div className="form-group">
                                  <label className="mb-1 small">Head Depth (mm)</label>
                                  <input type="number" name="h" value={data.headData.h} onChange={handleHeadDataChange} className="form-control contact-form"
                                    placeholder="Thickness" required />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                              <label className="mb-1 form-label">Flared</label>
                              <div className="form-check ms-4">
                                <input name="flanged" checked={data.headData.flanged && "checked"} onChange={handleHeadDataChange} className="form-check-input" type="checkbox" value={data.headData.flanged} />
                              </div>
                            </div>
                          </div>
                        </>}
                      </div>
                    </div>

                    <div className="row justify-content-center">
                      <div className="col-lg-6">
                        <div className="text-center">
                          <input type="submit" className="submitBnt btn btn-rounded bg-gradiant" value="Design Flat Slab" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ResultModal show={showModal} handleClose={handleModalClose} handleSave={handleSave} slab={modalFlatslab} />
    </React.Fragment>
  )
}

const ResultModal = ({ show, handleClose, handleSave, slab }) => {
  if (!slab) return <></>
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">Flat Slab Design Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="resultDetails">
          <div className="mb-3">
            <h6>Geometry and Dimensions</h6>
            <div><span className="fw-medium">Length:</span> {cleanFloat(slab.lx)} meters</div>
            <div><span className="fw-medium">Width:</span> {cleanFloat(slab.ly)} meters</div>
            <div><span className="fw-medium mb-2">Thickness:</span> {cleanFloat(slab.h)} meters</div>
            {slab.drop && <>
              <div><span className="fw-medium">Drop Dimension:</span> <span className="text-info-emphasis">{cleanFloat(slab.drop.lx)} x {cleanFloat(slab.drop.ly)} x {cleanFloat(slab.drop.h)} meters</span></div>
            </>}
            {slab.column_head && <>
              <div><span className="fw-medium">Effective Head Diameter:</span> <span className="text-info-emphasis">{cleanFloat(slab.column_head.hc)} meters</span></div>
            </>}

          </div>

          <div className="mb-3">
            <h6>Loading Conditions</h6>
            <div><span className="fw-medium">Dead Load:</span> {cleanFloat(slab.dead_load)} kN/m²</div>
            <div><span className="fw-medium">Live Load:</span> {cleanFloat(slab.live_load)} kN/m²</div>
            <div><span className="fw-medium">Ultimate Load:</span> {cleanFloat(slab.ultimateLoad)} kN/m²</div>
          </div>

          <div className="mb-3">
            <h6>Material Properties</h6>
            <div><span className="fw-medium">Concrete Grade:</span> {cleanFloat(slab.fcu)} N/mm2</div>
            <div><span className="fw-medium">Reinforcement Grade:</span> {cleanFloat(slab.fy)} N/mm2</div>
            <div><span className="fw-medium">Concrete Cover:</span> {cleanFloat(slab.cover)} mm</div>
          </div>

          <div className="mb-3">
            <h6>Deflection Check</h6>
            <div><span className="fw-medium">Status:</span> <AdequateComponent state={slab.isDeflectionAdequate()} /></div>
          </div>

          <div className="mb-3">
            <h6>Positive Moments</h6>
            <div className="mb-2">
              <div>Interior Strip</div>
              <div><span className="fw-medium">Moment at Column:</span> {cleanFloat(slab.columnStripPositiveMoment)} kN·m</div>
              <div className="text-info-emphasis">{slab.rebarDetails("columnStripPositiveMoment")} bottom steel</div>
            </div>
            <div className="mb-2">
              <div>Middle Strip</div>
              <div><span className="fw-medium">Moment at Midspan:</span> {cleanFloat(slab.middleStripPositiveMoment)} kN·m</div>
              <div className="text-info-emphasis">{slab.rebarDetails("middleStripPositiveMoment")} bottom steel</div>

            </div>
          </div>

          <div className="mb-3">
            <h6>Negative Moments</h6>
            <div className="mb-2">
              <div>Interior Strip</div>
              <div><span className="fw-medium">Moment at Column:</span> {cleanFloat(slab.columnStripNegativeMoment)} kN·m</div>
              <div className="text-info-emphasis">{slab.rebarDetails("columnStripNegativeMoment")} top steel</div>

            </div>
            <div className="mb-2">
              <div>Middle Strip</div>
              <div><span className="fw-medium">Moment at Midspan:</span> {cleanFloat(slab.middleStripNegativeMoment)} kN·m</div>
              <div className="text-info-emphasis">{slab.rebarDetails("middleStripNegativeMoment")} top steel</div>

            </div>
          </div>

          <div className="result-section">
            <h6>Punching Shear Stress Checks</h6>
            {slab.column_head && <>
              <div className="mb-2">
                <div>At the Column head</div>
                <div><span className="fw-medium">Shear Stress:</span> {cleanFloat(slab.shearStressAtColumnHead)} N/mm2</div>
                <div><span className="fw-medium">Status:</span> <AdequateComponent state={slab.isShearAdequate(slab.shearStressAtColumnHead, slab.max_shear_stress_factor)} /></div>
              </div>
            </>}
            <div className="mb-2">
              <div>First Critical Perimeter</div>
              <div><span className="fw-medium">Shear Stress:</span> {cleanFloat(slab.shearStressAtFirstCriticalPerimeter)} N/mm2</div>
              <div><span className="fw-medium">Status:</span> <AdequateComponent state={slab.isShearAdequate(slab.shearStressAtFirstCriticalPerimeter, slab.vc)} /></div>
            </div>
            {slab.drop && <>
              <div className="mb-2">
                <div>At the dropped panel</div>
                <div><span className="fw-medium">Shear Stress:</span> {cleanFloat(slab.shearStressAtDropCriticalSection)} N/mm2</div>
                <div><span className="fw-medium">Status:</span> <AdequateComponent state={slab.isShearAdequate(slab.shearStressAtDropCriticalSection, slab.vc)} /></div>
              </div>
            </>}
          </div>


        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>)
}

const AdequateComponent = ({ state }) => {
  if (state) return <span className="text-success">Adequate</span>
  return <span className="text-danger">Inadequate</span>
}

