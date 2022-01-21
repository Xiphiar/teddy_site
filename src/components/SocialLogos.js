import React from 'react'
import { Nav } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

import twitterLogo from '../assets/twitter.svg';
import telegramLogo from '../assets/telegram.svg';
import instagramLogo from '../assets/instagram.svg';
import redditLogo from '../assets/reddit.svg';

import twitterWhite from '../assets/twitter_white.svg';
import telegramWhite from '../assets/telegram_white.svg';
import instagramWhite from '../assets/instagram_white.svg';
import redditWhite from '../assets/reddit_white.svg';

//const SocialLogos = () => {
class SocialLogos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      white: this.props.white || false
    };
    console.log(this.state)
  }

  render(){
    return (
      <Nav className="justify-content-center align-items-center">
          <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? instagramWhite : instagramLogo } /></a>
          <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? twitterWhite : twitterLogo} /></a>
          <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? redditWhite : redditLogo} /></a>
          <a href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? telegramWhite : telegramLogo } /></a>
      </Nav>
    )
  }

}

export default SocialLogos
