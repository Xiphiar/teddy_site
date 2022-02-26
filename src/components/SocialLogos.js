import React from 'react'
import { Nav } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

import twitterLogo from '../assets/twitter.svg';
import telegramLogo from '../assets/telegram.svg';
import discordLogo from '../assets/discord.svg';
import redditLogo from '../assets/reddit.svg';

import twitterWhite from '../assets/twitter_white.svg';
import telegramWhite from '../assets/telegram_white.svg';
import discordWhite from '../assets/discord_white.svg';
import redditWhite from '../assets/reddit_white.svg';

//const SocialLogos = () => {
class SocialLogos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      white: this.props.white || false
    };
  }

  render(){
    return (
      <Nav className="justify-content-end align-items-center" style={{width:"100%"}}>
          <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? twitterWhite : twitterLogo} /></a>
          <a style={{ "paddingRight": "20px" }} href={`https://discord.gg/FxVJNWqu`}><Image src={this.props.white ? discordWhite : discordLogo } /></a>
          {/*
          <a style={{ "paddingRight": "20px" }} href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? redditWhite : redditLogo} /></a>
          <a href={`https://twitter.com/MidnightTedClub`}><Image src={this.props.white ? telegramWhite : telegramLogo } /></a>
          */}
      </Nav>
    )
  }

}

export default SocialLogos
