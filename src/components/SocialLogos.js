import { Nav } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

import twitterLogo from '../assets/twitter.svg';
import telegramLogo from '../assets/telegram.svg';
import instagramLogo from '../assets/instagram.svg';
import redditLogo from '../assets/reddit.svg';

const SocialLogos = () => {
  return (
    <Nav className="justify-content-center align-items-center">
        <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={instagramLogo} /></a>
        <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={twitterLogo} /></a>
        <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={redditLogo} /></a>
        <a href={`https://twitter.com/MidnightTedClub`}><Image src={telegramLogo} /></a>
    </Nav>
  )
}

export default SocialLogos
