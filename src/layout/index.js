import React from "react";
import Contact from '../components/Contact'


const Layout = ({ children }) => {
    return (
        <React.Fragment>
            {children}
            <Contact />
        </React.Fragment>
    )
}

export default Layout;