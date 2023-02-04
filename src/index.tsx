import { Col, Layout, Row, Spin } from "antd";
import "antd/dist/antd.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ReactComponent as KlerosLogo } from "./assets/kleros-logo.svg";
import loadable, { LoadableComponent } from "@loadable/component";
import styled from "styled-components";
import { ProjectParams } from "./types";

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
const Project: LoadableComponent<{ match: ProjectParams }> = loadable(
  () => import(/* webpackPrefetch: true */ "./containers/Project"),
  {
    fallback: <StyledSpin />
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

const App = () => (
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
              render={() => <Home />}
              exact
              path="/"
            />
            <Route
              render={(props) => <Project match={props.match} />}
              exact
              path="/:projectName"
            />
            {/* <Route component={C404} /> */}
          </Switch>
        </StyledLayoutContent>
      </Layout>
    </BrowserRouter>
  </div>
);


ReactDOM.render(<App />, document.getElementById("root"));
