import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./views/Home";
import { WorldsContextProvider } from "./context/WorldsContext";
import { AuthProvider } from "./context/AuthContext";
import LocationDetailPage from "./views/LocationDetailPage";
import LocationEditPage from "./views/LocationEditPage";
import LoginPage from "./views/LoginPage";
import WorldEditPage from "./views/WorldEditPage";
import NotFoundPage from "./views/NotFoundPage";
import "./main.css";
import AddLocationPage from "./views/LocationAddPage";
import AddWorldPage from "./views/WorldAddPage";
import SearchResults from "./views/SearchResults";
import { WorldDetailPage } from "./views/WorldDetailPage";

const App = () => {
  return (
    <AuthProvider>
      <WorldsContextProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={LoginPage} />
            <Route
              exact
              path="/locations/:location_id"
              component={LocationDetailPage}
            />
            <Route
              exact
              path="/locations/:location_id/update"
              component={LocationEditPage}
            />
            <Route exact path="/locations/new" component={AddLocationPage} />
            <Route exact path="/worlds/:world_id" component={WorldDetailPage} />
            <Route
              exact
              path="/worlds/:world_id/update"
              component={WorldEditPage}
            />
            <Route exact path="/search" component={SearchResults} />
            <Route exact path="/worlds/new" component={AddWorldPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </WorldsContextProvider>
    </AuthProvider>
  );
};

export default App;
