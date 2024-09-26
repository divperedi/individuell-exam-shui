import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <section>
            <Link to="/">
                <img src={'/logo.png'} alt="logo" className='logo'/>
            </Link>
        </section>
    );
}

export default Header;