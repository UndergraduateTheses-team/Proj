import Content from '../components/content/Contents.js';
import Intro from '../components/intro/intro.js';
import Footer from '../components/footer/Footer.js';
import NavbarAdmin from '~/components/Navbar/NavbarAdmin.js';

const HomePageAdmin = () => {
    return (
        <div>
            <NavbarAdmin />
            <Intro />
            <Content />
            <Footer />
        </div>
    );
};

export default HomePageAdmin;
