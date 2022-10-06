import React from "react";
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { getSigningClient, getPermit } from "../../utils/keplrHelper";
import {
  queryOwnedTokens,
  queryTokenMetadata,
} from "../../utils/queryHelper";
import { verifydiscord } from "../../utils/dataHelper";
import { signMessage } from "curve25519-js";
import { toast } from "react-toastify";
import "./SecretSocietyCard.css";

class SecretSocietyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secretJs: null,
      address: null,
      queryPermit: {},
      discordTag: "",
      isLoading: false,
    };
  }

  componentDidMount = async () => {};

  handleLookupDiscordTagChange = (event) => {
    this.setState({ discordTag: event.target.value });
  };

  getPermit = async () => {
    if (this.state.queryPermit.signature) {
      return;
    }

    const signature = await getPermit(this.state.address);
    this.setState({
      queryPermit: signature,
    });

    return;
  };

  queryOwned = async () => {
    this.setState({ isLoading: true });

    let returned = { client: null, address: null };
    if (!this.state.secretJs || !this.state.address) {
      //get SigningCosmWasmClient and store in state
      returned = await getSigningClient().catch((err) => {
        this.emitToast({ msg: "Error connecting to Keplr", msgType: "error" });
        this.setState({isLoading: false});
      });
      if (returned) {
        this.setState({
          secretJs: returned.client,
          address: returned.address,
        });
      }
    }

    if (this.state.secretJs && this.state.address) {
      await this.getPermit().catch((err) => { 
        this.setState({isLoading: false});
      });
      
      //if permit is received query owned tokens and try to verify discord
      if (this.state.queryPermit && Object.keys(this.state.queryPermit).length > 0) {
        const owned = await queryOwnedTokens(
          this.state.address,
          this.state.queryPermit
        );

        if (owned.length > 0) {
          const nftMetaData = await queryTokenMetadata(
            owned[0],
            this.state.queryPermit
          );
          const pKey = nftMetaData.nft_dossier.private_metadata.extension.key;
          const uint8key = Uint8Array.from(pKey);
          const message = new Uint8Array(Buffer.from(this.state.discordTag));
          const signedMessage = signMessage(uint8key, message);
          const response = await verifydiscord(
            signedMessage.toString(),
            owned[0]
          );

          this.setState({ isLoading: false });
          this.emitToast(response);

        } else {
          this.setState({ isLoading: true });
        }
      } 
    } 
  };

  emitToast(message) {
    const toastConfig = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (message.msgType) {
      case "info":
        toast.info(message.msg, toastConfig);
        break;
      case "error":
        toast.error(message.msg, toastConfig);
        break;
      case "success":
        this.setState({ discordTag: "" });
        toast.success(message.msg, toastConfig);
        break;
      default:
        toast.error("Unexpected Error!!!", toastConfig);
    }
  }

  render() {
    return (
      <div className="society-card">
        <Row>
          <Col
            md={{ span: "7" }}
            xs={{ span: 12, offset: 0 }}
            className="society-left-col"
          >
            <h2>Join the Society</h2>
            <div className="discord-input-container">
              <label className="discord-label">
                Discord Username:&nbsp;
                <input
                  className="discord-box lookupBox"
                  placeholder="MTCExample#123"
                  type="text"
                  value={this.state.discordTag}
                  name="discordtagbox"
                  onChange={this.handleLookupDiscordTagChange}
                />
              </label>
            </div>
            <Button
              className="keplrButton"
              onClick={() => this.queryOwned()}
              disabled={
                this.state.isLoading || this.state.discordTag.length < 3
              }
            >
              {!this.state.isLoading && <span>Join The Society</span>}
              {this.state.isLoading && (
                <i className="c-inline-spinner c-inline-spinner-white" />
              )}
            </Button>
          </Col>
          <Col
            md={{ span: "5" }}
            xs={{ span: 12, offset: 0 }}
            className="society-right-col"
          >
            <img
              src="mtc_discord_emblem.png"
              className="steddy-img d-block mx-auto"
              alt="MTC Secret Society"
            ></img>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SecretSocietyCard;
