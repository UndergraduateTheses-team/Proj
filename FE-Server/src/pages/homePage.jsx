import Navbar from '../components/Navbar/Navbar.js';

import Content from '../components/content/Contents.js';
import Intro from '../components/intro/intro.js';
import Footer from '../components/footer/Footer.js';

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <Intro />
            <Content />
            <Footer />
        </div>
    );
};

export default HomePage;
