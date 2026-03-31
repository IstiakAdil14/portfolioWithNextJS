import Footer from '../components/Footer';
import Banner from '../components/HomeComponents/Banner';
import MyExpertise from '../components/HomeComponents/Expertise/MyExpertise';
import AvailabilityBadge from '../components/HomeComponents/AvailabilityBadge';
import CurrentlyDoing from '../components/HomeComponents/CurrentlyDoing';
import TechMarquee from '../components/HomeComponents/TechMarquee';
import HowIWork from '../components/HomeComponents/HowIWork';
import InteractiveTerminal from '../components/HomeComponents/InteractiveTerminal';
import OpenSource from '../components/HomeComponents/OpenSource';
import WhatIDo from '../components/HomeComponents/WhatIDo';
import FunStats from '../components/HomeComponents/FunStats';
import CodingActivity from '../components/HomeComponents/CodingActivity';

const home = () => {
    return (
        <div className="Home-Page -z-10">
            <Banner />
            <AvailabilityBadge />
            <CurrentlyDoing />
            <TechMarquee />
            <MyExpertise />
            <HowIWork />
            <WhatIDo />
            <OpenSource />
            <CodingActivity />
            <FunStats />
            <InteractiveTerminal />
            <Footer />
        </div>
    )
}

export const getServerSideProps = async () => ({ props: {} });
export default home
