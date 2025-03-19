import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avatar from '../assets/profile_icon.png';
import styles from '../styles/Navbar.module.css';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [menuOpen, setMenuOpen] = useState(false);
    

    // Update isMobile on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
            if (window.innerWidth > 600) {
                setMenuOpen(false); // Close menu when resizing to desktop
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pathAndName = [
        ['/', 'Home'],
        ['/contests', 'Contests'],
        ['/problems', 'Problems'],
        ['/ranking', 'Ranking'],
        ['/blogs', 'Blogs'],
        ['/login', 'Login']
    ];

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                {/* Left Side - Logo & Nav Links */}
                <div className={styles.leftContainer}>
                    <Link to="/" className={styles.logo}>
                        ByteBlitz
                    </Link>
                    <ul className={styles.navLinks}>
                        {pathAndName.map(([path, name]) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className={`${styles.navItem} ${location.pathname === path ? styles.active : ''
                                        }`}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side - Avatar Icon */}
                <div className={styles.rightContainer}>
                    {isMobile ? (
                        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                        </div>
                    ) : (
                        <>
                            <Link to="/profile">
                                <img src={avatar} alt="User Avatar" className={styles.avatar} />
                            </Link>
                        </>
                    )}

                    {/* Mobile Navigation Menu */}
                    {isMobile && menuOpen && (
                        <ul className={styles.mobileNav}>
                            <li >
                                <div className={styles.mobileNavProfile}>
                                    <Link to="/profile">
                                        <img src={avatar} alt="User Avatar" className={styles.avatar} />
                                    </Link>
                                    <Link to="/profile">
                                        <span>Shreesh-125</span>
                                    </Link>
                                </div>
                                <hr className={styles.separator} />
                            </li>
                            {pathAndName.map(([path, name], index) => (
                                <li key={path}>
                                    <Link
                                        to={path}
                                        className={`${styles.navItem} ${location.pathname === path ? styles.active : ''
                                            }`}
                                        onClick={() => setMenuOpen(false)} // Close menu on click
                                    >
                                        {name}
                                    </Link>
                                    {index !== pathAndName.length - 1 && <hr className={styles.separator} />}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;