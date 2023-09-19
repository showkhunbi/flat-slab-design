import React, { useEffect, useState, useRef } from 'react'

// import Image
// import logoLight from "../assets/images/logo-light.png";
// import logoDark from "../assets/images/logo-dark.png";

const Navbar1 = () => {

    const [activeItem, setActiveItem] = useState('Home');

    const [navClass, setnavClass] = useState("");


    // navbar Scroll

    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setnavClass("nav-sticky");
        } else {
            setnavClass("");
        }
    }

    // toggle

    const navMenuRef = useRef(null);

    const toggleNavMenu = () => {
        navMenuRef.current.classList.toggle('collapse');
    };


    return (
        <React.Fragment>
            <div data-bs-spy="scroll" data-bs-target="#navbar" data-bs-offset="61" data-bs-smooth-scroll="true" className="scrollspy-example-2">
                <section className="tagline d-none d-md-block">
                    <div className='container-fluid'>
                        <div className="row align-items-center">
                            <div className='col-md-6'>
                                <div className="d-flex">
                                    <div className="phone">
                                        <i className="mdi mdi-phone"></i>  +1 123 456 78 90
                                    </div>
                                    <div className="email ms-3">
                                        <a href="mailto:#" className="text-dark">
                                            <i className="mdi mdi-email-open-outline"></i> Support@domain.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <ul className="top_socials d-flex list-unstyled justify-content-end mb-0">
                                    <li className="entry">
                                        <a href="#">
                                            <i className="bx bxl-facebook-circle"></i>
                                        </a>
                                    </li>
                                    <li className="entry">
                                        <a href="#">
                                            <i className="bx bxl-dribbble"></i>
                                        </a>
                                    </li>
                                    <li className="entry">
                                        <a href="#">
                                            <i className="bx bxl-instagram"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="clear"></div>
                    </div>
                </section>

                <nav className={`navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-light ${navClass}`}
                    id="navbar">
                    <div className='container-fluid'>
                        <nav href="index-1.html" className="brand logo text-uppercase">
                            {/* <img src={logoLight} className="logo-light" alt="" height="30" />
                            <img src={logoDark} className="logo-dark" alt="" height="30" /> */}
                        </nav>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleNavMenu}>
                            <span className="mdi mdi-menu"></span>
                        </button>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    )
}

export default Navbar1;

