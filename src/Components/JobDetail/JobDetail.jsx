import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { images } from "../../img/index";
import {
  Card,
  Container,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Nav,
} from "react-bootstrap";
import { AiOutlineDollarCircle } from "react-icons/ai";
import {
  BsBriefcase,
  BsCalendar2Check,
  BsClockHistory,
  BsDiagram3,
  BsHeadset,
  BsPerson,
  BsWhatsapp,
} from "react-icons/bs";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { TiFlowChildren } from "react-icons/ti";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineWorkOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { JobContext } from "../../Context/JobContext";
import "./jobdetail.css";

import { Space } from "antd";
import { getApiHostImage } from "../../config";

export default function JobDetail() {
  const { fetchJobDetail, postCV, checkCV } =
    useContext(JobContext);
  const [err, setErr] = useState(false);
  const [cvErr, setCvErr] = useState(false);
  const [show, setShow] = useState("");
  const [logo, setLogo] = useState("");
  const [file, setFile] = useState({});
  const [fileErr, setFileErr] = useState(false);
  const [check, setCheck] = useState(false);
  const { id } = useParams();
  const [jobData, setJobData] = useState({});
  const [createDate, setCreateDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [MyRcmAlert, setMyRcmAlert] = useState(false);
  const res = localStorage.getItem("currentUser");
  const userCurrent = JSON.parse(res);
  const handleClose = () => setShow(false);

  const localToken = localStorage.getItem("token");
  const userToken = JSON.parse(localToken);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const detailData = async () => {
      await getJobDetail();
    };
    detailData();
  }, [id]);

  useEffect(() => {
    const checkMyCv = async () => {
      const check = await checkCV(id, userToken);
    
      if (typeof check === "object" && check !== null) {
        setMyRcmAlert(false);
      } else {
        if (check == false) {
          setMyRcmAlert(false);
        } else {
          setMyRcmAlert(true);
        }
      }
    };
    checkMyCv();
  }, [id]);

  useEffect(() => {
    const description = document.getElementById("description");
    description.innerHTML = `
        ${jobData?.description}
    `;

    const companyDescription = document.getElementById("about-info");
    companyDescription.innerHTML = `
        ${jobData?.name?.info?.description}
    `;

    let crTime = new Date(jobData.createAt).getTime();
    let crDay = new Date(crTime).getDate();
    let crMonth = new Date(crTime).getMonth() + 1;
    let crYear = new Date(crTime).getFullYear();
    let newCreate = `${crDay}-${crMonth}-${crYear}`;
    setCreateDate(newCreate);

    let dlTime = new Date(jobData.deadline).getTime();
    let dlDay = new Date(dlTime).getDate();
    let dlMonth = new Date(dlTime).getMonth() + 1;
    let dlYear = new Date(dlTime).getFullYear();
    let newDealine = `${dlDay}-${dlMonth}-${dlYear}`;
    setDeadlineDate(newDealine);
  }, [jobData]);

  const handleShow = () => {
    if (!userCurrent) {
      setLoginErr(true);
      return;
    } else {
      setLoginErr(false);
    }

    if (userCurrent.info == null) {
      setCheck(true);
      return;
    } else if (userCurrent.info) {
      setCheck(false);
      setShow(true);
    }
  };

  const handleActive = async (event) => {
    event.preventDefault();
    setCheck(false);

    if (file == "" || file == null) {
      setErr(true);
      return;
    } else {
      setErr(false);
      const splitFile = file?.name?.split(".")
      // console.log("splitFile", splitFile[1]);

      if (splitFile[1] == "docx" || splitFile[1] == "pdf" ) {
        setFileErr(false);
      } else {
        setFileErr(true);
        return;
      }

      const post = await postCV(id, file, userToken);
      // console.log("post", post);
      if (typeof post === "object" && post !== null) {
        setCvErr(true);
        return;
      } else {
        setCvErr(false);
        handleClose();
        setMyRcmAlert(true);
      }
    }
  };

  const getJobDetail = async () => {
    let data = await fetchJobDetail(id);
    if (data) {
      setJobData(data);
      const image = data?.name?.avatar;
      const splitString = image.split("/");
      const imageString = splitString[1] + "/".concat(splitString[2]);
      return setLogo(imageString);
    }
    return data;
  };
  const scrollToElement = (elementID) => {
    const element = document.getElementById(elementID);
    const offsetTop = element.offsetTop;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  };
  
  return (
    <>
      {jobData && (
        <Container>
          <Row>
            <Col sm={9} md={9}>
              <Card className="job-content mt-3 mb-3">
                <Card.Img
                  className="job-banner"
                  variant="top"
                  src="https://dxwd4tssreb4w.cloudfront.net/web/images/default_banner_1.svg"
                />
                <Card.Body>
                  <Row className="titte m-2">
                    <Col className="logo" sm={2} md={2}>
                      <img
                        className="image-logo"
                        src={getApiHostImage() + `${logo}`}
                      />
                    </Col>

                    <Col className="company mt-4" sm={10} md={10}>
                      <Card.Title className="job-tittle">
                        {jobData?.title}
                      </Card.Title>
                      <h3> {jobData?.name?.info?.name}</h3>
                    </Col>
                  </Row>

                  <div className="job-details">
                    <p className="mt-2" style={{ fontWeight: "bolder" }}>
                      <CiLocationOn className="me-2"></CiLocationOn>
                      {jobData?.location?.name}
                    </p>
                    <p className="mt-2">
                      <AiOutlineDollarCircle className="me-2"></AiOutlineDollarCircle>
                      <b>L????ng</b>:{" "}
                      <span className="salary">{jobData?.salary} (VN??)</span>
                    </p>
                    <p className="mt-2">
                      <MdOutlineWorkOutline className="me-2"></MdOutlineWorkOutline>
                      <b>Y??u c???u kinh nghi???m: </b>{" "}
                      <span>{jobData?.experience} </span>
                    </p>
                    <Row className="mt-2">
                      <Col sm={5} md={5}>
                        <BsCalendar2Check className="me-2"></BsCalendar2Check>
                        <b>Ng??y ????ng tuy???n:</b>{" "}
                        <span className="create-date"> {createDate}</span>
                      </Col>
                      <Col sm={5} md={5}>
                        <b>Ng??y h???t h???n:</b>{" "}
                        <span className="deadline-date">{deadlineDate}</span>
                      </Col>
                    </Row>

                    {(!userCurrent || userCurrent.role === "candidate") && (
                      <Row>
                        <Space wrap>
                          {!MyRcmAlert ? (
                            <Button
                              className="job-button button-apply"
                              variant="primary"
                              onClick={handleShow}
                            >
                              N???p ????n ngay
                            </Button>
                          ) : (
                            <Button
                              className="job-button button-confirm disabled"
                              variant="primary"
                            >
                              ???? ???ng tuy???n
                            </Button>
                          )}
                        </Space>
                        {check && (
                          <p className="err">
                            {" "}
                            B???n c???n c???p nh???t ?????y ????? th??ng tin c?? nh??n ????? s??? d???ng
                            ch???c n??ng n??y.
                          </p>
                        )}
                        {loginErr && (
                          <p className="err">
                            {" "}
                            B???n c???n ph???i <Link to={"/login"}>????ng nh???p</Link> ?????
                            n???p ????n ???ng tuy???n.
                          </p>
                        )}
                        {MyRcmAlert && (
                          <p className="err">
                            B???n ???? n???p ????n v??o c??ng vi???c n??y, ki???m tra l???i danh
                            s??ch ???ng tuy???n.
                          </p>
                        )}
                      </Row>
                    )}
                  </div>

                  <div className="tab-rows">
                    <Row className="ms-2 p-2">
                      <Col sm={2} md={2}>
                        <a
                          className="job-tab"
                          onClick={() => scrollToElement("des-title")}
                        >
                          M?? t???
                        </a>
                      </Col>

                      <Col sm={2} md={2}>
                        <a
                          className="job-tab"
                          onClick={() => scrollToElement("require")}
                        >
                          Y??u c???u
                        </a>
                      </Col>

                      <Col sm={3} md={3}>
                        <a
                          className="job-tab"
                          onClick={() => scrollToElement("info")}
                        >
                          Th??ng tin li??n h???
                        </a>
                      </Col>

                      <Col sm={3} md={3}>
                        <a
                          className="job-tab"
                          onClick={() => scrollToElement("about")}
                        >
                          V??? c??ng ty
                        </a>
                      </Col>

                      <Col sm={2} md={2}></Col>
                    </Row>
                  </div>

                  <div id="des-title">
                    <h2 className="require-title"> M?? t??? </h2>
                    <div id="description" className="mt-3"></div>
                  </div>

                  <div id="require" className="mt-3">
                    <h2 className="require-title"> Y??u C???u </h2>
                    <Row>
                      <Col sm={6} md={6}>
                        <Card>
                          <Card.Body>
                            <div>
                              <h3 className="require-text">
                                <BsBriefcase className="me-2"></BsBriefcase> V???
                                tr??
                              </h3>
                              <p className="ms-2"> {jobData?.position}</p>
                            </div>

                            <div className="mt-3">
                              <h3 className="require-text">
                                <BsDiagram3 className="me-2"></BsDiagram3> C???p
                                b???c
                              </h3>
                              <p className="ms-2"> {jobData?.level}</p>
                            </div>

                            <div className="mt-3">
                              <h3 className="require-text">
                                <BsClockHistory className="me-2"></BsClockHistory>
                                Th???i gian l??m vi???c
                              </h3>
                              <> 
                              <p className="ms-2"> {jobData?.type}</p>
                              </>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={6} md={6}>
                        <Card className="require-table2">
                          <Card.Body>
                            <div>
                              <h3 className="require-text">
                                <RxAvatar className="me-2"></RxAvatar>Kinh
                                nghi???m
                              </h3>
                              <p className="ms-2">
                                {jobData?.experience} kinh nghi???m
                              </p>
                            </div>

                            <div className="mt-3">
                              <h3 className="require-text">
                                <BsPerson className="me-2"></BsPerson>S??? l?????ng
                              </h3>
                              <p className="ms-2">
                                {jobData?.numberApplicant} nh??n vi??n
                              </p>
                            </div>

                            <div className="mt-3">
                              <h3 className="require-text">
                                <TiFlowChildren className="me-2"></TiFlowChildren>
                                ????? tu???i
                              </h3>
                              <p className="ms-2"> {jobData?.age} tu???i</p>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <div id="info" className="mt-3">
                    <h2 className="require-title"> Th??ng tin li??n h??? </h2>
                    <p className="ms-2 mt-3">
                      {" "}
                      T??n Li??n h???: <b>Ph??ng Nh??n S???</b>
                    </p>
                    <p className="ms-2 mt-3">
                      {" "}
                      <CiLocationOn></CiLocationOn>{" "}
                      {jobData?.name?.info?.address}{" "}
                    </p>
                    <p className="ms-2 mt-3">
                      {" "}
                      <CiPhone> </CiPhone> {jobData?.name?.info?.phoneNumber}
                    </p>
                  </div>

                  <div id="about" className="mt-3">
                    <h2 className="require-title"> V??? C??ng Ty </h2>
                    <div id="about-info"></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <img
                className="list-banner mb-3 mt-3"
                src={images.banner}
                alt=""
              />
            </Col>
          </Row>

          <Modal show={show} onHide={handleClose} className="job-modal mt-5">
            <Modal.Header closeButton>
              <Modal.Title>Form ???ng Tuy???n</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group>
                <Form.Label>H??? s?? ???ng tuy???n</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  name="formFile"
                  onChange={(event) => setFile(event.target.files[0])}
                />
                {err && <p className="err">H??? s?? kh??ng ???????c ????? tr???ng </p>}
                {cvErr && <p className="err"> Kh??ng g???i d??? li???u th??nh c??ng </p>}
                {fileErr && <p className="err">Ch??? nh???n file c?? k???t th??c b???ng .docx ho???c .pdf </p>}
              </Form.Group>

              <Form.Group>
                <Form.Label className="mt-3"> Ghi ch??</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>

              <Row className="mt-3">
                <Col sm={4} md={4}></Col>

                <Col sm={4} md={4}>
                  <Button
                    className="modal-button"
                    variant="outline-primary"
                    onClick={handleActive}
                  >
                    G???i y??u c???u
                  </Button>
                </Col>

                <Col sm={3} md={3}></Col>
              </Row>
            </Modal.Body>
          </Modal>
        </Container>
      )}
    </>
  );
}
