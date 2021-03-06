import { Col, Layout, Row, Spin } from "antd";
import "antd/dist/antd.css";
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ReactComponent as KlerosLogo } from "./assets/kleros-logo.svg";
import loadable from "@loadable/component";
import styled from "styled-components";
import Web3 from "web3";

const StyledSpin = styled(Spin)`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;
const C404 = loadable(
  () => import(/* webpackPrefetch: true */ "./containers/404"),
  {
    fallback: <StyledSpin />,
  }
);
const Home = loadable(
  () => import(/* webpackPrefetch: true */ "./containers/Home"),
  {
    fallback: <StyledSpin />,
  }
);
const Project = loadable(
  () => import(/* webpackPrefetch: true */ "./containers/Project"),
  {
    fallback: <StyledSpin />,
  }
);
const StyledCol = styled(Col)`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: space-evenly;

  @media (max-width: 575px) {
    &.ant-col-xs-0 {
      display: none;
    }
  }
`;
const StyledLayoutContent = styled(Layout.Content)`
  background: #fff;
  font-family: Open Sans;
  min-height: 100vh;
  padding: 0px 9.375vw 120px 9.375vw;
`;
const StyledHeader = styled(Layout.Header)`
  background: #4d00b4;
`;

class App extends PureComponent {
  render() {
    let web3;
    if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
    }

    return (
      <div>
        <Helmet>
          <title>Kleros · Governor</title>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i"
            rel="stylesheet"
          />
        </Helmet>
        <BrowserRouter>
          <Layout>
            <StyledHeader>
              <Row>
                <StyledCol lg={4} md={4} sm={16} xs={12}>
                  <KlerosLogo />
                </StyledCol>
                <Col
                  lg={16}
                  md={16}
                  xs={12}
                  style={{
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  Governor
                </Col>
                <StyledCol lg={4} md={4} sm={8} xs={24} />
              </Row>
            </StyledHeader>
            <StyledLayoutContent>
              <Switch>
                <Route
                  render={(props) => <Home {...props} web3={web3} />}
                  exact
                  path="/"
                />
                <Route
                  render={(props) => <Project {...props} web3={web3} />}
                  exact
                  path="/:projectName"
                />
                <Route component={C404} />
              </Switch>
            </StyledLayoutContent>
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
